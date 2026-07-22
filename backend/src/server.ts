import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';
import { tasks } from './config/database';
import type { Task } from './models/user';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const userTasks = tasks.filter((task) => task.userId === userId);
  return res.json(userTasks);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const { title, description, priority, status, dueDate } = req.body;

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    description,
    priority,
    status,
    dueDate,
    userId: userId || 1
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === taskId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(index, 1);
  return res.json({ message: 'Task deleted' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
