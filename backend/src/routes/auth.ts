import { Router } from 'express';
import { loginController, meController } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.get('/me', authenticate, meController);

export { authRouter };
