import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret, users } from '../config/database';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = users.find((entry) => entry.email === email);

  if (!user || !bcrypt.compareSync(password ?? '', user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
  return res.json({ token });
};
