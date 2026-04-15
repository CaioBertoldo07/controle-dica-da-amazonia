import api from '../config/api';
import type {
  ReportSummary,
  SalesDataPoint,
  TopProduct,
  TopClient,
  PackagingAnalysisItem,
} from '../types';

export async function fetchReportSummary(): Promise<ReportSummary> {
  const res = await api.get<{ data: ReportSummary }>('/reports/summary');
  return res.data.data;
}

export async function fetchSalesOverTime(params: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<SalesDataPoint[]> {
  const p = new URLSearchParams();
  if (params.startDate) p.set('startDate', params.startDate);
  if (params.endDate) p.set('endDate', params.endDate);
  if (params.groupBy) p.set('groupBy', params.groupBy);
  const res = await api.get<{ data: SalesDataPoint[] }>(`/reports/sales?${p.toString()}`);
  return res.data.data;
}

export async function fetchTopProducts(params: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<TopProduct[]> {
  const p = new URLSearchParams();
  if (params.startDate) p.set('startDate', params.startDate);
  if (params.endDate) p.set('endDate', params.endDate);
  if (params.limit) p.set('limit', String(params.limit));
  const res = await api.get<{ data: TopProduct[] }>(`/reports/top-products?${p.toString()}`);
  return res.data.data;
}

export async function fetchTopClients(params: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<TopClient[]> {
  const p = new URLSearchParams();
  if (params.startDate) p.set('startDate', params.startDate);
  if (params.endDate) p.set('endDate', params.endDate);
  if (params.limit) p.set('limit', String(params.limit));
  const res = await api.get<{ data: TopClient[] }>(`/reports/top-clients?${p.toString()}`);
  return res.data.data;
}

export async function fetchPackagingAnalysis(): Promise<PackagingAnalysisItem[]> {
  const res = await api.get<{ data: PackagingAnalysisItem[] }>('/reports/packaging-analysis');
  return res.data.data;
}
