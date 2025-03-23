import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

router.get('/history', AuthMiddleware.protect('USER'), userController.getHistory);

export default router;