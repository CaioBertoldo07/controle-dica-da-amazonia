import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { fetchPackagings, adjustStock } from '../../services/packagingApi';
import type { Packaging, Pagination as PaginationType } from '../../types';

const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 10px',
  border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)',
  fontSize: 13, color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
};

interface StockModal {
  packaging: Packaging;
  operation: 'add' | 'remove';
}

export function PackagingList() {
  const navigate = useNavigate();

  const [packagings, setPackagings] = useState<Packaging[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [stockModal, setStockModal] = useState<StockModal | null>(null);
  const [stockQty, setStockQty] = useState<number | ''>('');
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPackagings({ page, limit: 10, search: search || undefined });
      setPackagings(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Erro ao carregar embalagens.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function handleStockConfirm() {
    if (!stockModal) return;
    if (stockQty === '' || stockQty < 1) { setStockError('Informe uma quantidade válida.'); return; }
    setStockLoading(true);
    setStockError(null);
    try {
      await adjustStock(stockModal.packaging.id, stockModal.operation, stockQty);
      setStockModal(null);
      setStockQty(1);
      load();
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao ajustar estoque.';
      setStockError(msg);
    } finally {
      setStockLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Embalagens"
        description={`${pagination.total} embalagem(ns) cadastrada(s)`}
        action={
          <button className="btn btn--primary" onClick={() => navigate('/embalagens/nova')}>
            + Nova Embalagem
          </button>
        }
      />

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', boxShadow: 'var(--shadow-sm)' }}>
        <input
          style={{ ...inputStyle, minWidth: 200, flex: 1 }}
          placeholder="Buscar por nome ou fornecedor..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {error && <div style={{ padding: 'var(--space-lg)', color: 'var(--color-error)', textAlign: 'center', fontSize: 14 }}>{error}</div>}
        {loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
        ) : packagings.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Nenhuma embalagem encontrada.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
                {['Nome', 'Tipo', 'Custo Unit.', 'Estoque Atual', 'Estoque Mín.', 'Fornecedor', 'Ações'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packagings.map((pkg, i) => {
                const lowStock = pkg.currentStock <= pkg.minimumStock;
                return (
                  <tr
                    key={pkg.id}
                    style={{ borderBottom: i < packagings.length - 1 ? '1px solid var(--color-divider)' : 'none', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{pkg.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${pkg.type === 'PADRAO' ? 'badge--info' : 'badge--warning'}`}>
                        {pkg.type === 'PADRAO' ? 'Padrão' : 'Especial'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>R$ {Number(pkg.unitCost).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600, color: lowStock ? 'var(--color-error)' : 'inherit' }}>
                        {pkg.currentStock}
                        {lowStock && <span style={{ fontSize: 11, marginLeft: 4, color: 'var(--color-error)' }}>⚠ baixo</span>}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{pkg.minimumStock}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{pkg.supplier ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        <button className="btn btn--outline btn--sm" onClick={() => navigate(`/embalagens/${pkg.id}/editar`)}>Editar</button>
                        <button
                          className="btn btn--success-outline btn--sm"
                          onClick={() => { setStockModal({ packaging: pkg, operation: 'add' }); setStockQty(''); setStockError(null); }}
                        >
                          + Entrada
                        </button>
                        <button
                          className="btn btn--warning-outline btn--sm"
                          onClick={() => { setStockModal({ packaging: pkg, operation: 'remove' }); setStockQty(''); setStockError(null); }}
                        >
                          − Saída
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />

      {/* Stock adjustment modal */}
      {stockModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-lg)' }}
          onClick={() => setStockModal(null)}
        >
          <div
            style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-xl)', maxWidth: 380, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
              {stockModal.operation === 'add' ? '+ Entrada de Estoque' : '− Saída de Estoque'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              Embalagem: <strong>{stockModal.packaging.name}</strong> — atual: <strong>{stockModal.packaging.currentStock}</strong>
            </p>
            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="form-label required">Quantidade</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={stockQty}
                placeholder="0"
                onChange={(e) => { setStockQty(e.target.value === '' ? '' : parseInt(e.target.value) || ''); setStockError(null); }}
              />
              {stockError && <span className="form-error">{stockError}</span>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button className="btn btn--outline" onClick={() => setStockModal(null)} disabled={stockLoading}>Cancelar</button>
              <button
                className="btn btn--primary"
                onClick={handleStockConfirm}
                disabled={stockLoading}
                style={{ minWidth: 100 }}
              >
                {stockLoading ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
