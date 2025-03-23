import { Router } from 'express';
import { BorrowController } from '../controllers/borrowController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();
const borrowController = new BorrowController();

router.post('/borrow', AuthMiddleware.protect('LIBRARIAN'), borrowController.borrowBook.bind(borrowController));
router.post('/return/:recordId', AuthMiddleware.protect('LIBRARIAN'), borrowController.returnBook.bind(borrowController));
router.get('/summary', AuthMiddleware.protect('LIBRARIAN'), borrowController.getBorrowSummary.bind(borrowController));
router.get('/overdue', AuthMiddleware.protect('LIBRARIAN'), borrowController.getOverdueBooks.bind(borrowController));

export default router;