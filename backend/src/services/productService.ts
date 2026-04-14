import type { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ProductCreateInput {
  name: string;
  description?: string;
  code: string;
  price: number;
  packagingId: string;
  isActive?: boolean;
  stock?: number;
}

export type ProductUpdateInput = Partial<ProductCreateInput>;

function serialize(product: { price: object | number; [key: string]: unknown }) {
  return { ...product, price: Number(product.price) };
}

export async function listProducts(params: ProductListParams) {
  const { page = 1, limit = 10, search, isActive } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { code: { contains: search } },
    ];
  }
  if (isActive !== undefined) where.isActive = isActive;

  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        packaging: { select: { id: true, name: true, type: true } },
      },
    }),
    prisma.product.count({ where }),
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

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      packaging: { select: { id: true, name: true, type: true } },
    },
  });
  if (!product) {
    throw Object.assign(new Error('Produto não encontrado'), { statusCode: 404 });
  }
  return serialize(product);
}

export async function createProduct(data: ProductCreateInput) {
  const existingName = await prisma.product.findUnique({ where: { name: data.name } });
  if (existingName) {
    throw Object.assign(new Error('Nome de produto já cadastrado'), { statusCode: 409 });
  }

  const existingCode = await prisma.product.findUnique({ where: { code: data.code } });
  if (existingCode) {
    throw Object.assign(new Error('Código de produto já cadastrado'), { statusCode: 409 });
  }

  const packaging = await prisma.packaging.findUnique({ where: { id: data.packagingId } });
  if (!packaging) {
    throw Object.assign(new Error('Embalagem não encontrada'), { statusCode: 404 });
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      code: data.code,
      price: data.price,
      packagingId: data.packagingId,
      isActive: data.isActive ?? true,
      stock: data.stock ?? 0,
    },
    include: {
      packaging: { select: { id: true, name: true, type: true } },
    },
  });
  return serialize(product);
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  await getProductById(id);

  if (data.name) {
    const existing = await prisma.product.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) {
      throw Object.assign(new Error('Nome de produto já cadastrado'), { statusCode: 409 });
    }
  }

  if (data.code) {
    const existing = await prisma.product.findFirst({
      where: { code: data.code, NOT: { id } },
    });
    if (existing) {
      throw Object.assign(new Error('Código de produto já cadastrado'), { statusCode: 409 });
    }
  }

  if (data.packagingId) {
    const packaging = await prisma.packaging.findUnique({ where: { id: data.packagingId } });
    if (!packaging) {
      throw Object.assign(new Error('Embalagem não encontrada'), { statusCode: 404 });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: {
      packaging: { select: { id: true, name: true, type: true } },
    },
  });
  return serialize(product);
}

export async function deactivateProduct(id: string) {
  await getProductById(id);
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
    include: {
      packaging: { select: { id: true, name: true, type: true } },
    },
  });
  return serialize(product);
}
