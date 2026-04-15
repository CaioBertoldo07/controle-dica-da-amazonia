import { useState, useEffect } from 'react';
import { fetchPackagingAnalysis } from '../../services/reportApi';
import type { PackagingAnalysisItem } from '../../types';

export function ReportPackaging() {
  const [data, setData] = useState<PackagingAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackagingAnalysis()
      .then(setData)
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, []);

  const needsReorder = data.filter((p) => p.needsReorder);
  const ok = data.filter((p) => !p.needsReorder);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Carregando...
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--color-error)', fontSize: 14 }}>{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Nenhuma embalagem cadastrada.
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', borderTop: '3px solid #4a8c42' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Total de Embalagens</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>{data.length}</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', borderTop: `3px solid ${needsReorder.length > 0 ? '#ef4444' : '#4a8c42'}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Precisam Reposição</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: needsReorder.length > 0 ? '#ef4444' : '#4a8c42' }}>{needsReorder.length}</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', borderTop: '3px solid #4a8c42' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Estoque Adequado</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#4a8c42' }}>{ok.length}</div>
        </div>
      </div>

      {/* Reorder Alert */}
      {needsReorder.length > 0 && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffc107', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontSize: 13 }}>
          <strong>⚠ Embalagens que precisam de reposição:</strong>{' '}
          {needsReorder.map((p) => p.name).join(', ')}
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-divider)' }}>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Embalagem</th>
              <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Tipo</th>
              <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Estoque Atual</th>
              <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Estoque Mínimo</th>
              <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Consumido (30 dias)</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Nível de Estoque</th>
              <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const pct = row.minimumStock > 0
                ? Math.min((row.currentStock / (row.minimumStock * 2)) * 100, 100)
                : Math.min(row.currentStock, 100);
              const barColor = row.needsReorder ? '#ef4444' : row.currentStock <= row.minimumStock * 1.5 ? '#f59e0b' : '#4a8c42';

              return (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--color-divider)', background: row.needsReorder ? 'rgba(239,68,68,0.03)' : undefined }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: row.type === 'ESPECIAL' ? '#e3f0e1' : '#f0ece3', color: 'var(--color-text-secondary)' }}>
                      {row.type === 'ESPECIAL' ? 'Especial' : 'Padrão'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: row.needsReorder ? '#ef4444' : 'var(--color-text-primary)' }}>
                    {row.currentStock.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                    {row.minimumStock.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                    {row.consumedLast30Days.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', minWidth: 120 }}>
                    <div style={{ background: 'var(--color-divider)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 3 }}>
                      {row.currentStock} / {row.minimumStock * 2}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {row.needsReorder ? (
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#ffebee', color: '#ef4444', fontWeight: 600 }}>
                        Repor
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#e8f5e9', color: '#4a8c42', fontWeight: 600 }}>
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 'var(--space-md)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
        * Consumido nos últimos 30 dias refere-se a pedidos com status PROCESSANDO ou posterior.
      </div>
    </div>
  );
}
