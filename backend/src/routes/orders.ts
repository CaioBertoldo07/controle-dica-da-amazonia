import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import * as orderController from '../controllers/orderController';

export const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.get('/', orderController.listOrders);
ordersRouter.get('/:id', orderController.getOrder);
ordersRouter.post('/', authorize('admin', 'gestor', 'vendedor'), orderController.createOrder);
ordersRouter.patch('/:id/status', authorize('admin', 'gestor', 'operador'), orderController.updateOrderStatus);
