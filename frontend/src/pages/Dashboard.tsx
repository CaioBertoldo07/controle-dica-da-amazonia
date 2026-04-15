import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AppLayout } from '../components/common/AppLayout';
import { useAuthStore } from '../store/authStore';
import { fetchReportSummary, fetchSalesOverTime } from '../services/reportApi';
import type { ReportSummary, SalesDataPoint, OrderStatus } from '../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDENTE: 'Pendente',
  PROCESSANDO: 'Processando',
  PRODUCAO: 'Produção',
  PREPARADO: 'Preparado',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDENTE: '#f59e0b',
  PROCESSANDO: '#3b82f6',
  PRODUCAO: '#8b5cf6',
  PREPARADO: '#06b6d4',
  ENVIADO: '#f97316',
  ENTREGUE: '#22c55e',
  CANCELADO: '#ef4444',
};

function toDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

function getLast7Days() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return { startDate: toDateStr(start), endDate: toDateStr(end) };
}

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { startDate, endDate } = getLast7Days();
    Promise.all([
      fetchReportSummary(),
      fetchSalesOverTime({ startDate, endDate, groupBy: 'day' }),
    ])
      .then(([s, sales]) => {
        setSummary(s);
        setSalesData(sales);
      })
      .catch(() => setError('Erro ao carregar dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    gestor: 'Gestor',
    vendedor: 'Vendedor',
    operador: 'Operador',
  };

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {roleLabels[user?.role ?? ''] ?? user?.role} — visão geral do sistema
        </p>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: 'var(--color-error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Low stock alert */}
      {!loading && summary && summary.lowStockPackagings > 0 && (
        <div
          style={{ background: '#fff8e1', border: '1px solid #ffc107', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => navigate('/relatorios?tab=embalagens')}
        >
          <span>
            <strong>⚠ Alerta de estoque:</strong> {summary.lowStockPackagings}{' '}
            {summary.lowStockPackagings === 1 ? 'embalagem precisa' : 'embalagens precisam'} de reposição
          </span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Ver análise →</span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <KpiCard
          label="Faturamento do Mês"
          value={loading ? '—' : `R$ ${(summary?.currentMonth.revenue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub={loading ? '' : `${summary?.currentMonth.orders ?? 0} pedidos`}
          color="#2d5a27"
        />
        <KpiCard
          label="Ticket Médio"
          value={loading ? '—' : `R$ ${(summary?.currentMonth.avgTicket ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub={loading ? '' : `${summary?.currentMonth.deliveredOrders ?? 0} entregues`}
          color="#4a8c42"
        />
        <KpiCard
          label="Clientes Ativos"
          value={loading ? '—' : String(summary?.allTime.activeClients ?? 0)}
          sub="cadastrados e ativos"
          color="#2d8a5e"
        />
        <KpiCard
          label="Produtos Ativos"
          value={loading ? '—' : String(summary?.allTime.activeProducts ?? 0)}
          sub="no catálogo"
          color="#1a6b4a"
        />
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>

        {/* Sales Chart */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Faturamento — Últimos 7 dias
            </h2>
            <button className="btn btn--outline btn--sm" onClick={() => navigate('/relatorios')}>
              Ver relatório completo
            </button>
          </div>

          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              Carregando...
            </div>
          ) : salesData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              Sem dados no período
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  tickFormatter={(v: number) => `R$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  width={56}
                />
                <Tooltip
                  formatter={(value: unknown) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
                  labelFormatter={(l: unknown) => `Data: ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4a8c42"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#4a8c42' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Pedidos Recentes
            </h2>
            <button className="btn btn--outline btn--sm" onClick={() => navigate('/pedidos')}>
              Ver todos
            </button>
          </div>

          {loading ? (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
          ) : !summary || summary.recentOrders.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Nenhum pedido ainda.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {summary.recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/pedidos/${order.id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px var(--space-md)', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-divider)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {order.client.nomeFantasia}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <span
                      className={`badge badge--${order.status.toLowerCase()}`}
                      style={{ fontSize: 10, padding: '2px 6px', marginTop: 2, display: 'inline-block', backgroundColor: STATUS_COLORS[order.status], color: '#fff', borderRadius: 4 }}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      {!loading && summary && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)' }}>
            Pedidos por Status
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => {
              const count = summary.ordersByStatus[status] ?? 0;
              return (
                <div
                  key={status}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${STATUS_COLORS[status]}` }}
                >
                  <span style={{ fontSize: 20, fontWeight: 700, color: STATUS_COLORS[status] }}>{count}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{STATUS_LABELS[status]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{sub}</div>
    </div>
  );
}
