import { Request, Response } from 'express';
import { BookModel } from '../models/bookModel';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware';
import logger from '../config/logger';

export class BookController {
  private bookModel: BookModel;

  constructor() {
    this.bookModel = new BookModel();
  }

  static validationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be positive')
  ];

  async addBook(req: Request, res: Response) {
    const { title, author, isbn, totalCopies } = req.body;
    try {
      const book = await this.bookModel.createBook(title, author, isbn, totalCopies);
      logger.info(`Book added: ${title}`);
      res.status(201).json(book);
    } catch (err) {
      throw new Error('Failed to add book');
    }
  }
}