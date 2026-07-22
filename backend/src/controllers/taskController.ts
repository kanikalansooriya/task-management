import type { Request, Response } from 'express';
import { db } from '../config/db';
import type { Task } from '../models/user';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_SORTS = ['newest', 'oldest', 'dueDate'];

const formatTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  status: row.status,
  dueDate: row.dueDate,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  userId: row.userId,
});

export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { search, status, priority, sort } = req.query as Record<string, string>;

  const conditions: string[] = ['user_id = ?'];
  const values: Array<string | number> = [userId || 0];

  if (search) {
    conditions.push('title LIKE ?');
    values.push(`%${search}%`);
  }

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` });
    }
    conditions.push('status = ?');
    values.push(status);
  }

  if (priority) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: `Invalid priority. Allowed values: ${VALID_PRIORITIES.join(', ')}` });
    }
    conditions.push('priority = ?');
    values.push(priority);
  }

  let orderBy = 'created_at DESC';
  if (sort) {
    if (!VALID_SORTS.includes(sort)) {
      return res.status(400).json({ message: `Invalid sort. Allowed values: ${VALID_SORTS.join(', ')}` });
    }
    if (sort === 'oldest') orderBy = 'created_at ASC';
    if (sort === 'dueDate') orderBy = 'due_date ASC';
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT id, title, description, priority, status, due_date AS dueDate, created_at AS createdAt, updated_at AS updatedAt, user_id AS userId FROM tasks ${whereClause} ORDER BY ${orderBy}`;

  try {
    const [rows] = await db.query(query, values);
    return res.json((rows as any[]).map(formatTask));
  } catch (error) {
    console.error('Get tasks error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);

  if (!taskId) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, title, description, priority, status, due_date AS dueDate, created_at AS createdAt, updated_at AS updatedAt, user_id AS userId FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    const tasks = rows as any[];
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(formatTask(tasks[0]));
  } catch (error) {
    console.error('Get task by id error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const validateTaskPayload = (payload: Partial<Task>) => {
  const errors: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!payload.title || !payload.title.trim()) {
    errors.push('Title is required.');
  }

  if (!payload.priority) {
    errors.push('Priority is required.');
  } else if (!VALID_PRIORITIES.includes(payload.priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (!payload.status) {
    errors.push('Status is required.');
  } else if (!VALID_STATUSES.includes(payload.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (!payload.dueDate) {
    errors.push('Due date is required.');
  } else {
    const dueDate = new Date(payload.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    if (Number.isNaN(dueDate.getTime())) {
      errors.push('Due date must be a valid date.');
    } else if (dueDate < today) {
      errors.push('Due date cannot be before today.');
    }
  }

  return errors;
};

export const createTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { title, description, priority, status, dueDate } = req.body as Partial<Task>;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const errors = validateTaskPayload({ title, description: description || '', priority, status, dueDate, createdAt: '', updatedAt: '', userId });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, priority, status, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', priority, status, dueDate, userId]
    );

    const insertResult = result as { insertId: number };
    const newTask: Task = {
      id: insertResult.insertId,
      title: title!.trim(),
      description: description || '',
      priority: priority!,
      status: status!,
      dueDate: dueDate!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);
  const { title, description, priority, status, dueDate } = req.body as Partial<Task>;

  if (!taskId) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const errors = validateTaskPayload({ title, description: description || '', priority, status, dueDate, createdAt: '', updatedAt: '', userId });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [title, description || '', priority, status, dueDate, taskId, userId]
    );

    const updateResult = result as { affectedRows: number };
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.json({ id: taskId, title, description: description || '', priority, status, dueDate, userId });
  } catch (error) {
    console.error('Update task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);

  if (!taskId) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    const deleteResult = result as { affectedRows: number };

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  try {
    const [rows] = await db.query(
      `SELECT
        COUNT(*) AS totalTasks,
        SUM(status = 'Pending') AS pendingTasks,
        SUM(status = 'In Progress') AS inProgressTasks,
        SUM(status = 'Completed') AS completedTasks,
        SUM(due_date < ? AND status <> 'Completed') AS overdueTasks
      FROM tasks
      WHERE user_id = ?`,
      [todayString, userId]
    );

    const stats = (rows as any[])[0] || {
      totalTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
    };

    return res.json({
      totalTasks: Number(stats.totalTasks ?? 0),
      pendingTasks: Number(stats.pendingTasks ?? 0),
      inProgressTasks: Number(stats.inProgressTasks ?? 0),
      completedTasks: Number(stats.completedTasks ?? 0),
      overdueTasks: Number(stats.overdueTasks ?? 0),
    });
  } catch (error) {
    console.error('Dashboard error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
