import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchProduct, createProduct, updateProduct } from '../../services/productApi';
import { fetchPackagingsAll } from '../../services/packagingApi';
import type { ProductFormData, Packaging } from '../../types';

const EMPTY: ProductFormData = {
  name: '', description: '', code: '', price: 0, packagingId: '',
  isActive: true, stock: 0,
};

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<ProductFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [packagings, setPackagings] = useState<Packaging[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const pkgs = await fetchPackagingsAll();
        setPackagings(pkgs);
        if (pkgs.length > 0 && !id) {
          setForm((p) => ({ ...p, packagingId: pkgs[0].id }));
        }
        if (id) {
          const product = await fetchProduct(id);
          setForm({
            name: product.name, description: product.description ?? '',
            code: product.code, price: Number(product.price),
            packagingId: product.packagingId, isActive: product.isActive,
            stock: product.stock,
          });
        }
      } catch {
        setApiError('Erro ao carregar dados.');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id]);

  function set(field: keyof ProductFormData, value: string | boolean | number) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name) e.name = 'Nome é obrigatório';
    if (!form.code) e.code = 'Código é obrigatório';
    if (!form.price || form.price <= 0) e.price = 'Preço deve ser maior que zero';
    if (!form.packagingId) e.packagingId = 'Selecione uma embalagem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      if (isEdit) {
        await updateProduct(id!, form);
      } else {
        await createProduct(form);
      }
      navigate('/produtos');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao salvar produto.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inp = (field: keyof ProductFormData): React.CSSProperties => ({
    height: 40, padding: '8px 12px',
    border: `1px solid ${errors[field] ? 'var(--color-error)' : 'var(--color-divider)'}`,
    borderRadius: 'var(--radius-md)', fontSize: 14,
    color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '100%',
  });

  if (initialLoading) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)' }}>
          Carregando...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEdit ? 'Editar Produto' : 'Novo Produto'}
        action={
          <button className="btn btn--outline" onClick={() => navigate('/produtos')}>
            ← Voltar
          </button>
        }
      />

      {apiError && (
        <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-lg)', fontSize: 13, color: '#c62828' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
            Dados do Produto
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>

            <div className="form-group">
              <label className="form-label required">Nome</label>
              <input style={inp('name')} value={form.name} onChange={(e) => set('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required">Código</label>
              <input style={inp('code')} value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="ex: CAF-001" />
              {errors.code && <span className="form-error">{errors.code}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required">Preço (R$)</label>
              <input style={inp('price')} type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Estoque</label>
              <input style={inp('stock')} type="number" min="0" value={form.stock} onChange={(e) => set('stock', parseInt(e.target.value) || 0)} />
            </div>

            <div className="form-group">
              <label className="form-label required">Embalagem</label>
              <select style={inp('packagingId')} value={form.packagingId} onChange={(e) => set('packagingId', e.target.value)}>
                <option value="">Selecione...</option>
                {packagings.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.type === 'PADRAO' ? 'Padrão' : 'Especial'})</option>
                ))}
              </select>
              {errors.packagingId && <span className="form-error">{errors.packagingId}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descrição</label>
              <textarea
                style={{ width: '100%', minHeight: 80, padding: '8px 12px', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text-primary)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            {isEdit && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <input id="isActiveP" type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
                <label htmlFor="isActiveP" style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--color-text-primary)' }}>Produto ativo</label>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/produtos')} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={loading} style={{ minWidth: 120 }}>
            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
