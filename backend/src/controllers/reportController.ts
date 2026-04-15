import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/reportService';

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getSummary();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getSalesOverTime(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const groupBy = (req.query.groupBy as 'day' | 'week' | 'month') ?? 'day';
    const data = await reportService.getSalesOverTime(startDate, endDate, groupBy);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getTopProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const data = await reportService.getTopProducts(startDate, endDate, limit);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getTopClients(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const data = await reportService.getTopClients(startDate, endDate, limit);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getPackagingAnalysis(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getPackagingAnalysis();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
