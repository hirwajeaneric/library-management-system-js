import { Router } from 'express';
import { BorrowController } from '../controllers/borrowController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();
const borrowController = new BorrowController();

router.post('/borrow', AuthMiddleware.protect('LIBRARIAN'), borrowController.borrowBook);
router.post('/return/:recordId', AuthMiddleware.protect('LIBRARIAN'), borrowController.returnBook);
router.get('/summary', AuthMiddleware.protect('LIBRARIAN'), borrowController.getBorrowSummary);
router.get('/overdue', AuthMiddleware.protect('LIBRARIAN'), borrowController.getOverdueBooks);

export default router;