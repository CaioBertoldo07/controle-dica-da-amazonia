import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { fetchClient, createClient, updateClient } from '../../services/clientApi';
import type { ClientFormData } from '../../types';

const UF_OPTIONS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

const EMPTY: ClientFormData = {
  cnpj: '', razaoSocial: '', nomeFantasia: '', type: 'B2B',
  inscrEstadual: '', pessoaContatoNome: '', pessoaContatoCPF: '',
  email: '', telefone: '', whatsapp: '',
  endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: 'SP', cep: '',
  observacoes: '', isActive: true,
};

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className={`form-label${required ? ' required' : ''}`}>{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-xl)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
        {children}
      </div>
    </div>
  );
}

export function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<ClientFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    setInitialLoading(true);
    fetchClient(id)
      .then((c) => {
        setForm({
          cnpj: c.cnpj, razaoSocial: c.razaoSocial, nomeFantasia: c.nomeFantasia,
          type: c.type, inscrEstadual: c.inscrEstadual ?? '',
          pessoaContatoNome: c.pessoaContatoNome, pessoaContatoCPF: c.pessoaContatoCPF ?? '',
          email: c.email, telefone: c.telefone, whatsapp: c.whatsapp,
          endereco: c.endereco, numero: c.numero, complemento: c.complemento ?? '',
          bairro: c.bairro, cidade: c.cidade, uf: c.uf, cep: c.cep,
          observacoes: c.observacoes ?? '', isActive: c.isActive,
        });
      })
      .catch(() => setApiError('Erro ao carregar dados do cliente.'))
      .finally(() => setInitialLoading(false));
  }, [id]);

  function set(field: keyof ClientFormData, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ClientFormData, string>> = {};
    if (!form.cnpj) e.cnpj = 'CNPJ é obrigatório';
    if (!form.razaoSocial) e.razaoSocial = 'Razão social é obrigatória';
    if (!form.nomeFantasia) e.nomeFantasia = 'Nome fantasia é obrigatório';
    if (!form.pessoaContatoNome) e.pessoaContatoNome = 'Nome do contato é obrigatório';
    if (!form.email) e.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.telefone) e.telefone = 'Telefone é obrigatório';
    if (!form.whatsapp) e.whatsapp = 'WhatsApp é obrigatório';
    if (!form.endereco) e.endereco = 'Endereço é obrigatório';
    if (!form.numero) e.numero = 'Número é obrigatório';
    if (!form.bairro) e.bairro = 'Bairro é obrigatório';
    if (!form.cidade) e.cidade = 'Cidade é obrigatória';
    if (!form.cep) e.cep = 'CEP é obrigatório';
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
        await updateClient(id!, form);
      } else {
        await createClient(form);
      }
      navigate('/clientes');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error ?? 'Erro ao salvar cliente.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inp = (field: keyof ClientFormData): React.CSSProperties => ({
    height: 40, padding: '8px 12px',
    border: `1px solid ${errors[field] ? 'var(--color-error)' : 'var(--color-divider)'}`,
    borderRadius: 'var(--radius-md)', fontSize: 14,
    color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
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
        title={isEdit ? 'Editar Cliente' : 'Novo Cliente'}
        action={
          <button className="btn btn--outline" onClick={() => navigate('/clientes')}>
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
        <SectionCard title="Dados da Empresa">
          <Field label="CNPJ" required error={errors.cnpj}>
            <input style={inp('cnpj')} value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} placeholder="00.000.000/0000-00" className="form-input" />
          </Field>
          <Field label="Razão Social" required error={errors.razaoSocial}>
            <input style={inp('razaoSocial')} value={form.razaoSocial} onChange={(e) => set('razaoSocial', e.target.value)} className="form-input" />
          </Field>
          <Field label="Nome Fantasia" required error={errors.nomeFantasia}>
            <input style={inp('nomeFantasia')} value={form.nomeFantasia} onChange={(e) => set('nomeFantasia', e.target.value)} className="form-input" />
          </Field>
          <Field label="Tipo" required>
            <select style={inp('type')} value={form.type} onChange={(e) => set('type', e.target.value)} className="form-input">
              <option value="B2B">B2B (Revenda)</option>
              <option value="B2C">B2C (Consumidor Final)</option>
            </select>
          </Field>
          <Field label="Inscrição Estadual">
            <input style={inp('inscrEstadual')} value={form.inscrEstadual} onChange={(e) => set('inscrEstadual', e.target.value)} className="form-input" />
          </Field>
        </SectionCard>

        <SectionCard title="Dados do Contato">
          <Field label="Nome do Contato" required error={errors.pessoaContatoNome}>
            <input style={inp('pessoaContatoNome')} value={form.pessoaContatoNome} onChange={(e) => set('pessoaContatoNome', e.target.value)} className="form-input" />
          </Field>
          <Field label="CPF do Contato">
            <input style={inp('pessoaContatoCPF')} value={form.pessoaContatoCPF} onChange={(e) => set('pessoaContatoCPF', e.target.value)} placeholder="000.000.000-00" className="form-input" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input style={inp('email')} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="form-input" />
          </Field>
          <Field label="Telefone" required error={errors.telefone}>
            <input style={inp('telefone')} value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(00) 00000-0000" className="form-input" />
          </Field>
          <Field label="WhatsApp" required error={errors.whatsapp}>
            <input style={inp('whatsapp')} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="(00) 00000-0000" className="form-input" />
          </Field>
        </SectionCard>

        <SectionCard title="Endereço">
          <Field label="CEP" required error={errors.cep}>
            <input style={inp('cep')} value={form.cep} onChange={(e) => set('cep', e.target.value)} placeholder="00000-000" className="form-input" />
          </Field>
          <Field label="Endereço" required error={errors.endereco}>
            <input style={inp('endereco')} value={form.endereco} onChange={(e) => set('endereco', e.target.value)} className="form-input" />
          </Field>
          <Field label="Número" required error={errors.numero}>
            <input style={inp('numero')} value={form.numero} onChange={(e) => set('numero', e.target.value)} className="form-input" />
          </Field>
          <Field label="Complemento">
            <input style={inp('complemento')} value={form.complemento} onChange={(e) => set('complemento', e.target.value)} className="form-input" />
          </Field>
          <Field label="Bairro" required error={errors.bairro}>
            <input style={inp('bairro')} value={form.bairro} onChange={(e) => set('bairro', e.target.value)} className="form-input" />
          </Field>
          <Field label="Cidade" required error={errors.cidade}>
            <input style={inp('cidade')} value={form.cidade} onChange={(e) => set('cidade', e.target.value)} className="form-input" />
          </Field>
          <Field label="UF" required>
            <select style={inp('uf')} value={form.uf} onChange={(e) => set('uf', e.target.value)} className="form-input">
              {UF_OPTIONS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </Field>
        </SectionCard>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-divider)', paddingBottom: 'var(--space-sm)' }}>
            Observações
          </h3>
          <textarea
            style={{ width: '100%', minHeight: 80, padding: '8px 12px', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text-primary)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            value={form.observacoes}
            onChange={(e) => set('observacoes', e.target.value)}
            placeholder="Observações internas sobre o cliente..."
          />
        </div>

        {isEdit && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
            <label htmlFor="isActive" style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--color-text-primary)' }}>
              Cliente ativo
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/clientes')} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={loading} style={{ minWidth: 120 }}>
            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Cliente'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
