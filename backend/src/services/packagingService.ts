import type { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface PackagingListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PackagingCreateInput {
  name: string;
  type: 'PADRAO' | 'ESPECIAL';
  description?: string;
  unitCost: number;
  currentStock?: number;
  minimumStock?: number;
  supplier?: string;
  supplierContact?: string;
  lastPurchaseDate?: string;
  lastPurchaseQty?: number;
}

export type PackagingUpdateInput = Partial<PackagingCreateInput>;

export interface StockAdjustInput {
  operation: 'add' | 'remove';
  quantity: number;
}

function serialize<T extends { unitCost: object | number }>(packaging: T): Omit<T, 'unitCost'> & { unitCost: number } {
  return { ...packaging, unitCost: Number(packaging.unitCost) };
}

export async function listPackagings(params: PackagingListParams) {
  const { page = 1, limit = 10, search } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.PackagingWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { supplier: { contains: search } },
    ];
  }

  const [data, total] = await prisma.$transaction([
    prisma.packaging.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.packaging.count({ where }),
  ]);

  return {
    data: data.map(serialize),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPackagingById(id: string) {
  const packaging = await prisma.packaging.findUnique({ where: { id } });
  if (!packaging) {
    throw Object.assign(new Error('Embalagem não encontrada'), { statusCode: 404 });
  }
  return serialize(packaging);
}

export async function createPackaging(data: PackagingCreateInput) {
  const existing = await prisma.packaging.findUnique({ where: { name: data.name } });
  if (existing) {
    throw Object.assign(new Error('Nome de embalagem já cadastrado'), { statusCode: 409 });
  }

  const packaging = await prisma.packaging.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      unitCost: data.unitCost,
      currentStock: data.currentStock ?? 0,
      minimumStock: data.minimumStock ?? 100,
      supplier: data.supplier,
      supplierContact: data.supplierContact,
      lastPurchaseDate: data.lastPurchaseDate ? new Date(data.lastPurchaseDate) : undefined,
      lastPurchaseQty: data.lastPurchaseQty,
    },
  });
  return serialize(packaging);
}

export async function updatePackaging(id: string, data: PackagingUpdateInput) {
  await getPackagingById(id);

  if (data.name) {
    const existing = await prisma.packaging.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) {
      throw Object.assign(new Error('Nome de embalagem já cadastrado'), { statusCode: 409 });
    }
  }

  const packaging = await prisma.packaging.update({
    where: { id },
    data: {
      ...data,
      lastPurchaseDate: data.lastPurchaseDate ? new Date(data.lastPurchaseDate) : undefined,
    },
  });
  return serialize(packaging);
}

export async function adjustStock(id: string, input: StockAdjustInput) {
  const packaging = await getPackagingById(id);
  const current = packaging.currentStock as number;

  if (input.operation === 'remove' && input.quantity > current) {
    throw Object.assign(
      new Error(`Estoque insuficiente. Disponível: ${current}`),
      { statusCode: 422 },
    );
  }

  const newStock =
    input.operation === 'add' ? current + input.quantity : current - input.quantity;

  const updated = await prisma.packaging.update({
    where: { id },
    data: { currentStock: newStock },
  });
  return serialize(updated);
}
