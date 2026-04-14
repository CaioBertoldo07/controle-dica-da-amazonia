import api from '../config/api';
import type { Product, ProductFormData, PaginatedResponse } from '../types';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | '';
}

export async function fetchProducts(params: ProductListParams): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.isActive !== '' && params.isActive !== undefined)
    query.set('isActive', String(params.isActive));

  const { data } = await api.get<PaginatedResponse<Product>>(`/products?${query}`);
  return data;
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: ProductFormData): Promise<Product> {
  const { data } = await api.post<{ data: Product }>('/products', payload);
  return data.data;
}

export async function updateProduct(id: string, payload: ProductFormData): Promise<Product> {
  const { data } = await api.put<{ data: Product }>(`/products/${id}`, payload);
  return data.data;
}

export async function deactivateProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function fetchProductsAll(): Promise<Product[]> {
  const { data } = await api.get<PaginatedResponse<Product>>('/products?limit=1000&isActive=true');
  return data.data;
}
