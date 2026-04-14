import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as packagingService from '../services/packagingService';

const packagingSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['PADRAO', 'ESPECIAL']),
  description: z.string().optional(),
  unitCost: z.coerce.number().positive('Custo unitário deve ser maior que zero'),
  currentStock: z.coerce.number().int().min(0).optional().default(0),
  minimumStock: z.coerce.number().int().min(0).optional().default(100),
  supplier: z.string().max(255).optional(),
  supplierContact: z.string().max(15).optional(),
  lastPurchaseDate: z.string().optional(),
  lastPurchaseQty: z.coerce.number().int().min(1).optional(),
});

const patchSchema = packagingSchema.partial();

const stockSchema = z.object({
  operation: z.enum(['add', 'remove']),
  quantity: z.coerce.number().int().positive('Quantidade deve ser maior que zero'),
});

export async function listPackagings(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = (req.query.search as string) || undefined;

    const result = await packagingService.listPackagings({ page, limit, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPackaging(req: Request, res: Response, next: NextFunction) {
  try {
    const packaging = await packagingService.getPackagingById(req.params.id);
    res.json({ data: packaging });
  } catch (err) {
    next(err);
  }
}

export async function createPackaging(req: Request, res: Response, next: NextFunction) {
  try {
    const data = packagingSchema.parse(req.body);
    const packaging = await packagingService.createPackaging(data);
    res.status(201).json({ data: packaging });
  } catch (err) {
    next(err);
  }
}

export async function updatePackaging(req: Request, res: Response, next: NextFunction) {
  try {
    const data = packagingSchema.parse(req.body);
    const packaging = await packagingService.updatePackaging(req.params.id, data);
    res.json({ data: packaging });
  } catch (err) {
    next(err);
  }
}

export async function patchPackaging(req: Request, res: Response, next: NextFunction) {
  try {
    const data = patchSchema.parse(req.body);
    const packaging = await packagingService.updatePackaging(req.params.id, data);
    res.json({ data: packaging });
  } catch (err) {
    next(err);
  }
}

export async function adjustStock(req: Request, res: Response, next: NextFunction) {
  try {
    const input = stockSchema.parse(req.body);
    const packaging = await packagingService.adjustStock(req.params.id, input);
    res.json({ data: packaging });
  } catch (err) {
    next(err);
  }
}
