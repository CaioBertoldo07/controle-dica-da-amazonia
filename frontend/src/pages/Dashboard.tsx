import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useAuthStore } from '../store/authStore';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  vendedor: 'Vendedor',
  operador: 'Operador',
};

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: 'var(--space-2xl)',
              maxWidth: 560,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: 48, marginBottom: 'var(--space-lg)' }}>🌿</div>

            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Bem-vindo ao sistema!
            </h1>

            <p
              style={{
                fontSize: 15,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-xl)',
                lineHeight: 1.6,
              }}
            >
              Sistema em implementação — Phase 1 concluída
            </p>

            {user && (
              <div
                style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-divider)',
                  overflow: 'hidden',
                }}
              >
                <InfoRow label="Nome" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Perfil" value={roleLabels[user.role] ?? user.role} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
        padding: '12px var(--space-lg)',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
