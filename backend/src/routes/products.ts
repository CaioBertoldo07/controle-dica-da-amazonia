import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/productController';

const productsRouter = Router();

productsRouter.use(authenticate);

productsRouter.get('/', listProducts);
productsRouter.get('/:id', getProduct);
productsRouter.post('/', authorize('admin', 'gestor'), createProduct);
productsRouter.put('/:id', authorize('admin', 'gestor'), updateProduct);
productsRouter.patch('/:id', authorize('admin', 'gestor'), patchProduct);
productsRouter.delete('/:id', authorize('admin', 'gestor'), deleteProduct);

export { productsRouter };
