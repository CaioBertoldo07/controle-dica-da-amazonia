import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchOrder, updateOrderStatus } from '../../services/orderApi';
import { formatDateBR } from '../../utils/date';
import type { Order, OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDENTE:    'Pendente',
  PROCESSANDO: 'Processando',
  PRODUCAO:    'Em Produção',
  PREPARADO:   'Preparado',
  ENVIADO:     'Enviado',
  ENTREGUE:    'Entregue',
  CANCELADO:   'Cancelado',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDENTE:    'badge--pending',
  PROCESSANDO: 'badge--processando',
  PRODUCAO:    'badge--producao',
  PREPARADO:   'badge--preparado',
  ENVIADO:     'badge--enviado',
  ENTREGUE:    'badge--entregue',
  CANCELADO:   'badge--cancelado',
};

// What the next "advance" step is for each status
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDENTE:    'PROCESSANDO',
  PROCESSANDO: 'PRODUCAO',
  PRODUCAO:    'PREPARADO',
  PREPARADO:   'ENVIADO',
  ENVIADO:     'ENTREGUE',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDENTE:    'Iniciar Processamento',
  PROCESSANDO: 'Enviar para Produção',
  PRODUCAO:    'Marcar como Preparado',
  PREPARADO:   'Marcar como Enviado',
  ENVIADO:     'Confirmar Entrega',
};

// Statuses that require cancelReason
const CANCEL_REASON_REQUIRED: OrderStatus[] = ['PRODUCAO', 'PREPARADO', 'ENVIADO'];

interface StatusModal {
  type: 'advance' | 'cancel';
  targetStatus: OrderStatus;
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<StatusModal | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError('Pedido não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate() {
    if (!order || !modal) return;

    const needsReason = modal.type === 'cancel' && CANCEL_REASON_REQUIRED.includes(order.status);
    if (needsReason && !cancelReason.trim()) {
      setActionError('Informe o motivo do cancelamento.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await updateOrderStatus(order.id, modal.targetStatus, cancelReason || undefined);
      setOrder(updated);
      setModal(null);
      setCancelReason('');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao atualizar status.';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <AppLayout><div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando...</div></AppLayout>;
  }

  if (error || !order) {
    return (
      <AppLayout>
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-error)' }}>{error ?? 'Pedido não encontrado.'}</div>
      </AppLayout>
    );
  }

  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = order.status !== 'ENTREGUE' && order.status !== 'CANCELADO';
  const needsCancelReason = CANCEL_REASON_REQUIRED.includes(order.status);

  return (
    <AppLayout>
      <PageHeader
        title={order.orderNumber}
        description={`Pedido de ${order.client.razaoSocial}`}
        action={
          <button className="btn btn--outline" onClick={() => navigate('/pedidos')}>
            ← Voltar
          </button>
        }
      />

      {/* Status + Actions */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Status:</span>
            <span className={`badge ${STATUS_BADGE[order.status]}`} style={{ fontSize: 13, padding: '6px 12px' }}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {nextStatus && (
              <button
                className="btn btn--primary"
                onClick={() => { setModal({ type: 'advance', targetStatus: nextStatus }); setActionError(null); }}
              >
                {NEXT_LABEL[order.status]}
              </button>
            )}
            {canCancel && (
              <button
                className="btn btn--danger"
                onClick={() => { setModal({ type: 'cancel', targetStatus: 'CANCELADO' }); setCancelReason(''); setActionError(null); }}
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>

        {order.status === 'CANCELADO' && order.cancelReason && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: '#ffebee', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-error)' }}>
            <strong>Motivo do cancelamento:</strong> {order.cancelReason}
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-lg)', alignItems: 'start' }}>

        {/* Items */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--color-divider)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>Produtos</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
                {['Código', 'Produto', 'Qtd.', 'Preço Unit.', 'Subtotal'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < order.items.length - 1 ? '1px solid var(--color-divider)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.product.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.product.name}</td>
                  <td style={{ padding: '12px 16px' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 16px' }}>R$ {Number(item.unitPrice).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>R$ {Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--color-divider)', background: 'var(--color-bg)' }}>
                <td colSpan={4} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>Total:</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 16, color: 'var(--color-primary)' }}>R$ {Number(order.total).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>Informações do Pedido</h3>
            <InfoRow label="Nº Pedido" value={<span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.orderNumber}</span>} />
            <InfoRow label="Data" value={formatDateBR(order.createdAt)} />
            <InfoRow label="Última atualização" value={formatDateBR(order.updatedAt)} />
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>Cliente</h3>
            <InfoRow label="Razão Social" value={order.client.razaoSocial} />
            <InfoRow label="Nome Fantasia" value={order.client.nomeFantasia} />
          </div>

          {order.notes && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>Observações</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status update modal */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-lg)' }}
          onClick={() => setModal(null)}
        >
          <div
            style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-xl)', maxWidth: 420, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
              {modal.type === 'cancel' ? 'Cancelar Pedido' : `Avançar para: ${STATUS_LABELS[modal.targetStatus]}`}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              {modal.type === 'cancel'
                ? `Cancelar o pedido ${order.orderNumber}?`
                : `Confirmar a transição de "${STATUS_LABELS[order.status]}" para "${STATUS_LABELS[modal.targetStatus]}"?`}
              {modal.type === 'advance' && modal.targetStatus === 'PROCESSANDO' && (
                <span style={{ display: 'block', marginTop: 6, color: 'var(--color-warning)', fontWeight: 500 }}>
                  ⚠ O estoque das embalagens será reservado.
                </span>
              )}
            </p>

            {modal.type === 'cancel' && (
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className={`form-label${needsCancelReason ? ' required' : ''}`}>Motivo do Cancelamento</label>
                <textarea
                  className="form-input"
                  style={{ height: 80, resize: 'vertical' }}
                  placeholder={needsCancelReason ? 'Obrigatório nesta etapa...' : 'Opcional...'}
                  value={cancelReason}
                  onChange={(e) => { setCancelReason(e.target.value); setActionError(null); }}
                />
                {actionError && <span className="form-error">{actionError}</span>}
              </div>
            )}

            {actionError && modal.type !== 'cancel' && (
              <div style={{ color: 'var(--color-error)', fontSize: 13, marginBottom: 'var(--space-md)' }}>{actionError}</div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button className="btn btn--outline" onClick={() => setModal(null)} disabled={actionLoading}>Cancelar</button>
              <button
                className={`btn ${modal.type === 'cancel' ? 'btn--danger' : 'btn--primary'}`}
                onClick={handleStatusUpdate}
                disabled={actionLoading}
                style={{ minWidth: 120 }}
              >
                {actionLoading ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--color-divider)' }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--color-text-primary)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
