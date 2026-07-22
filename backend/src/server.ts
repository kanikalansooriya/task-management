import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'devsecret';

app.use(cors());
app.use(express.json());

interface User {
  id: number;
  email: string;
  password: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  userId: number;
}

const users: User[] = [
  {
    id: 1,
    email: 'admin@test.com',
    password: bcrypt.hashSync('123456', 10)
  }
];

const tasks: Task[] = [
  {
    id: 1,
    title: 'Prepare project proposal',
    description: 'Draft the initial proposal for the internship submission.',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-07-25',
    userId: 1
  },
  {
    id: 2,
    title: 'Review dashboard mockups',
    description: 'Inspect the latest UI wireframes.',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-07-22',
    userId: 1
  },
  {
    id: 3,
    title: 'Finalize testing checklist',
    description: 'Complete the checklist for release validation.',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-07-20',
    userId: 1
  }
];

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    (req as express.Request & { user?: { id: number } }).user = { id: decoded.userId };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((entry) => entry.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
  return res.json({ token });
});

app.get('/api/tasks', authenticateToken, (req, res) => {
  const userId = (req as express.Request & { user?: { id: number } }).user?.id;
  const userTasks = tasks.filter((task) => task.userId === userId);
  return res.json(userTasks);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const userId = (req as express.Request & { user?: { id: number } }).user?.id;
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
