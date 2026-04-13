import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../config/api';
import type { LoginResponse } from '../types';

export function useAuth() {
  const store = useAuthStore();
  const navigate = useNavigate();

  async function loginRequest(email: string, password: string): Promise<string | null> {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      store.login(data.token, data.user);
      return null;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
      ) {
        const data = err.response.data as { error?: string };
        return data.error ?? 'Erro ao realizar login';
      }
      return 'Erro de conexão com o servidor';
    }
  }

  function logoutAndRedirect() {
    store.logout();
    navigate('/login');
  }

  return {
    ...store,
    loginRequest,
    logoutAndRedirect,
  };
}
