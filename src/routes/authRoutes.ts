import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', AuthController.validationRules, validate, authController.register);
router.post('/login', AuthController.validationRules.slice(0, 2), validate, authController.login);
router.post('/register-librarian', AuthMiddleware.protect('ADMIN'), authController.registerLibrarian)

export default router;