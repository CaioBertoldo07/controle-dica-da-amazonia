import type { Prisma, OrderStatus } from '@prisma/client';
import { prisma } from '../config/database';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  clientId?: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  clientId: string;
  notes?: string;
  items: OrderItemInput[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function serializeDecimal<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && 'toNumber' in (value as object)) {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function serializeOrder(order: Record<string, unknown>) {
  const base = serializeDecimal(order as Record<string, unknown>);
  if (Array.isArray(base.items)) {
    base.items = (base.items as Record<string, unknown>[]).map((item) => serializeDecimal(item));
  }
  return base;
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PED-${year}-`;

  const last = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: 'desc' },
    select: { orderNumber: true },
  });

  let seq = 1;
  if (last) {
    const parts = last.orderNumber.split('-');
    seq = parseInt(parts[parts.length - 1]) + 1;
  }

  return `${prefix}${String(seq).padStart(4, '0')}`;
}

// Status machine: which statuses can transition to which
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDENTE:    ['PROCESSANDO', 'CANCELADO'],
  PROCESSANDO: ['PRODUCAO', 'CANCELADO'],
  PRODUCAO:    ['PREPARADO', 'CANCELADO'],
  PREPARADO:   ['ENVIADO', 'CANCELADO'],
  ENVIADO:     ['ENTREGUE', 'CANCELADO'],
  ENTREGUE:    [],
  CANCELADO:   [],
};

// When cancelled from these statuses, packaging stock must be released
const PACKAGING_RESERVED_STATUSES: OrderStatus[] = ['PROCESSANDO', 'PRODUCAO', 'PREPARADO', 'ENVIADO'];

// ─── Service functions ────────────────────────────────────────────────────────

export async function listOrders(params: OrderListParams) {
  const { page = 1, limit = 10, search, status, clientId } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { client: { razaoSocial: { contains: search } } },
      { client: { nomeFantasia: { contains: search } } },
    ];
  }
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;

  const [data, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, razaoSocial: true, nomeFantasia: true } },
        items: {
          include: { product: { select: { id: true, name: true, code: true } } },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: data.map(serializeOrder),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, razaoSocial: true, nomeFantasia: true, cidade: true, uf: true } },
      items: {
        include: {
          product: {
            select: {
              id: true, name: true, code: true,
              packaging: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw Object.assign(new Error('Pedido não encontrado'), { statusCode: 404 });
  }

  return serializeOrder(order as unknown as Record<string, unknown>);
}

export async function createOrder(input: CreateOrderInput) {
  const { clientId, notes, items } = input;

  // Validate client exists and is active
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw Object.assign(new Error('Cliente não encontrado'), { statusCode: 404 });
  if (!client.isActive) throw Object.assign(new Error('Cliente inativo'), { statusCode: 422 });

  // Validate items count
  if (!items || items.length === 0) throw Object.assign(new Error('Pedido deve ter pelo menos 1 item'), { statusCode: 422 });

  // Check for duplicate products
  const productIds = items.map((i) => i.productId);
  if (new Set(productIds).size !== productIds.length) {
    throw Object.assign(new Error('Produtos duplicados no pedido'), { statusCode: 422 });
  }

  // Validate each item and fetch prices
  const enrichedItems: { productId: string; quantity: number; unitPrice: number; subtotal: number }[] = [];
  for (const item of items) {
    if (item.quantity < 1 || item.quantity > 10000) {
      throw Object.assign(new Error(`Quantidade deve ser entre 1 e 10.000`), { statusCode: 422 });
    }
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw Object.assign(new Error(`Produto não encontrado: ${item.productId}`), { statusCode: 404 });
    if (!product.isActive) throw Object.assign(new Error(`Produto inativo: ${product.name}`), { statusCode: 422 });

    const unitPrice = Number(product.price);
    enrichedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    });
  }

  const total = enrichedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clientId,
      total,
      notes,
      items: {
        create: enrichedItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.subtotal,
        })),
      },
    },
    include: {
      client: { select: { id: true, razaoSocial: true, nomeFantasia: true } },
      items: {
        include: { product: { select: { id: true, name: true, code: true } } },
      },
    },
  });

  return serializeOrder(order as unknown as Record<string, unknown>);
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  cancelReason?: string,
) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { include: { packaging: true } },
        },
      },
    },
  });

  if (!order) throw Object.assign(new Error('Pedido não encontrado'), { statusCode: 404 });

  const currentStatus = order.status;

  // Validate transition
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    throw Object.assign(
      new Error(`Transição inválida: ${currentStatus} → ${newStatus}`),
      { statusCode: 422 },
    );
  }

  // cancelReason required when cancelling from PRODUCAO or later
  if (
    newStatus === 'CANCELADO' &&
    ['PRODUCAO', 'PREPARADO', 'ENVIADO'].includes(currentStatus) &&
    !cancelReason?.trim()
  ) {
    throw Object.assign(
      new Error('Motivo de cancelamento é obrigatório nesta etapa'),
      { statusCode: 422 },
    );
  }

  // Packaging stock operations in a transaction
  await prisma.$transaction(async (tx) => {
    // Reserve packaging on → PROCESSANDO
    if (newStatus === 'PROCESSANDO') {
      for (const item of order.items) {
        const packagingId = item.product.packagingId;
        const packaging = item.product.packaging;

        if (item.quantity > packaging.currentStock) {
          throw Object.assign(
            new Error(`Estoque insuficiente da embalagem "${packaging.name}" (disponível: ${packaging.currentStock})`),
            { statusCode: 422 },
          );
        }

        await tx.packaging.update({
          where: { id: packagingId },
          data: { currentStock: { decrement: item.quantity } },
        });
      }
    }

    // Release packaging on → CANCELADO (if was reserved)
    if (newStatus === 'CANCELADO' && PACKAGING_RESERVED_STATUSES.includes(currentStatus)) {
      for (const item of order.items) {
        await tx.packaging.update({
          where: { id: item.product.packagingId },
          data: { currentStock: { increment: item.quantity } },
        });
      }
    }

    // Update order status
    await tx.order.update({
      where: { id },
      data: {
        status: newStatus,
        cancelReason: newStatus === 'CANCELADO' ? (cancelReason ?? null) : undefined,
      },
    });
  });

  return getOrderById(id);
}
