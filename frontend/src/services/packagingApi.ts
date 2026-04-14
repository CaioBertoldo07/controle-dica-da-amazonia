import api from '../config/api';
import type { Packaging, PackagingFormData, PaginatedResponse } from '../types';

export interface PackagingListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchPackagings(params: PackagingListParams): Promise<PaginatedResponse<Packaging>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  const { data } = await api.get<PaginatedResponse<Packaging>>(`/packagings?${query}`);
  return data;
}

export async function fetchPackagingsAll(): Promise<Packaging[]> {
  const { data } = await api.get<PaginatedResponse<Packaging>>('/packagings?limit=100');
  return data.data;
}

export async function fetchPackaging(id: string): Promise<Packaging> {
  const { data } = await api.get<{ data: Packaging }>(`/packagings/${id}`);
  return data.data;
}

export async function createPackaging(payload: PackagingFormData): Promise<Packaging> {
  const { data } = await api.post<{ data: Packaging }>('/packagings', payload);
  return data.data;
}

export async function updatePackaging(id: string, payload: PackagingFormData): Promise<Packaging> {
  const { data } = await api.put<{ data: Packaging }>(`/packagings/${id}`, payload);
  return data.data;
}

export async function adjustStock(
  id: string,
  operation: 'add' | 'remove',
  quantity: number,
): Promise<Packaging> {
  const { data } = await api.patch<{ data: Packaging }>(`/packagings/${id}/stock`, {
    operation,
    quantity,
  });
  return data.data;
}
