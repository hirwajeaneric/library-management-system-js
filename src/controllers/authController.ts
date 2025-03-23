import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { generateToken } from '../utils/jwtUtils';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware';
import bcrypt from 'bcryptjs';
import logger from '../config/logger';

export class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  static validationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('role').isIn(['ADMIN', 'LIBRARIAN', 'USER']).withMessage('Invalid role')
  ];

  async register(req: Request, res: Response) {
    const { username, password, email, role } = req.body;
    try {
      const user = await this.userModel.createUser(username, password, email, role);
      const token = generateToken(Number(user.id), user.role);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      logger.info(`User registered: ${username}`);
      res.status(201).json({ id: user.id, username, role });
    } catch (err) {
      throw new Error('Registration failed');
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      const user = await this.userModel.findByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        logger.warn(`Login failed for ${username}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken(Number(user.id), user.role);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      logger.info(`User logged in: ${username}`);
      res.json({ id: user.id, username, role: user.role });
    } catch (err) {
      throw new Error('Login failed');
    }
  }
}