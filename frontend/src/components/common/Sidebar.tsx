import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: '📊' },
  { label: 'Clientes', to: '/clientes', icon: '👥' },
  { label: 'Produtos', to: '/produtos', icon: '📦' },
  { label: 'Embalagens', to: '/embalagens', icon: '🎁' },
  { label: 'Pedidos', to: '/pedidos', icon: '📋' },
  { label: 'Relatórios', to: '/relatorios', icon: '📈' },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: '100%',
      }}
    >
      <nav style={{ padding: 'var(--space-md) 0', flex: 1 }}>
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  padding: '12px var(--space-lg)',
                  color: 'rgba(255,255,255,0.30)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'not-allowed',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    background: 'rgba(255,255,255,0.08)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  em breve
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '12px var(--space-lg)',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #7ec87a' : '3px solid transparent',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.style.borderLeft.includes('7ec87a')) {
                  el.style.background = 'rgba(255,255,255,0.07)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.style.borderLeft.includes('7ec87a')) {
                  el.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        Phase 4 — Reporting
      </div>
    </aside>
  );
}
