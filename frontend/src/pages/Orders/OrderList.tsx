import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { fetchOrders } from '../../services/orderApi';
import { formatDateBR } from '../../utils/date';
import type { Order, OrderStatus, Pagination as PaginationType } from '../../types';

const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 10px',
  border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)',
  fontSize: 13, color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDENTE:    'Pendente',
  PROCESSANDO: 'Processando',
  PRODUCAO:    'Em Produção',
  PREPARADO:   'Preparado',
  ENVIADO:     'Enviado',
  ENTREGUE:    'Entregue',
  CANCELADO:   'Cancelado',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDENTE:    'badge--pending',
  PROCESSANDO: 'badge--processando',
  PRODUCAO:    'badge--producao',
  PREPARADO:   'badge--preparado',
  ENVIADO:     'badge--enviado',
  ENTREGUE:    'badge--entregue',
  CANCELADO:   'badge--cancelado',
};

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDENTE', 'PROCESSANDO', 'PRODUCAO', 'PREPARADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO',
];

export function OrderList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOrders({ page, limit: 10, search: search || undefined, status: status || undefined });
      setOrders(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <AppLayout>
      <PageHeader
        title="Pedidos"
        description={`${pagination.total} pedido(s) cadastrado(s)`}
        action={
          <button className="btn btn--primary" onClick={() => navigate('/pedidos/novo')}>
            + Novo Pedido
          </button>
        }
      />

      {/* Filters */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <input
          style={{ ...inputStyle, minWidth: 220, flex: 1 }}
          placeholder="Buscar por nº pedido ou cliente..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={inputStyle}
          value={status}
          onChange={(e) => { setStatus(e.target.value as OrderStatus | ''); setPage(1); }}
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {error && <div style={{ padding: 'var(--space-lg)', color: 'var(--color-error)', textAlign: 'center', fontSize: 14 }}>{error}</div>}
        {loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Nenhum pedido encontrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
                {['Nº Pedido', 'Cliente', 'Itens', 'Total', 'Status', 'Data', 'Ações'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: i < orders.length - 1 ? '1px solid var(--color-divider)' : 'none', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{order.orderNumber}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{order.client.razaoSocial}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{order.client.nomeFantasia}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{order.items.length} produto(s)</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>R$ {Number(order.total).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${STATUS_BADGE[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                    {formatDateBR(order.createdAt)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => navigate(`/pedidos/${order.id}`)}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
    </AppLayout>
  );
}
