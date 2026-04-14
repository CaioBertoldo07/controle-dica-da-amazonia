import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listClients,
  getClient,
  createClient,
  updateClient,
  patchClient,
  deleteClient,
} from '../controllers/clientController';

const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get('/', listClients);
clientsRouter.get('/:id', getClient);
clientsRouter.post('/', authorize('admin', 'gestor'), createClient);
clientsRouter.put('/:id', authorize('admin', 'gestor'), updateClient);
clientsRouter.patch('/:id', authorize('admin', 'gestor'), patchClient);
clientsRouter.delete('/:id', authorize('admin', 'gestor'), deleteClient);

export { clientsRouter };
