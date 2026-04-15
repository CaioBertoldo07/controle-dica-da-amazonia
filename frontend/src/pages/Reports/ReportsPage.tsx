import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../components/common/AppLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { ReportSales } from './ReportSales';
import { ReportProducts } from './ReportProducts';
import { ReportClients } from './ReportClients';
import { ReportPackaging } from './ReportPackaging';

type Tab = 'vendas' | 'produtos' | 'clientes' | 'embalagens';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'vendas', label: 'Vendas', icon: '📈' },
  { id: 'produtos', label: 'Produtos', icon: '📦' },
  { id: 'clientes', label: 'Clientes', icon: '👥' },
  { id: 'embalagens', label: 'Embalagens', icon: '🎁' },
];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  vendas: 'Faturamento ao longo do tempo com filtros de período',
  produtos: 'Top 10 produtos por faturamento e volume vendido',
  clientes: 'Top 10 clientes por faturamento e frequência de pedidos',
  embalagens: 'Análise de estoque atual vs mínimo e consumo recente',
};

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = searchParams.get('tab') as Tab;
    return TABS.some((t) => t.id === tab) ? tab : 'vendas';
  });

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  function handleTab(tab: Tab) {
    setActiveTab(tab);
    setSearchParams({ tab });
  }

  return (
    <AppLayout>
      <PageHeader
        title="Relatórios"
        description={TAB_DESCRIPTIONS[activeTab]}
      />

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-xl)', background: 'var(--color-surface)', padding: 6, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', width: 'fit-content' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-secondary)',
              background: activeTab === tab.id ? '#4a8c42' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'vendas' && <ReportSales />}
        {activeTab === 'produtos' && <ReportProducts />}
        {activeTab === 'clientes' && <ReportClients />}
        {activeTab === 'embalagens' && <ReportPackaging />}
      </div>
    </AppLayout>
  );
}
