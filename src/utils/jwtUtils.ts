import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export const generateToken = (userId: number, role: Role): string => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: Role };
};