import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockEnv } from '../helpers/mocks';

vi.mock('../../config/env', () => ({ env: mockEnv }));

const prismaMock = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  order: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  client: { findUnique: vi.fn() },
  product: { findUnique: vi.fn() },
  packaging: { update: vi.fn() },
  $transaction: vi.fn(),
}));
vi.mock('../../config/database', () => ({ prisma: prismaMock }));

import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app';

function makeToken(role = 'admin') {
  return jwt.sign(
    { sub: 'user-1', email: 'admin@test.com', role },
    mockEnv.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

const CLIENT_ID = 'a0000000-0000-0000-0000-000000000001';
const PROD_ID = 'b0000000-0000-0000-0000-000000000001';
const PACK_ID = 'c0000000-0000-0000-0000-000000000001';

const activeClient = { id: CLIENT_ID, razaoSocial: 'Test Client LTDA', isActive: true };
const activeProduct = {
  id: PROD_ID, name: 'Café de Açaí', code: 'CAF-001',
  price: 25.5, isActive: true, packagingId: PACK_ID,
  packaging: { id: PACK_ID, name: 'Embalagem Padrão', currentStock: 100 },
};

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.order.findFirst.mockResolvedValue(null);
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.status).toBe(401);
  });

  it('returns 422 when client is inactive', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce({ ...activeClient, isActive: false });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ clientId: CLIENT_ID, items: [{ productId: PROD_ID, quantity: 1 }] });

    expect(res.status).toBe(422);
  });

  it('returns 422 when duplicate products in items', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        clientId: CLIENT_ID,
        items: [
          { productId: PROD_ID, quantity: 2 },
          { productId: PROD_ID, quantity: 3 },
        ],
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toMatch(/duplicado/i);
  });

  it('creates an order successfully', async () => {
    prismaMock.client.findUnique.mockResolvedValueOnce(activeClient);
    prismaMock.product.findUnique.mockResolvedValueOnce(activeProduct);
    prismaMock.order.create.mockResolvedValueOnce({
      id: 'order-uuid-1',
      orderNumber: 'PED-2026-0001',
      status: 'PENDENTE',
      total: 25.5,
      clientId: CLIENT_ID,
      notes: null,
      cancelReason: null,
      createdAt: new Date(),
      client: activeClient,
      items: [],
    });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ clientId: CLIENT_ID, items: [{ productId: PROD_ID, quantity: 1 }] });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('orderNumber');
  });

  it('returns 403 when role operador tries to create orders', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken('operador')}`)
      .send({ clientId: CLIENT_ID, items: [{ productId: PROD_ID, quantity: 1 }] });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/orders', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });

  it('returns paginated order list', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([[], 0]);

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });
});
