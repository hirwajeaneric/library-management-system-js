import { Request, Response } from 'express';
import { BorrowModel } from '../models/borrowModel';
import logger from '../config/logger';

export class BorrowController {
  private borrowModel: BorrowModel;

  constructor() {
    this.borrowModel = new BorrowModel();
  }

  async borrowBook(req: Request, res: Response) {
    const { userId, bookId } = req.query;
    try {
      const record = await this.borrowModel.borrowBook(Number(userId), Number(bookId));
      logger.info(`Book ${bookId} borrowed by user ${userId}`);
      res.status(201).json(record);
    } catch (err) {
      throw err;
    }
  }

  async returnBook(req: Request, res: Response) {
    const { recordId } = req.params;
    try {
      const record = await this.borrowModel.returnBook(Number(recordId));
      logger.info(`Book returned: record ${recordId}`);
      res.json(record);
    } catch (err) {
      throw err;
    }
  }

  async getBorrowSummary(req: Request, res: Response) {
    const summaries = await this.borrowModel.prisma.$queryRaw<any[]>`SELECT * FROM user_borrow_summary`;
    res.json(summaries);
  }

  async getOverdueBooks(req: Request, res: Response) {
    const overdue = await this.borrowModel.prisma.$queryRaw<any[]>`SELECT * FROM overdue_books`;
    res.json(overdue);
  }
}