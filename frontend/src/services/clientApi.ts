import api from '../config/api';
import type { Client, ClientFormData, PaginatedResponse } from '../types';

export interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'B2B' | 'B2C' | '';
  isActive?: boolean | '';
}

export async function fetchClients(params: ClientListParams): Promise<PaginatedResponse<Client>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.type) query.set('type', params.type);
  if (params.isActive !== '' && params.isActive !== undefined)
    query.set('isActive', String(params.isActive));

  const { data } = await api.get<PaginatedResponse<Client>>(`/clients?${query}`);
  return data;
}

export async function fetchClient(id: string): Promise<Client> {
  const { data } = await api.get<{ data: Client }>(`/clients/${id}`);
  return data.data;
}

export async function createClient(payload: ClientFormData): Promise<Client> {
  const { data } = await api.post<{ data: Client }>('/clients', payload);
  return data.data;
}

export async function updateClient(id: string, payload: ClientFormData): Promise<Client> {
  const { data } = await api.put<{ data: Client }>(`/clients/${id}`, payload);
  return data.data;
}

export async function deactivateClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
