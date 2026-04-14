import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { fetchProducts, deactivateProduct } from '../../services/productApi';
import type { Product, Pagination as PaginationType } from '../../types';

const inputStyle: React.CSSProperties = {
  height: 36,
  padding: '0 10px',
  border: '1px solid var(--color-divider)',
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
  color: 'var(--color-text-primary)',
  background: 'var(--color-surface)',
  outline: 'none',
};

export function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | ''>('');
  const [page, setPage] = useState(1);

  const [deactivating, setDeactivating] = useState<Product | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProducts({ page, limit: 10, search: search || undefined, isActive: isActive === '' ? undefined : isActive });
      setProducts(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive]);

  useEffect(() => { load(); }, [load]);

  async function handleDeactivate() {
    if (!deactivating) return;
    setDeactivateLoading(true);
    try {
      await deactivateProduct(deactivating.id);
      setDeactivating(null);
      load();
    } catch {
      setError('Erro ao desativar produto.');
    } finally {
      setDeactivateLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Produtos"
        description={`${pagination.total} produto(s) cadastrado(s)`}
        action={
          <button className="btn btn--primary" onClick={() => navigate('/produtos/novo')}>
            + Novo Produto
          </button>
        }
      />

      {/* Filters */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <input
          style={{ ...inputStyle, minWidth: 200, flex: 1 }}
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={inputStyle}
          value={String(isActive)}
          onChange={(e) => { const v = e.target.value; setIsActive(v === '' ? '' : v === 'true'); setPage(1); }}
        >
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {error && (
          <div style={{ padding: 'var(--space-lg)', color: 'var(--color-error)', textAlign: 'center', fontSize: 14 }}>{error}</div>
        )}
        {loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Nenhum produto encontrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
                {['Código', 'Nome', 'Preço', 'Embalagem', 'Estoque', 'Status', 'Ações'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: i < products.length - 1 ? '1px solid var(--color-divider)' : 'none', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-secondary)' }}>{product.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '12px 16px' }}>R$ {Number(product.price).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{product.packaging?.name ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: product.stock === 0 ? 600 : 400, color: product.stock === 0 ? 'var(--color-warning)' : 'inherit' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${product.isActive ? 'badge--success' : 'badge--inactive'}`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button className="btn btn--outline btn--sm" onClick={() => navigate(`/produtos/${product.id}/editar`)}>
                        Editar
                      </button>
                      {product.isActive && (
                        <button className="btn btn--danger btn--sm" onClick={() => setDeactivating(product)}>
                          Desativar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!deactivating}
        title="Desativar produto"
        message={`Tem certeza que deseja desativar "${deactivating?.name}"?`}
        confirmLabel="Desativar"
        loading={deactivateLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivating(null)}
      />
    </AppLayout>
  );
}
