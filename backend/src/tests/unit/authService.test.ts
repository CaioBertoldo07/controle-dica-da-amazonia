import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockEnv } from '../helpers/mocks';

vi.mock('../../config/env', () => ({ env: mockEnv }));

vi.mock('../../config/database', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
  },
}));

vi.mock('../../utils/password', () => ({
  comparePassword: vi.fn(),
  hashPassword: vi.fn(),
}));

import { prisma } from '../../config/database';
import { comparePassword } from '../../utils/password';
import { login, getUserById } from '../../services/authService';

const mockPrismaUser = prisma.user as { findUnique: ReturnType<typeof vi.fn> };
const mockCompare = comparePassword as ReturnType<typeof vi.fn>;

describe('authService.login', () => {
  const baseUser = {
    id: 'user-1',
    email: 'admin@test.com',
    password: 'hashed_password',
    name: 'Admin',
    role: 'admin',
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns token and user on valid credentials', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce(baseUser);
    mockCompare.mockResolvedValueOnce(true);

    const result = await login('admin@test.com', 'correct_password');

    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('admin@test.com');
    expect(result.user.role).toBe('admin');
    expect(result.user).not.toHaveProperty('password');
  });

  it('throws 401 when user is not found', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce(null);

    await expect(login('notexist@test.com', 'any')).rejects.toMatchObject({
      message: 'Credenciais inválidas',
      statusCode: 401,
    });
  });

  it('throws 401 when password is wrong', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce(baseUser);
    mockCompare.mockResolvedValueOnce(false);

    await expect(login('admin@test.com', 'wrong_password')).rejects.toMatchObject({
      message: 'Credenciais inválidas',
      statusCode: 401,
    });
  });

  it('throws 401 when user is inactive', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce({ ...baseUser, isActive: false });
    mockCompare.mockResolvedValueOnce(true);

    await expect(login('admin@test.com', 'correct_password')).rejects.toMatchObject({
      message: 'Usuário inativo',
      statusCode: 401,
    });
  });

  it('does not differentiate user-not-found from wrong-password (prevents enumeration)', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce(null);
    const notFoundError = await login('ghost@test.com', 'any').catch((e) => e);

    mockPrismaUser.findUnique.mockResolvedValueOnce(baseUser);
    mockCompare.mockResolvedValueOnce(false);
    const wrongPassError = await login('admin@test.com', 'wrong').catch((e) => e);

    expect(notFoundError.message).toBe(wrongPassError.message);
    expect(notFoundError.statusCode).toBe(wrongPassError.statusCode);
  });
});

describe('authService.getUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user when found', async () => {
    const user = { id: 'u1', name: 'Test', email: 'a@b.com', role: 'admin', isActive: true, createdAt: new Date() };
    mockPrismaUser.findUnique.mockResolvedValueOnce(user);

    const result = await getUserById('u1');
    expect(result).toEqual(user);
  });

  it('throws 404 when user not found', async () => {
    mockPrismaUser.findUnique.mockResolvedValueOnce(null);

    await expect(getUserById('non-existent')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
