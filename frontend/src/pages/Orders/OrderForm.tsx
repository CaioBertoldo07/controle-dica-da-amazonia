import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchClientsAll } from '../../services/clientApi';
import { fetchProductsAll } from '../../services/productApi';
import { createOrder } from '../../services/orderApi';
import type { Client, Product, CreateOrderItemInput } from '../../types';

const inputStyle: React.CSSProperties = {
  height: 40, padding: '8px 12px',
  border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)',
  fontSize: 14, color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
  transition: 'border-color 0.15s',
};

interface ItemRow {
  productId: string;
  quantity: number;
}

export function OrderForm() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemRow[]>([{ productId: '', quantity: 1 }]);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchClientsAll(), fetchProductsAll()])
      .then(([c, p]) => { setClients(c); setProducts(p); })
      .catch(() => setApiError('Erro ao carregar dados.'))
      .finally(() => setLoadingData(false));
  }, []);

  function addItem() {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemRow, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    setErrors((prev) => { const next = { ...prev }; delete next[`item_${index}_${field}`]; return next; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!clientId) errs.clientId = 'Selecione um cliente.';
    if (items.length === 0) errs.items = 'Adicione pelo menos 1 produto.';

    const usedProducts = new Set<string>();
    items.forEach((item, i) => {
      if (!item.productId) errs[`item_${i}_productId`] = 'Selecione um produto.';
      else if (usedProducts.has(item.productId)) errs[`item_${i}_productId`] = 'Produto duplicado.';
      else usedProducts.add(item.productId);

      if (!item.quantity || item.quantity < 1 || item.quantity > 10000)
        errs[`item_${i}_quantity`] = 'Entre 1 e 10.000.';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function getProductTotal() {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setApiError(null);
    try {
      const payload: { clientId: string; notes?: string; items: CreateOrderItemInput[] } = {
        clientId,
        notes: notes || undefined,
        items: items.map((item) => ({ productId: item.productId, quantity: Number(item.quantity) })),
      };
      const order = await createOrder(payload);
      navigate(`/pedidos/${order.id}`);
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao criar pedido.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loadingData) {
    return (
      <AppLayout>
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando...</div>
      </AppLayout>
    );
  }

  const selectedProductIds = items.map((i) => i.productId).filter(Boolean);

  return (
    <AppLayout>
      <PageHeader
        title="Novo Pedido"
        description="Preencha os dados do pedido"
        action={
          <button className="btn btn--outline" onClick={() => navigate('/pedidos')}>
            ← Voltar
          </button>
        }
      />

      <form onSubmit={handleSubmit}>
        {apiError && (
          <div style={{ background: '#ffebee', color: 'var(--color-error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', fontSize: 14 }}>
            {apiError}
          </div>
        )}

        {/* Client section */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-divider)' }}>
            Cliente
          </h2>
          <div className="form-group" style={{ maxWidth: 480 }}>
            <label className="form-label required">Cliente</label>
            <select
              style={{ ...inputStyle, width: '100%' }}
              className={errors.clientId ? 'form-input--error' : ''}
              value={clientId}
              onChange={(e) => { setClientId(e.target.value); setErrors((p) => { const n = { ...p }; delete n.clientId; return n; }); }}
            >
              <option value="">Selecione um cliente...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.razaoSocial} ({c.nomeFantasia})</option>
              ))}
            </select>
            {errors.clientId && <span className="form-error">{errors.clientId}</span>}
          </div>
        </div>

        {/* Items section */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-divider)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Produtos <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--color-text-secondary)' }}>({items.length})</span>
            </h2>
            <button type="button" className="btn btn--outline btn--sm" onClick={addItem}>
              + Adicionar Produto
            </button>
          </div>

          {errors.items && <div className="form-error" style={{ marginBottom: 'var(--space-md)' }}>{errors.items}</div>}

          {items.map((item, index) => {
            const product = products.find((p) => p.id === item.productId);
            const subtotal = product ? product.price * item.quantity : 0;
            const availableProducts = products.filter(
              (p) => !selectedProductIds.includes(p.id) || p.id === item.productId
            );

            return (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px auto', gap: 'var(--space-sm)', alignItems: 'start', marginBottom: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <div className="form-group">
                  <label className="form-label required">Produto</label>
                  <select
                    style={{ ...inputStyle, width: '100%' }}
                    className={errors[`item_${index}_productId`] ? 'form-input--error' : ''}
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — R$ {Number(p.price).toFixed(2)}</option>
                    ))}
                  </select>
                  {errors[`item_${index}_productId`] && <span className="form-error">{errors[`item_${index}_productId`]}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Qtd.</label>
                  <input
                    className={`form-input${errors[`item_${index}_quantity`] ? ' form-input--error' : ''}`}
                    type="number"
                    min="1"
                    max="10000"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  {errors[`item_${index}_quantity`] && <span className="form-error">{errors[`item_${index}_quantity`]}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Subtotal</label>
                  <div style={{ height: 40, display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 600, color: subtotal > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                    R$ {subtotal.toFixed(2)}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ visibility: 'hidden' }}>_</label>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn--danger btn--sm"
                      style={{ height: 40 }}
                      onClick={() => removeItem(index)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Total: R$ {getProductTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Notes section */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-divider)' }}>
            Observações
          </h2>
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea
              className="form-input"
              style={{ height: 80, resize: 'vertical' }}
              placeholder="Informações adicionais sobre o pedido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/pedidos')} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving} style={{ minWidth: 140 }}>
            {saving ? 'Salvando...' : 'Criar Pedido'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
