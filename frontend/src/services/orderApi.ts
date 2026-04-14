import api from '../config/api';
import type { Order, OrderStatus, CreateOrderInput, PaginatedResponse } from '../types';

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | '';
  clientId?: string;
}

export async function fetchOrders(params: OrderListParams): Promise<PaginatedResponse<Order>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.clientId) query.set('clientId', params.clientId);

  const { data } = await api.get<PaginatedResponse<Order>>(`/orders?${query}`);
  return data;
}

export async function fetchOrder(id: string): Promise<Order> {
  const { data } = await api.get<{ data: Order }>(`/orders/${id}`);
  return data.data;
}

export async function createOrder(payload: CreateOrderInput): Promise<Order> {
  const { data } = await api.post<{ data: Order }>('/orders', payload);
  return data.data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  cancelReason?: string,
): Promise<Order> {
  const { data } = await api.patch<{ data: Order }>(`/orders/${id}/status`, { status, cancelReason });
  return data.data;
}
