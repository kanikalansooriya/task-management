import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/database';
import { db } from '../config/db';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    const users = rows as Array<{ id: number; name: string; email: string; password: string }>;
    const user = users[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
