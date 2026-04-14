import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logoutAndRedirect } = useAuth();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--color-sidebar-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)',
        boxShadow: 'var(--shadow-sm)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo / Nome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>🌿</span>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-text-on-primary)',
              letterSpacing: '-0.2px',
              lineHeight: 1.2,
            }}
          >
            Dica da Amazônia
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Controle Interno
          </div>
        </div>
      </div>

      {/* Usuário + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {user && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'capitalize',
              }}
            >
              {user.role}
            </div>
          </div>
        )}

        <button
          onClick={logoutAndRedirect}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.45)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLButtonElement;
            el.style.background = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLButtonElement;
            el.style.background = 'transparent';
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
