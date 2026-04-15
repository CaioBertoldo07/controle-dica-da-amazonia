import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { useAuthStore } from '../store/authStore';

function renderWithRouter(
  element: React.ReactNode,
  { initialPath = '/' }: { initialPath?: string } = {},
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route path="/403" element={<div data-testid="forbidden-page">Forbidden</div>} />
        <Route path="/" element={element} />
        <Route path="/admin" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('redirects to /login when not authenticated', () => {
    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuthStore.setState({
      token: 'test-token',
      user: { id: '1', name: 'Admin', email: 'a@b.com', role: 'admin' },
      isAuthenticated: true,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('redirects to /403 when user role is not allowed', () => {
    useAuthStore.setState({
      token: 'test-token',
      user: { id: '1', name: 'Vendedor', email: 'v@b.com', role: 'vendedor' },
      isAuthenticated: true,
    });

    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin', 'gestor']}>
        <div data-testid="protected">Admin Only</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('renders children when user has an allowed role', () => {
    useAuthStore.setState({
      token: 'test-token',
      user: { id: '1', name: 'Admin', email: 'a@b.com', role: 'admin' },
      isAuthenticated: true,
    });

    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin', 'gestor']}>
        <div data-testid="protected">Admin Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});
