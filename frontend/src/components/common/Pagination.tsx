interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    minWidth: 36,
    height: 36,
    border: active
      ? '1px solid var(--color-primary)'
      : '1px solid var(--color-divider)',
    borderRadius: 'var(--radius-md)',
    background: active ? 'var(--color-primary)' : 'var(--color-surface)',
    color: active ? '#fff' : disabled ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    opacity: disabled ? 0.4 : 1,
    padding: '0 10px',
    transition: 'all var(--transition-fast)',
  });

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'var(--space-lg)',
        flexWrap: 'wrap',
        gap: 'var(--space-sm)',
      }}
    >
      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
        Exibindo {from}–{to} de {total} registros
      </span>

      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        <button
          style={btnStyle(false, page === 1)}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              style={{
                minWidth: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              style={btnStyle(p === page, false)}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          ),
        )}

        <button
          style={btnStyle(false, page === totalPages)}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
