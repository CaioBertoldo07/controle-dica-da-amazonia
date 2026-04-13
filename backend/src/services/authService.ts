import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { comparePassword } from '../utils/password';
import { env } from '../config/env';
import type { JwtPayload } from '../types';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Never differentiate between "user not found" and "wrong password" — prevents user enumeration
  if (!user) {
    throw Object.assign(new Error('Credenciais inválidas'), { statusCode: 401 });
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    throw Object.assign(new Error('Credenciais inválidas'), { statusCode: 401 });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Usuário inativo'), { statusCode: 401 });
  }

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw Object.assign(new Error('Usuário não encontrado'), { statusCode: 404 });
  }

  return user;
}
