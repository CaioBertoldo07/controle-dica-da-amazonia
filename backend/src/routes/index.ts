import { Router } from 'express';
import { authRouter } from './auth';
import { clientsRouter } from './clients';
import { productsRouter } from './products';
import { packagingsRouter } from './packagings';

const router = Router();

router.use('/auth', authRouter);
router.use('/clients', clientsRouter);
router.use('/products', productsRouter);
router.use('/packagings', packagingsRouter);

export { router };
