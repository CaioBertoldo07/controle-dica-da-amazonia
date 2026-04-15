import { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { fetchSalesOverTime } from '../../services/reportApi';
import type { SalesDataPoint } from '../../types';

function toDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDefaults() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { startDate: toDateStr(start), endDate: toDateStr(end) };
}

const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 10px',
  border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)',
  fontSize: 13, color: 'var(--color-text-primary)', background: 'var(--color-surface)',
};

export function ReportSales() {
  const defaults = getDefaults();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<SalesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchSalesOverTime({ startDate, endDate, groupBy })
      .then(setData)
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, [startDate, endDate, groupBy]);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 'var(--space-xl)', background: 'var(--color-surface)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Data inicial</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Data final</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Agrupar por</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')} style={inputStyle}>
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
          </select>
        </div>
        <button className="btn btn--primary btn--sm" onClick={load} disabled={loading}>
          {loading ? 'Carregando...' : 'Aplicar'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-lg)', fontSize: 14 }}>{error}</div>}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <SummaryCard label="Faturamento Total" value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        <SummaryCard label="Total de Pedidos" value={String(totalOrders)} />
        <SummaryCard label="Ticket Médio" value={`R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
      </div>

      {/* Revenue Chart */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)' }}>
          Faturamento ao Longo do Tempo
        </h3>
        {loading ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
        ) : data.length === 0 ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Sem dados no período selecionado.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                tickFormatter={(v: number) => `R$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                width={60}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                width={40}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) =>
                  name === 'revenue'
                    ? [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']
                    : [Number(value), 'Pedidos']
                }
              />
              <Legend formatter={(v: string) => (v === 'revenue' ? 'Faturamento' : 'Pedidos')} />
              <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#4a8c42" strokeWidth={2} dot={false} />
              <Line yAxisId="orders" type="monotone" dataKey="orders" stroke="#7ec87a" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders Bar Chart */}
      {!loading && data.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)' }}>
            Volume de Pedidos
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={36} allowDecimals={false} />
              <Tooltip formatter={(v: unknown) => [Number(v), 'Pedidos']} />
              <Bar dataKey="orders" fill="#4a8c42" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {!loading && data.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-divider)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Período</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Pedidos</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Faturamento</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--color-text-primary)' }}>{row.period}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--color-text-primary)' }}>{row.orders}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600 }}>
                    R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                    R$ {row.orders > 0 ? (row.revenue / row.orders).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', borderTop: '3px solid #4a8c42' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}
