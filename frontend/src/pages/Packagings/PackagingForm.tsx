import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchPackaging, createPackaging, updatePackaging } from '../../services/packagingApi';
import type { PackagingFormData } from '../../types';

const EMPTY: PackagingFormData = {
  name: '', type: 'PADRAO', description: '',
  unitCost: 0, currentStock: 0, minimumStock: 100,
  supplier: '', supplierContact: '',
  lastPurchaseDate: '', lastPurchaseQty: undefined,
};

export function PackagingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<PackagingFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof PackagingFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    fetchPackaging(id)
      .then((pkg) => {
        setForm({
          name: pkg.name, type: pkg.type, description: pkg.description ?? '',
          unitCost: Number(pkg.unitCost), currentStock: pkg.currentStock,
          minimumStock: pkg.minimumStock, supplier: pkg.supplier ?? '',
          supplierContact: pkg.supplierContact ?? '',
          lastPurchaseDate: pkg.lastPurchaseDate ? pkg.lastPurchaseDate.slice(0, 10) : '',
          lastPurchaseQty: pkg.lastPurchaseQty ?? undefined,
        });
      })
      .catch(() => setApiError('Erro ao carregar dados da embalagem.'))
      .finally(() => setInitialLoading(false));
  }, [id]);

  function set(field: keyof PackagingFormData, value: string | number | undefined) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof PackagingFormData, string>> = {};
    if (!form.name) e.name = 'Nome é obrigatório';
    if (!form.unitCost || form.unitCost <= 0) e.unitCost = 'Custo deve ser maior que zero';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const payload = {
        ...form,
        lastPurchaseDate: form.lastPurchaseDate || undefined,
        lastPurchaseQty: form.lastPurchaseQty || undefined,
      };
      if (isEdit) {
        await updatePackaging(id!, payload);
      } else {
        await createPackaging(payload);
      }
      navigate('/embalagens');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao salvar embalagem.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inp = (field: keyof PackagingFormData): React.CSSProperties => ({
    height: 40, padding: '8px 12px',
    border: `1px solid ${errors[field] ? 'var(--color-error)' : 'var(--color-divider)'}`,
    borderRadius: 'var(--radius-md)', fontSize: 14,
    color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '100%',
  });

  if (initialLoading) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)' }}>Carregando...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEdit ? 'Editar Embalagem' : 'Nova Embalagem'}
        action={<button className="btn btn--outline" onClick={() => navigate('/embalagens')}>← Voltar</button>}
      />

      {apiError && (
        <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-lg)', fontSize: 13, color: '#c62828' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Dados principais */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
            Dados da Embalagem
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label required">Nome</label>
              <input style={inp('name')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="ex: Embalagem Padrão 250g" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label required">Tipo</label>
              <select style={inp('type')} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="PADRAO">Padrão</option>
                <option value="ESPECIAL">Especial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">Custo Unitário (R$)</label>
              <input style={inp('unitCost')} type="number" step="0.01" min="0" value={form.unitCost} onChange={(e) => set('unitCost', parseFloat(e.target.value) || 0)} />
              {errors.unitCost && <span className="form-error">{errors.unitCost}</span>}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descrição</label>
              <textarea
                style={{ width: '100%', minHeight: 72, padding: '8px 12px', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', color: 'var(--color-text-primary)' }}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Estoque */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
            Estoque
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">Estoque Inicial</label>
                <input style={inp('currentStock')} type="number" min="0" value={form.currentStock} onChange={(e) => set('currentStock', parseInt(e.target.value) || 0)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Estoque Mínimo</label>
              <input style={inp('minimumStock')} type="number" min="0" value={form.minimumStock} onChange={(e) => set('minimumStock', parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* Fornecedor */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
            Fornecedor
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Fornecedor</label>
              <input style={inp('supplier')} value={form.supplier} onChange={(e) => set('supplier', e.target.value)} placeholder="Nome do fornecedor" />
            </div>
            <div className="form-group">
              <label className="form-label">Contato do Fornecedor</label>
              <input style={inp('supplierContact')} value={form.supplierContact} onChange={(e) => set('supplierContact', e.target.value)} placeholder="(00) 00000-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Última Compra</label>
              <input style={inp('lastPurchaseDate')} type="date" value={form.lastPurchaseDate} onChange={(e) => set('lastPurchaseDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Qtd. Última Compra</label>
              <input style={inp('lastPurchaseQty')} type="number" min="1" value={form.lastPurchaseQty ?? ''} onChange={(e) => set('lastPurchaseQty', parseInt(e.target.value) || undefined)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/embalagens')} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={loading} style={{ minWidth: 130 }}>
            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Embalagem'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
