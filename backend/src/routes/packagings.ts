import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listPackagings,
  getPackaging,
  createPackaging,
  updatePackaging,
  patchPackaging,
  adjustStock,
} from '../controllers/packagingController';

const packagingsRouter = Router();

packagingsRouter.use(authenticate);

packagingsRouter.get('/', listPackagings);
packagingsRouter.get('/:id', getPackaging);
packagingsRouter.post('/', authorize('admin', 'gestor'), createPackaging);
packagingsRouter.put('/:id', authorize('admin', 'gestor'), updatePackaging);
packagingsRouter.patch('/:id', authorize('admin', 'gestor'), patchPackaging);
packagingsRouter.patch('/:id/stock', authorize('admin', 'gestor', 'operador'), adjustStock);

export { packagingsRouter };
