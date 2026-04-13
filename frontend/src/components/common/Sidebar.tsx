import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: '📊' },
  { label: 'Clientes', to: '/clientes', icon: '👥', disabled: true },
  { label: 'Produtos', to: '/produtos', icon: '📦', disabled: true },
  { label: 'Embalagens', to: '/embalagens', icon: '🎁', disabled: true },
  { label: 'Pedidos', to: '/pedidos', icon: '📋', disabled: true },
  { label: 'Relatórios', to: '/relatorios', icon: '📈', disabled: true },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: '#6d28d9',
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
                  color: 'rgba(255,255,255,0.35)',
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
                    background: 'rgba(255,255,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: 4,
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
              end
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '12px var(--space-lg)',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #a78bfa' : '3px solid transparent',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.style.borderLeft.includes('a78bfa')) {
                  el.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.style.borderLeft.includes('a78bfa')) {
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
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        Phase 1 — Foundation
      </div>
    </aside>
  );
}
