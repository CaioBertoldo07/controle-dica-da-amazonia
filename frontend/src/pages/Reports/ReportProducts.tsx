import { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { fetchTopProducts } from '../../services/reportApi';
import type { TopProduct } from '../../types';

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

const GREEN_SHADES = ['#2d5a27', '#3a7232', '#4a8c42', '#5ca052', '#6eb462', '#7ec87a', '#96d490', '#aedea7', '#c8eac3', '#dff2dc'];

export function ReportProducts() {
  const defaults = getDefaults();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [data, setData] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTopProducts({ startDate, endDate, limit: 10 })
      .then(setData)
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const chartData = data.map((p) => ({ name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name, revenue: p.totalRevenue, qty: p.totalQuantity }));

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
        <button className="btn btn--primary btn--sm" onClick={load} disabled={loading}>
          {loading ? 'Carregando...' : 'Aplicar'}
        </button>
        <button
          className="btn btn--outline btn--sm"
          disabled={loading}
          onClick={() => {
            const d = getDefaults();
            setStartDate(d.startDate);
            setEndDate(d.endDate);
          }}
        >
          Limpar
        </button>
      </div>

      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-lg)', fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Sem dados no período selecionado.
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)' }}>
              Top 10 Produtos por Faturamento
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  tickFormatter={(v: number) => `R$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-primary)' }} width={130} />
                <Tooltip
                  formatter={(v: unknown, name: unknown) =>
                    name === 'revenue'
                      ? [`R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']
                      : [Number(v), 'Quantidade']
                  }
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={GREEN_SHADES[index % GREEN_SHADES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking Table */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-divider)' }}>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', width: 48 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Produto</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Código</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Qtd. Vendida</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Pedidos</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.productId} style={{ borderBottom: '1px solid var(--color-divider)', background: i === 0 ? 'rgba(74,140,66,0.04)' : undefined }}>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: i < 3 ? GREEN_SHADES[i] : 'var(--color-text-secondary)', fontSize: i === 0 ? 15 : 13 }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.name}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>{row.code}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>{row.totalQuantity.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>{row.orderCount}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      R$ {row.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
