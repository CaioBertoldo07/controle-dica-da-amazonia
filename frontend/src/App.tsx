import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Each page group is its own chunk; the heavy Reports chunk only loads when needed.

const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));

const ClientList = lazy(() => import('./pages/Clients/ClientList').then((m) => ({ default: m.ClientList })));
const ClientForm = lazy(() => import('./pages/Clients/ClientForm').then((m) => ({ default: m.ClientForm })));

const ProductList = lazy(() => import('./pages/Products/ProductList').then((m) => ({ default: m.ProductList })));
const ProductForm = lazy(() => import('./pages/Products/ProductForm').then((m) => ({ default: m.ProductForm })));

const PackagingList = lazy(() => import('./pages/Packagings/PackagingList').then((m) => ({ default: m.PackagingList })));
const PackagingForm = lazy(() => import('./pages/Packagings/PackagingForm').then((m) => ({ default: m.PackagingForm })));

const OrderList = lazy(() => import('./pages/Orders/OrderList').then((m) => ({ default: m.OrderList })));
const OrderForm = lazy(() => import('./pages/Orders/OrderForm').then((m) => ({ default: m.OrderForm })));
const OrderDetail = lazy(() => import('./pages/Orders/OrderDetail').then((m) => ({ default: m.OrderDetail })));

// Reports chunk — kept separate due to Recharts size
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));

// ─── Loading fallback ─────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text-secondary)',
        fontSize: 14,
      }}
    >
      Carregando...
    </div>
  );
}

// ─── Route wrapper ────────────────────────────────────────────────────────────

function Protected({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Protected><Dashboard /></Protected>} />

          {/* Clientes */}
          <Route path="/clientes" element={<Protected><ClientList /></Protected>} />
          <Route path="/clientes/novo" element={<Protected><ClientForm /></Protected>} />
          <Route path="/clientes/:id/editar" element={<Protected><ClientForm /></Protected>} />

          {/* Produtos */}
          <Route path="/produtos" element={<Protected><ProductList /></Protected>} />
          <Route path="/produtos/novo" element={<Protected><ProductForm /></Protected>} />
          <Route path="/produtos/:id/editar" element={<Protected><ProductForm /></Protected>} />

          {/* Embalagens */}
          <Route path="/embalagens" element={<Protected><PackagingList /></Protected>} />
          <Route path="/embalagens/nova" element={<Protected><PackagingForm /></Protected>} />
          <Route path="/embalagens/:id/editar" element={<Protected><PackagingForm /></Protected>} />

          {/* Pedidos */}
          <Route path="/pedidos" element={<Protected><OrderList /></Protected>} />
          <Route path="/pedidos/novo" element={<Protected><OrderForm /></Protected>} />
          <Route path="/pedidos/:id" element={<Protected><OrderDetail /></Protected>} />

          {/* Relatórios — chunk separado (Recharts) */}
          <Route path="/relatorios" element={<Protected><ReportsPage /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
