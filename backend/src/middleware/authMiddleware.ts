import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/database';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
