import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';
import { db } from './config/db';
import type { Task } from './models/user';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/tasks', authenticateToken, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [rows] = await db.query(
      'SELECT id, title, description, priority, status, dueDate, userId FROM tasks WHERE userId = ?',
      [userId]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Get tasks error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const { title, description, priority, status, dueDate } = req.body as Partial<Task>;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, priority, status, dueDate, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, priority, status, dueDate, userId]
    );

    const insertResult = result as { insertId: number };
    const newTask: Task = {
      id: insertResult.insertId,
      title: title || '',
      description: description || '',
      priority: priority || '',
      status: status || '',
      dueDate: dueDate || '',
      userId,
    };

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);
  const { title, description, priority, status, dueDate } = req.body as Partial<Task>;

  try {
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, dueDate = ? WHERE id = ? AND userId = ?',
      [title, description, priority, status, dueDate, taskId, userId]
    );

    const updateResult = result as { affectedRows: number };
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.json({ id: taskId, title, description, priority, status, dueDate, userId });
  } catch (error) {
    console.error('Update task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const taskId = Number(req.params.id);

  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
    const deleteResult = result as { affectedRows: number };

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

async function testDatabase() {
  try {
    await db.query('SELECT 1');
    console.log('MySQL Connected Successfully');
  } catch (error) {
    console.error('MySQL Connection Failed', error);
  }
}

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await testDatabase();
});
