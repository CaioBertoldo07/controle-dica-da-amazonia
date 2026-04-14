import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ClientList } from './pages/Clients/ClientList';
import { ClientForm } from './pages/Clients/ClientForm';
import { ProductList } from './pages/Products/ProductList';
import { ProductForm } from './pages/Products/ProductForm';
import { PackagingList } from './pages/Packagings/PackagingList';
import { PackagingForm } from './pages/Packagings/PackagingForm';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function Protected({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function App() {
  return (
    <BrowserRouter>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
