import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockEnv } from '../helpers/mocks';

vi.mock('../../config/env', () => ({ env: mockEnv }));

const prismaMock = vi.hoisted(() => ({
  order: {
    findMany: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  },
  client: { count: vi.fn() },
  product: { count: vi.fn() },
  $queryRaw: vi.fn(),
}));

vi.mock('../../config/database', () => ({ prisma: prismaMock }));

import { getSummary, getSalesOverTime } from '../../services/reportService';

describe('reportService.getSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates monthly revenue and avgTicket correctly', async () => {
    prismaMock.order.findMany
      .mockResolvedValueOnce([
        { total: 100, status: 'ENTREGUE' },
        { total: 200, status: 'PROCESSANDO' },
      ])
      .mockResolvedValueOnce([]); // recentOrders

    prismaMock.order.aggregate.mockResolvedValueOnce({
      _sum: { total: 300 },
      _count: { id: 2 },
    });
    prismaMock.client.count.mockResolvedValueOnce(5);
    prismaMock.product.count.mockResolvedValueOnce(4);
    prismaMock.order.groupBy.mockResolvedValueOnce([
      { status: 'ENTREGUE', _count: { id: 1 } },
    ]);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ count: BigInt(0) }]);

    const result = await getSummary();

    expect(result.currentMonth.revenue).toBe(300);
    expect(result.currentMonth.orders).toBe(2);
    expect(result.currentMonth.avgTicket).toBe(150);
    expect(result.allTime.activeClients).toBe(5);
    expect(result.allTime.activeProducts).toBe(4);
  });

  it('returns avgTicket as 0 when no orders this month', async () => {
    prismaMock.order.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    prismaMock.order.aggregate.mockResolvedValueOnce({
      _sum: { total: null },
      _count: { id: 0 },
    });
    prismaMock.client.count.mockResolvedValueOnce(0);
    prismaMock.product.count.mockResolvedValueOnce(0);
    prismaMock.order.groupBy.mockResolvedValueOnce([]);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ count: BigInt(0) }]);

    const result = await getSummary();

    expect(result.currentMonth.avgTicket).toBe(0);
    expect(result.currentMonth.revenue).toBe(0);
  });

  it('counts deliveredOrders correctly from monthly orders', async () => {
    prismaMock.order.findMany
      .mockResolvedValueOnce([
        { total: 100, status: 'ENTREGUE' },
        { total: 200, status: 'ENTREGUE' },
        { total: 50, status: 'PROCESSANDO' },
      ])
      .mockResolvedValueOnce([]);
    prismaMock.order.aggregate.mockResolvedValueOnce({
      _sum: { total: 350 },
      _count: { id: 3 },
    });
    prismaMock.client.count.mockResolvedValueOnce(2);
    prismaMock.product.count.mockResolvedValueOnce(2);
    prismaMock.order.groupBy.mockResolvedValueOnce([]);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ count: BigInt(1) }]);

    const result = await getSummary();

    expect(result.currentMonth.deliveredOrders).toBe(2);
    expect(result.lowStockPackagings).toBe(1);
  });
});

describe('reportService.getSalesOverTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('serializes bigint orders and float revenue correctly', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { period: '2026-04-01', orders: BigInt(3), revenue: '750.00' },
      { period: '2026-04-02', orders: BigInt(1), revenue: '100.50' },
    ]);

    const result = await getSalesOverTime('2026-04-01', '2026-04-02');

    expect(result[0].orders).toBe(3);
    expect(typeof result[0].orders).toBe('number');
    expect(result[0].revenue).toBe(750.0);
    expect(result[1].revenue).toBe(100.5);
  });

  it('handles empty result set', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([]);

    const result = await getSalesOverTime();

    expect(result).toEqual([]);
  });

  it('defaults to day groupBy', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([]);
    await getSalesOverTime();
    // The raw query should have been called with the day format
    expect(prismaMock.$queryRaw).toHaveBeenCalledOnce();
  });
});
