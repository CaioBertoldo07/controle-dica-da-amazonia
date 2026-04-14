import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as clientService from '../services/clientService';

const clientSchema = z.object({
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  razaoSocial: z.string().min(2).max(255),
  nomeFantasia: z.string().min(2).max(255),
  type: z.enum(['B2B', 'B2C']),
  inscrEstadual: z.string().max(20).optional(),
  pessoaContatoNome: z.string().min(2).max(255),
  pessoaContatoCPF: z.string().max(14).optional(),
  email: z.string().email('Email inválido').max(255),
  telefone: z.string().min(10).max(15),
  whatsapp: z.string().min(10).max(15),
  endereco: z.string().min(2).max(255),
  numero: z.string().min(1).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().min(2).max(100),
  cidade: z.string().min(2).max(100),
  uf: z.string().length(2, 'UF deve ter 2 caracteres').toUpperCase(),
  cep: z.string().min(8).max(10),
  observacoes: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const patchSchema = clientSchema.partial();

export async function listClients(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = (req.query.search as string) || undefined;
    const type = req.query.type as 'B2B' | 'B2C' | undefined;
    const isActive =
      req.query.isActive === 'true' ? true
      : req.query.isActive === 'false' ? false
      : undefined;

    const result = await clientService.listClients({ page, limit, search, type, isActive });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getClient(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.json({ data: client });
  } catch (err) {
    next(err);
  }
}

export async function createClient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = clientSchema.parse(req.body);
    const client = await clientService.createClient(data as any);
    res.status(201).json({ data: client });
  } catch (err) {
    next(err);
  }
}

export async function updateClient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = clientSchema.parse(req.body);
    const client = await clientService.updateClient(req.params.id, data as any);
    res.json({ data: client });
  } catch (err) {
    next(err);
  }
}

export async function patchClient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = patchSchema.parse(req.body);
    const client = await clientService.updateClient(req.params.id, data as any);
    res.json({ data: client });
  } catch (err) {
    next(err);
  }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
  try {
    await clientService.deactivateClient(req.params.id);
    res.json({ message: 'Cliente desativado com sucesso' });
  } catch (err) {
    next(err);
  }
}
