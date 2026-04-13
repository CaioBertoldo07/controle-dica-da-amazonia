import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { loginRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    const err = await loginRequest(email, password);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate('/');
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b2e 0%, #4c1d95 50%, #6d28d9 100%)',
        padding: 'var(--space-lg)',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-2xl)',
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-sm)' }}>🌿</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 4,
            }}
          >
            Dica da Amazônia
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Controle Interno — Acesso Restrito
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-md)',
              marginBottom: 'var(--space-lg)',
              fontSize: 13,
              color: '#c62828',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label required" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
              placeholder="seu@email.com.br"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              autoComplete="email"
              disabled={loading}
            />
            {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label required" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              autoComplete="current-password"
              disabled={loading}
            />
            {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-sm)', height: 44, fontSize: 15 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
