import { useState, useEffect, useCallback } from 'react';
import { fetchTopClients } from '../../services/reportApi';
import type { TopClient } from '../../types';

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

export function ReportClients() {
  const defaults = getDefaults();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [data, setData] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTopClients({ startDate, endDate, limit: 10 })
      .then(setData)
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = data.reduce((s, c) => s + c.totalRevenue, 0);
  const totalOrders = data.reduce((s, c) => s + c.orderCount, 0);

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

      {/* Summary */}
      {!loading && data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <SummaryCard label="Clientes no Ranking" value={String(data.length)} />
          <SummaryCard label="Total de Pedidos" value={String(totalOrders)} />
          <SummaryCard label="Faturamento Total" value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>Carregando...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Sem dados no período selecionado.
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-divider)' }}>
                <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', width: 48 }}>#</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Cliente</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Pedidos</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Faturamento</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>% do Total</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Participação</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const pct = totalRevenue > 0 ? (row.totalRevenue / totalRevenue) * 100 : 0;
                return (
                  <tr key={row.clientId} style={{ borderBottom: '1px solid var(--color-divider)', background: i === 0 ? 'rgba(74,140,66,0.04)' : undefined }}>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: i < 3 ? ['#2d5a27', '#4a8c42', '#7ec87a'][i] : 'var(--color-text-secondary)', fontSize: i === 0 ? 15 : 13 }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.razaoSocial}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{row.nomeFantasia}</div>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>{row.orderCount}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600 }}>
                      R$ {row.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>{pct.toFixed(1)}%</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ background: 'var(--color-divider)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: '#4a8c42', borderRadius: 4, transition: 'width 0.3s' }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
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
