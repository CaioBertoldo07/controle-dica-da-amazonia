import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import * as reportController from '../controllers/reportController';

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.get('/summary', reportController.getSummary);
reportsRouter.get('/sales', reportController.getSalesOverTime);
reportsRouter.get('/top-products', reportController.getTopProducts);
reportsRouter.get('/top-clients', reportController.getTopClients);
reportsRouter.get('/packaging-analysis', reportController.getPackagingAnalysis);
