import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express'; // Import RequestHandler type
import { verifyToken } from '../utils/jwtUtils';
import logger from '../config/logger';

export class AuthMiddleware {
  static protect(role?: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.token;
      if (!token) {
        logger.warn('No token provided');
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        if (role && decoded.role !== role) {
          logger.warn(`User role ${decoded.role} not authorized for ${role} route`);
          res.status(403).json({ message: 'Forbidden' });
          return;
        }
        next();
      } catch (err) {
        logger.error(`Token verification failed: ${err}`);
        res.status(401).json({ message: 'Invalid token' });
        return;
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