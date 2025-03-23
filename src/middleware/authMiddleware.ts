import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import logger from '../config/logger';

export class AuthMiddleware {
  static protect(role?: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.token;
      if (!token) {
        logger.warn('No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        if (role && decoded.role !== role) {
          logger.warn(`User role ${decoded.role} not authorized for ${role} route`);
          return res.status(403).json({ message: 'Forbidden' });
        }
        next();
      } catch (err) {
        logger.error(`Token verification failed: ${err}`);
        return res.status(401).json({ message: 'Invalid token' });
      }
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; role: string };
    }
  }
}