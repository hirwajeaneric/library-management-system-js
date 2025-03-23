import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';

const router = Router();
const bookController = new BookController();

router.post('/', AuthMiddleware.protect('LIBRARIAN'), BookController.validationRules, validate, bookController.addBook.bind(bookController));

export default router;