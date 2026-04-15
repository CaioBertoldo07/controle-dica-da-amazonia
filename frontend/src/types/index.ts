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

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface ReportSummaryRecentOrder {
  id: string;
  orderNumber: string;
  client: { id: string; razaoSocial: string; nomeFantasia: string };
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface ReportSummary {
  currentMonth: {
    orders: number;
    revenue: number;
    avgTicket: number;
    deliveredOrders: number;
  };
  allTime: {
    totalOrders: number;
    totalRevenue: number;
    activeClients: number;
    activeProducts: number;
  };
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  lowStockPackagings: number;
  recentOrders: ReportSummaryRecentOrder[];
}

export interface SalesDataPoint {
  period: string;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  code: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

export interface TopClient {
  clientId: string;
  razaoSocial: string;
  nomeFantasia: string;
  orderCount: number;
  totalRevenue: number;
}

export interface PackagingAnalysisItem {
  id: string;
  name: string;
  type: PackagingType;
  currentStock: number;
  minimumStock: number;
  needsReorder: boolean;
  consumedLast30Days: number;
}
