import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

const mockUser: User = {
  id: 'user-1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
};

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('initializes as unauthenticated when localStorage is empty', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('login() sets token, user and isAuthenticated to true', () => {
    useAuthStore.getState().login('test-token', mockUser);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('test-token');
    expect(state.user?.email).toBe('admin@test.com');
  });

  it('login() persists token and user to localStorage', () => {
    useAuthStore.getState().login('my-token', mockUser);

    expect(localStorage.getItem('dica_token')).toBe('my-token');
    expect(JSON.parse(localStorage.getItem('dica_user') ?? '{}')).toMatchObject({ email: 'admin@test.com' });
  });

  it('logout() clears auth state', () => {
    useAuthStore.getState().login('test-token', mockUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('logout() removes token and user from localStorage', () => {
    useAuthStore.getState().login('test-token', mockUser);
    useAuthStore.getState().logout();

    expect(localStorage.getItem('dica_token')).toBeNull();
    expect(localStorage.getItem('dica_user')).toBeNull();
  });
});
