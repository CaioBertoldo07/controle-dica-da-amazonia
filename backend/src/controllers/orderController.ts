import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { OrderStatus } from '@prisma/client';
import * as orderService from '../services/orderService';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDENTE', 'PROCESSANDO', 'PRODUCAO', 'PREPARADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO',
];

const createOrderSchema = z.object({
  clientId: z.string().uuid('clientId inválido'),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('productId inválido'),
        quantity: z.number().int().min(1).max(10000),
      }),
    )
    .min(1, 'Informe ao menos 1 item')
    .max(3, 'Máximo de 3 produtos distintos por pedido'),
});

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [OrderStatus, ...OrderStatus[]]),
  cancelReason: z.string().max(2000).optional(),
});

export async function listOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = (req.query.search as string) || undefined;
    const status = req.query.status as OrderStatus | undefined;
    const clientId = (req.query.clientId as string) || undefined;

    const result = await orderService.listOrders({ page, limit, search, status, clientId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(data);
    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, cancelReason } = updateStatusSchema.parse(req.body);
    const order = await orderService.updateOrderStatus(req.params.id, status, cancelReason);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}
