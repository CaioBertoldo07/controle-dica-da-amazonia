import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockEnv } from '../helpers/mocks';

vi.mock('../../config/env', () => ({ env: mockEnv }));

const prismaMock = vi.hoisted(() => ({
  client: { findUnique: vi.fn() },
  product: { findUnique: vi.fn() },
  order: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  packaging: { update: vi.fn() },
  $transaction: vi.fn(),
}));

vi.mock('../../config/database', () => ({ prisma: prismaMock }));

import { createOrder, updateOrderStatus } from '../../services/orderService';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const activeClient = { id: 'client-1', razaoSocial: 'Test Client LTDA', isActive: true };
const inactiveClient = { ...activeClient, isActive: false };

const activeProduct = {
  id: 'prod-1',
  name: 'Café de Açaí',
  code: 'CAF-001',
  price: { toNumber: () => 25.5 } as unknown as number,
  isActive: true,
  packagingId: 'pack-1',
  packaging: { id: 'pack-1', name: 'Embalagem Padrão', currentStock: 100 },
};

const inactiveProduct = { ...activeProduct, id: 'prod-inactive', isActive: false };

function makeOrder(overrides = {}) {
  return {
    id: 'order-1',
    orderNumber: 'PED-2026-0001',
    status: 'PENDENTE',
    total: { toNumber: () => 25.5 },
    clientId: 'client-1',
    notes: null,
    cancelReason: null,
    createdAt: new Date(),
    items: [],
    client: activeClient,
    ...overrides,
  };
}

// ─── createOrder tests ────────────────────────────────────────────────────────

describe('orderService.createOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.order.findFirst.mockResolvedValue(null);
    prismaMock.order.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({
        ...makeOrder(),
        ...data,
        total: { toNumber: () => Number(data.total ?? 0) },
        items: [],
        client: activeClient,
      }),
    );
  });

  it('throws 404 when client does not exist', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(null);

    await expect(
      createOrder({ clientId: 'non-existent', items: [{ productId: 'p1', quantity: 1 }] }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 422 when client is inactive', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(inactiveClient);

    await expect(
      createOrder({ clientId: 'client-1', items: [{ productId: 'p1', quantity: 1 }] }),
    ).rejects.toMatchObject({ message: 'Cliente inativo', statusCode: 422 });
  });

  it('throws 422 when items is empty', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);

    await expect(createOrder({ clientId: 'client-1', items: [] })).rejects.toMatchObject({
      statusCode: 422,
    });
  });

  it('throws 422 when products are duplicated', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);

    await expect(
      createOrder({
        clientId: 'client-1',
        items: [
          { productId: 'prod-1', quantity: 2 },
          { productId: 'prod-1', quantity: 3 },
        ],
      }),
    ).rejects.toMatchObject({ message: 'Produtos duplicados no pedido', statusCode: 422 });
  });

  it('throws 422 when quantity is 0', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);

    await expect(
      createOrder({ clientId: 'client-1', items: [{ productId: 'prod-1', quantity: 0 }] }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it('throws 422 when quantity exceeds 10000', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);

    await expect(
      createOrder({ clientId: 'client-1', items: [{ productId: 'prod-1', quantity: 10001 }] }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it('throws 404 when product does not exist', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);
    prismaMock.product.findUnique.mockResolvedValueOnce(null);

    await expect(
      createOrder({ clientId: 'client-1', items: [{ productId: 'non-existent', quantity: 1 }] }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 422 when product is inactive', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);
    prismaMock.product.findUnique.mockResolvedValueOnce(inactiveProduct);

    await expect(
      createOrder({ clientId: 'client-1', items: [{ productId: 'prod-inactive', quantity: 1 }] }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it('creates order successfully with valid input', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);
    prismaMock.product.findUnique.mockResolvedValueOnce(activeProduct);

    const result = await createOrder({
      clientId: 'client-1',
      items: [{ productId: 'prod-1', quantity: 2 }],
    });

    expect(result).toHaveProperty('orderNumber');
    expect(prismaMock.order.create).toHaveBeenCalledOnce();
  });
});

// ─── updateOrderStatus tests ──────────────────────────────────────────────────

function orderWithItems(status: string) {
  return {
    id: 'order-1',
    orderNumber: 'PED-2026-0001',
    status,
    total: { toNumber: () => 25.5 },
    clientId: 'client-1',
    notes: null,
    cancelReason: null,
    createdAt: new Date(),
    client: activeClient,
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 5,
        unitPrice: 25.5,
        subtotal: 127.5,
        product: {
          id: 'prod-1',
          name: 'Café de Açaí',
          code: 'CAF-001',
          packagingId: 'pack-1',
          packaging: { id: 'pack-1', name: 'Embalagem Padrão', currentStock: 100 },
        },
      },
    ],
  };
}

describe('orderService.updateOrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when order does not exist', async () => {
    prismaMock.order.findUnique.mockResolvedValueOnce(null);

    await expect(updateOrderStatus('non-existent', 'PROCESSANDO')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 422 on invalid transition PENDENTE → PRODUCAO', async () => {
    prismaMock.order.findUnique.mockResolvedValueOnce(orderWithItems('PENDENTE'));

    await expect(updateOrderStatus('order-1', 'PRODUCAO')).rejects.toMatchObject({
      statusCode: 422,
    });
  });

  it('throws 422 on invalid transition ENTREGUE → CANCELADO', async () => {
    prismaMock.order.findUnique.mockResolvedValueOnce(orderWithItems('ENTREGUE'));

    await expect(updateOrderStatus('order-1', 'CANCELADO')).rejects.toMatchObject({
      statusCode: 422,
    });
  });

  it('throws 422 when cancelling from PRODUCAO without cancelReason', async () => {
    prismaMock.order.findUnique.mockResolvedValueOnce(orderWithItems('PRODUCAO'));

    await expect(updateOrderStatus('order-1', 'CANCELADO')).rejects.toMatchObject({
      message: 'Motivo de cancelamento é obrigatório nesta etapa',
      statusCode: 422,
    });
  });

  it('throws 422 when cancelling from PREPARADO with empty string reason', async () => {
    prismaMock.order.findUnique.mockResolvedValueOnce(orderWithItems('PREPARADO'));

    await expect(updateOrderStatus('order-1', 'CANCELADO', '')).rejects.toMatchObject({
      statusCode: 422,
    });
  });

  it('executes transaction on valid transition PENDENTE → PROCESSANDO', async () => {
    const order = orderWithItems('PENDENTE');
    prismaMock.order.findUnique
      .mockResolvedValueOnce(order)
      .mockResolvedValueOnce({ ...order, status: 'PROCESSANDO' });

    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof prismaMock) => Promise<unknown>) => fn(prismaMock),
    );
    prismaMock.packaging.update.mockResolvedValue({ currentStock: 95 });
    prismaMock.order.update.mockResolvedValue({ ...order, status: 'PROCESSANDO' });

    await updateOrderStatus('order-1', 'PROCESSANDO');

    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
  });

  it('allows cancellation from PENDENTE without reason', async () => {
    const order = orderWithItems('PENDENTE');
    prismaMock.order.findUnique
      .mockResolvedValueOnce(order)
      .mockResolvedValueOnce({ ...order, status: 'CANCELADO' });

    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof prismaMock) => Promise<unknown>) => fn(prismaMock),
    );
    prismaMock.order.update.mockResolvedValue({ ...order, status: 'CANCELADO' });

    await expect(updateOrderStatus('order-1', 'CANCELADO')).resolves.toBeDefined();
  });
});
