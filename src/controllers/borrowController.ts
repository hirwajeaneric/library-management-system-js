import { Request, Response, NextFunction } from 'express';
import { BorrowModel } from '../models/borrowModel';
import logger from '../config/logger';

export class BorrowController {
  private borrowModel: BorrowModel;

  constructor() {
    this.borrowModel = new BorrowModel();
  }

  borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, bookId } = req.query;
    try {
      const record = await this.borrowModel.borrowBook(Number(userId), Number(bookId));
      logger.info(`Book ${bookId} borrowed by user ${userId}`);
      res.status(201).json({ ...record, id: Number(record.id), userId: Number(record.userId), bookId: Number(record.bookId) });
    } catch (err) {
      logger.error(`Borrow failed: ${err}`);
      next(err);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { recordId } = req.params;
    try {
      const record = await this.borrowModel.returnBook(Number(recordId));
      logger.info(`Book returned: record ${recordId}`);
      res.json({ ...record, id: Number(record.id), userId: Number(record.userId), bookId: Number(record.bookId) });
    } catch (err) {
      logger.error(`Return failed: ${err}`);
      next(err);
    }
  };

  getBorrowSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summaries = await this.borrowModel.prisma.$queryRaw<any[]>`SELECT * FROM user_borrow_summary`;
      res.json(summaries);
    } catch (err) {
      logger.error(`Failed to fetch borrow summary: ${err}`);
      next(new Error('Failed to fetch borrow summary'));
    }
  };

  getOverdueBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overdue = await this.borrowModel.prisma.$queryRaw<any[]>`SELECT * FROM overdue_books`;
      res.json(overdue);
    } catch (err) {
      logger.error(`Failed to fetch overdue books: ${err}`);
      next(new Error('Failed to fetch overdue books'));
    }
  };
}