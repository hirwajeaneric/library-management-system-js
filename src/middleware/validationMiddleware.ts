import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express'; // Import RequestHandler type
import { validationResult } from 'express-validator';

export const validate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};