import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Always log the full error server-side
  console.error('[Error]', err);

  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Dados inválidos',
      fields: err.flatten().fieldErrors,
    });
    return;
  }

  const statusCode = err.statusCode ?? 500;

  if (env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      error: statusCode === 500 ? 'Erro interno do servidor' : err.message,
    });
  } else {
    res.status(statusCode).json({
      error: err.message,
      stack: err.stack,
    });
  }
}
