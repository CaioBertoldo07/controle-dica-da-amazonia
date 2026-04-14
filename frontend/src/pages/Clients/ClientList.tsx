import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { fetchClients, deactivateClient } from '../../services/clientApi';
import type { Client, Pagination as PaginationType } from '../../types';

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

export function ClientList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [type, setType] = useState<'B2B' | 'B2C' | ''>('');
  const [isActive, setIsActive] = useState<boolean | ''>('');
  const [page, setPage] = useState(1);

  const [deactivating, setDeactivating] = useState<Client | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchClients({ page, limit: 10, search: search || undefined, type: type || undefined, isActive: isActive === '' ? undefined : isActive });
      setClients(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  }, [page, search, type, isActive]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function handleDeactivate() {
    if (!deactivating) return;
    setDeactivateLoading(true);
    try {
      await deactivateClient(deactivating.id);
      setDeactivating(null);
      load();
    } catch {
      setError('Erro ao desativar cliente.');
    } finally {
      setDeactivateLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Clientes"
        description={`${pagination.total} cliente(s) cadastrado(s)`}
        action={
          <button
            className="btn btn--primary"
            onClick={() => navigate('/clientes/novo')}
          >
            + Novo Cliente
          </button>
        }
      />

      {/* Filters */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          gap: 'var(--space-sm)',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <input
          style={{ ...inputStyle, minWidth: 220, flex: 1 }}
          placeholder="Buscar por razão social, fantasia ou CNPJ..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          style={inputStyle}
          value={type}
          onChange={(e) => { setType(e.target.value as any); setPage(1); }}
        >
          <option value="">Todos os tipos</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>
        <select
          style={inputStyle}
          value={String(isActive)}
          onChange={(e) => {
            const v = e.target.value;
            setIsActive(v === '' ? '' : v === 'true');
            setPage(1);
          }}
        >
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {error && (
          <div style={{ padding: 'var(--space-lg)', color: 'var(--color-error)', textAlign: 'center', fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Carregando...
          </div>
        ) : clients.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Nenhum cliente encontrado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
                {['CNPJ', 'Razão Social', 'Nome Fantasia', 'Tipo', 'Cidade/UF', 'Status', 'Ações'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr
                  key={client.id}
                  style={{
                    borderBottom: i < clients.length - 1 ? '1px solid var(--color-divider)' : 'none',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>{client.cnpj}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{client.razaoSocial}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{client.nomeFantasia}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={`badge ${client.type === 'B2B' ? 'badge--info' : 'badge--success'}`}
                    >
                      {client.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                    {client.cidade}/{client.uf}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${client.isActive ? 'badge--success' : 'badge--inactive'}`}>
                      {client.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button
                        className="btn btn--outline btn--sm"
                        onClick={() => navigate(`/clientes/${client.id}/editar`)}
                      >
                        Editar
                      </button>
                      {client.isActive && (
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => setDeactivating(client)}
                        >
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

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deactivating}
        title="Desativar cliente"
        message={`Tem certeza que deseja desativar "${deactivating?.razaoSocial}"? Esta ação pode ser revertida editando o cliente.`}
        confirmLabel="Desativar"
        loading={deactivateLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivating(null)}
      />
    </AppLayout>
  );
}
