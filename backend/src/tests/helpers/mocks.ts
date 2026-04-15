import { vi } from 'vitest';

// ─── env mock ────────────────────────────────────────────────────────────────
export const mockEnv = {
  NODE_ENV: 'test' as const,
  JWT_SECRET: 'test-jwt-secret-for-testing-purposes-only-32chars',
  JWT_EXPIRES_IN: '7d',
  PORT: 3334,
  DATABASE_URL: 'mysql://test:test@localhost:3306/test_db',
};

// ─── Prisma mock factory ──────────────────────────────────────────────────────
export function createPrismaMock() {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    client: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    packaging: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    orderItem: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
    $disconnect: vi.fn(),
  };
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;
