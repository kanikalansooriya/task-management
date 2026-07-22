import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import type { Task, User } from '../models/user';

dotenv.config();

export const users: User[] = [
  {
    id: 1,
    email: 'admin@test.com',
    password: bcrypt.hashSync('123456', 10)
  }
];

export const tasks: Task[] = [
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

export const jwtSecret = process.env.JWT_SECRET || 'devsecret';
