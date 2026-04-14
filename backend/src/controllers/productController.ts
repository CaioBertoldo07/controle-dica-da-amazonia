import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as productService from '../services/productService';

const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  code: z.string().min(2).max(20),
  price: z.coerce.number().positive('Preço deve ser maior que zero'),
  packagingId: z.string().uuid('ID de embalagem inválido'),
  isActive: z.boolean().optional().default(true),
  stock: z.coerce.number().int().min(0).optional().default(0),
});

const patchSchema = productSchema.partial();

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = (req.query.search as string) || undefined;
    const isActive =
      req.query.isActive === 'true' ? true
      : req.query.isActive === 'false' ? false
      : undefined;

    const result = await productService.listProducts({ page, limit, search, isActive });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, data);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function patchProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = patchSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, data);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await productService.deactivateProduct(req.params.id);
    res.json({ message: 'Produto desativado com sucesso' });
  } catch (err) {
    next(err);
  }
}
