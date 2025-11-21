import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthRequest extends Request { user?: { id: string }; }

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
