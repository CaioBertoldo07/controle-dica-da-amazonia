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
