import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', AuthController.validationRules, validate, authController.register.bind(authController));
router.post('/login', AuthController.validationRules.slice(0, 2), validate, authController.login.bind(authController));

export default router;