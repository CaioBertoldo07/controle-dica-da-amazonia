import type { Prisma, Client } from '@prisma/client';
import { prisma } from '../config/database';

export interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'B2B' | 'B2C';
  isActive?: boolean;
}

export type ClientCreateInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type ClientUpdateInput = Partial<ClientCreateInput>;

function serialize(client: Client) {
  return client;
}

export async function listClients(params: ClientListParams) {
  const { page = 1, limit = 10, search, type, isActive } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ClientWhereInput = {};

  if (search) {
    where.OR = [
      { razaoSocial: { contains: search } },
      { nomeFantasia: { contains: search } },
      { cnpj: { contains: search } },
    ];
  }
  if (type !== undefined) where.type = type;
  if (isActive !== undefined) where.isActive = isActive;

  const [data, total] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { razaoSocial: 'asc' },
    }),
    prisma.client.count({ where }),
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

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw Object.assign(new Error('Cliente não encontrado'), { statusCode: 404 });
  }
  return serialize(client);
}

export async function createClient(data: ClientCreateInput) {
  const existingCnpj = await prisma.client.findUnique({ where: { cnpj: data.cnpj } });
  if (existingCnpj) {
    throw Object.assign(new Error('CNPJ já cadastrado'), { statusCode: 409 });
  }

  const existingEmail = await prisma.client.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    throw Object.assign(new Error('Email já cadastrado'), { statusCode: 409 });
  }

  const client = await prisma.client.create({ data });
  return serialize(client);
}

export async function updateClient(id: string, data: ClientUpdateInput) {
  await getClientById(id);

  if (data.cnpj) {
    const existing = await prisma.client.findFirst({
      where: { cnpj: data.cnpj, NOT: { id } },
    });
    if (existing) {
      throw Object.assign(new Error('CNPJ já cadastrado'), { statusCode: 409 });
    }
  }

  if (data.email) {
    const existing = await prisma.client.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (existing) {
      throw Object.assign(new Error('Email já cadastrado'), { statusCode: 409 });
    }
  }

  const client = await prisma.client.update({ where: { id }, data });
  return serialize(client);
}

export async function deactivateClient(id: string) {
  await getClientById(id);
  const client = await prisma.client.update({
    where: { id },
    data: { isActive: false },
  });
  return serialize(client);
}
