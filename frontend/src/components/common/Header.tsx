import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logoutAndRedirect } = useAuth();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)',
        boxShadow: 'var(--shadow-sm)',
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
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text-on-primary)',
            letterSpacing: '-0.3px',
          }}
        >
          🌿 Dica da Amazônia
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 2,
          }}
        >
          Controle Interno
        </span>
      </div>

      {/* Usuário + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {user && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-on-primary)',
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.65)',
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
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'var(--color-text-on-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
