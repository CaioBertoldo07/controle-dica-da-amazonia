export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'gestor' | 'vendedor' | 'operador';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  fields?: Record<string, string[]>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ─── Client ──────────────────────────────────────────────────────────────────

export type ClientType = 'B2B' | 'B2C';

export interface Client {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  type: ClientType;
  inscrEstadual?: string;
  pessoaContatoNome: string;
  pessoaContatoCPF?: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  observacoes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Packaging ───────────────────────────────────────────────────────────────

export type PackagingType = 'PADRAO' | 'ESPECIAL';

export interface Packaging {
  id: string;
  name: string;
  type: PackagingType;
  description?: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
  supplier?: string;
  supplierContact?: string;
  lastPurchaseDate?: string;
  lastPurchaseQty?: number;
  createdAt: string;
  updatedAt: string;
}

export type PackagingFormData = Omit<Packaging, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description?: string;
  code: string;
  price: number;
  packagingId: string;
  packaging: { id: string; name: string; type: PackagingType };
  isActive: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'packaging' | 'createdAt' | 'updatedAt'>;

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDENTE'
  | 'PROCESSANDO'
  | 'PRODUCAO'
  | 'PREPARADO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: { id: string; name: string; code: string };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  client: { id: string; razaoSocial: string; nomeFantasia: string };
  status: OrderStatus;
  total: number;
  notes?: string;
  cancelReason?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  clientId: string;
  notes?: string;
  items: CreateOrderItemInput[];
}
