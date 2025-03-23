import { Request, Response, NextFunction } from 'express';
import { BorrowModel } from '../models/borrowModel';
import logger from '../config/logger';

export class UserController {
  private borrowModel: BorrowModel;

  constructor() {
    this.borrowModel = new BorrowModel();
  }

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.query;
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    try {
      const history = await this.borrowModel.getUserHistory(Number(userId), page, size);
      logger.info(`History fetched for user ${userId}`);
      res.json(history);
    } catch (err) {
      logger.error(`Failed to fetch history: ${err}`);
      next(new Error('Failed to fetch history'));
    }
  };
}