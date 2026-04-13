# Roadmap de Desenvolvimento - Dica da Amazônia

## 📅 Visão Geral do Roadmap

O projeto é dividido em **5 fases principais** com duração total estimada de **16 semanas** (4 meses).

```
Phase 1: Foundation
├─ Setup & Infraestrutura
└─ Auth & Banco de Dados
    ↓
Phase 2: Core Modules
├─ CRUD Clientes
├─ CRUD Produtos
└─ CRUD Embalagens
    ↓
Phase 3: Business Logic
├─ CRUD Pedidos
├─ Cálculo de Embalagens
└─ Status de Pedidos
    ↓
Phase 4: Reporting
├─ Dashboard Principal
├─ Relatórios de Vendas
└─ Análises
    ↓
Phase 5: Polish & Deploy
├─ Testes & QA
├─ Otimização
├─ Deploy Produção
└─ Documentação Final
```

---

## 🔧 PHASE 1: Foundation (Semanas 1-2)

### Objetivo

Preparar infraestrutura básica, autenticação e banco de dados.

### 1.1 Setup Inicial do Projeto

**Backend:**

- [ ] Criar repositório GitHub
- [ ] Inicializar projeto Node.js + TypeScript
- [ ] Configurar package.json com dependências
- [ ] Setup Express.js
- [ ] Configurar ESLint + Prettier
- [ ] Criar arquivo .env.example
- [ ] Configurar nodemon para desenvolvimento

**Frontend:**

- [ ] Inicializar projeto Vite + React + TypeScript
- [ ] Instalar dependências (React Router, Axios, etc)
- [ ] Configurar ESLint + Prettier
- [ ] Setup de estrutura de pastas
- [ ] Criar arquivo .env.example

**Duração:** 2 dias

### 1.2 Banco de Dados

**MySQL Setup:**

- [ ] Criar banco de dados teste/produção
- [ ] Configurar Prisma
- [ ] Criar arquivo prisma/schema.prisma base
- [ ] Gerar client Prisma

**Schema Inicial:**

- [ ] Tabela Client
- [ ] Tabela Product
- [ ] Tabela Packaging

**Duração:** 2 dias

### 1.3 Autenticação

**Backend:**

- [ ] Implementar controller de login
- [ ] Setup JWT
- [ ] Middleware de autenticação
- [ ] Validação de credentials
- [ ] Endpoints POST /auth/login e POST /auth/refresh

**Frontend:**

- [ ] Criar página de Login
- [ ] Implementar context/store para autenticação
- [ ] Salvar token no localStorage
- [ ] Criar hook useAuth
- [ ] Implement protected routes

**Duração:** 3 dias

### 1.4 Setup Inicial de UI

**Frontend:**

- [ ] Importar tipografia Open Sans
- [ ] Configurar CSS variables (cores, spacing)
- [ ] Criar tema global
- [ ] Layout principal (Header, Sidebar, Footer)
- [ ] Componentes base (Button, Input, Card)

**Duração:** 2 dias

**Estimativa Total Phase 1: 9 dias**

---

## 📊 PHASE 2: Core Modules (Semanas 3-4)

### Objetivo

Implementar CRUDs básicos para as 3 entidades principais.

### 2.1 Módulo de Clientes

**Backend:**

- [ ] GET /clients (listar com paginação)
- [ ] GET /clients/:id
- [ ] POST /clients (criar)
- [ ] PUT /clients/:id (atualizar completo)
- [ ] PATCH /clients/:id (atualizar parcial)
- [ ] DELETE /clients/:id (soft delete)
- [ ] Validações (CNPJ, email único, telefone, etc)
- [ ] Testes unitários

**Frontend:**

- [ ] Página ListaClientes com tabela
- [ ] Formulário CreateCliente
- [ ] Página DetailCliente
- [ ] Integração com API
- [ ] Paginação e filtros
- [ ] Validações de formulário
- [ ] Mensagens de sucesso/erro

**Duração:** 5 dias

### 2.2 Módulo de Produtos

**Backend:**

- [ ] GET /products (com paginação e filtros)
- [ ] GET /products/:id
- [ ] POST /products
- [ ] PUT /products/:id
- [ ] PATCH /products/:id (atualizar preço)
- [ ] DELETE /products/:id (soft delete)
- [ ] Validações
- [ ] Testes

**Frontend:**

- [ ] PáginaListaProdutos
- [ ] FormulárioCriarProduto
- [ ] PáginaDetalhe
- [ ] Integração com API
- [ ] Validações

**Duração:** 3 dias

### 2.3 Módulo de Embalagens

**Backend:**

- [ ] GET /packagings
- [ ] GET /packagings/:id
- [ ] POST /packagings
- [ ] PATCH /packagings/:id (atualizar dados)
- [ ] PATCH /packagings/:id/stock (gerenciar estoque)
- [ ] Validações
- [ ] Testes

**Frontend:**

- [ ] PáginaListaEmbalagens
- [ ] FormulárioCriarEmbalagem
- [ ] Widget de gerenciamento de estoque
- [ ] Alert quando estoque < mínimo

**Duração:** 3 dias

**Estimativa Total Phase 2: 11 dias**

---

## 📋 PHASE 3: Business Logic (Semanas 5-7)

### Objetivo

Implementar pedidos e lógica de negócio complexa.

### 3.1 Módulo de Pedidos - Estrutura

**Backend:**

- [ ] GET /orders (com filtros por status, cliente, data)
- [ ] GET /orders/:id
- [ ] POST /orders (criar novo pedido)
  - Validar cliente existe
  - Validar produtos existem
  - Calcular quantidade de embalagens necessárias
  - Reservar embalagens
  - Calcular total
  - Gerar orderNumber único
- [ ] Validações
- [ ] Testes

**Frontend:**

- [ ] PáginaListaPedidos com tabela
- [ ] Componente de status colorido
- [ ] Paginação e filtros avançados
- [ ] DetailPedido com itens
- [ ] Integration com API

**Duração:** 4 dias

### 3.2 Módulo de Pedidos - Criação

**Backend:**

- [ ] POST /orders com validação completa
  - Calcular embalagens por item
  - Verificar estoque (se necessário)
  - Persistir OrderItems
- [ ] Ordem de pedidos (sequencial unique)
- [ ] Testes

**Frontend:**

- [ ] FormPedido com seleção de cliente
- [ ] Tabel dinâmica de itens
- [ ] Cálculo em tempo real de total
- [ ] Visualização de embalagens necessárias
- [ ] Validações

**Duração:** 4 dias

### 3.3 Gestão de Status de Pedidos

**Backend:**

- [ ] PATCH /orders/:id/status
  - Validar transições de status
  - Atualizar embalagens, reservadas/liberadas
  - Registrar em audit log
- [ ] PATCH /orders/:id/cancel
  - Liberar embalagens reservadas
  - Registrar razão de cancelamento
- [ ] Testes

**Frontend:**

- [ ] Componente de seleção de status
- [ ] Confirmação de mudança de status
- [ ] Histórico de status (futuro)
- [ ] Bandeira visual de status crítico

**Duração:** 3 dias

### 3.4 Cálculo de Embalagens

**Backend:**

- [ ] Service de cálculo de embalagens
- [ ] Reserva automática ao criar pedido
- [ ] Liberação ao cancelar
- [ ] Atualizar estoque de embalagem
- [ ] Alert quando estoque < mínimo
- [ ] Testes

**Duração:** 2 dias

**Estimativa Total Phase 3: 13 dias**

---

## 📊 PHASE 4: Reporting & Analytics (Semanas 8-9)

### Objetivo

Implementar dashboard e relatórios analíticos.

### 4.1 Dashboard Principal

**Frontend:**

- [ ] PáginaDashboard com layout de cards
- [ ] KPI Cards:
  - Total de vendas (mês)
  - Número de pedidos (mês)
  - Ticket médio
  - Clientes ativos
- [ ] Gráficos (Chart.js ou Recharts):
  - Vendas ao longo do tempo
  - Produtos mais vendidos
- [ ] Widget de pedidos recentes
- [ ] Widget de alerts (estoque baixo, etc)

**Backend:**

- [ ] Service de agregação de dados
- [ ] Caching de KPIs (Redis, futuro)

**Duração:** 4 dias

### 4.2 Relatório de Vendas

**Backend:**

- [ ] GET /reports/sales
  - Filtro por data
  - Groupby (day, week, month)
  - Total de vendas, pedidos, tickets, clientes

**Frontend:**

- [ ] PáginaRelatórioVendas
- [ ] Filtros de data picker
- [ ] Cards de resumo
- [ ] Tabela com dados
- [ ] Gráfico de linha
- [ ] Exportar CSV (futuro)

**Duração:** 3 dias

### 4.3 Relatório de Produtos

**Backend:**

- [ ] GET /reports/top-products
  - Top 10 produtos
  - Volume e faturamento
  - Clientes por produto

**Frontend:**

- [ ] PáginaTopProdutos
- [ ] Ranking com posição
- [ ] Gráfico de barras
- [ ] Tabela com detalhes

**Duração:** 2 dias

### 4.4 Relatório de Clientes

**Backend:**

- [ ] GET /reports/top-clients
  - Top clientes por faturamento
  - Frequência de pedidos

**Frontend:**

- [ ] PáginaTopClientes
- [ ] Ranking e detalhes

**Duração:** 2 dias

### 4.5 Relatório de Embalagens

**Backend:**

- [ ] GET /reports/packaging-analysis
  - Consumo por embalagem
  - Estoque atual vs mínimo
  - Previsão de compra

**Frontend:**

- [ ] PáginaAnáliseEmbalagens
- [ ] Cards de estoque
- [ ] Alert de reordenação

**Duração:** 2 dias

**Estimativa Total Phase 4: 13 dias**

---

## 🧪 PHASE 5: Polish, Testing & Deploy (Semana 10+)

### Objetivo

Finalizar projeto, testar, otimizar e fazer deploy.

### 5.1 Testes e QA

**Backend:**

- [ ] Testes unitários (Services)
- [ ] Testes de integração (API)
- [ ] Cobertura mínima: 80%
- [ ] Testes de validações
- [ ] Testes de edge cases

**Frontend:**

- [ ] Testes de componentes
- [ ] Testes de integração
- [ ] Testes E2E (Cypress/Playwright)
- [ ] Checklist de cross-browser
- [ ] Checklist de responsividade

**Duração:** 3 dias

### 5.2 Otimizações

**Backend:**

- [ ] Implementar indices no BD
- [ ] Analisar queries lentas
- [ ] Compressão de respostas
- [ ] Rate limiting
- [ ] Logging estruturado

**Frontend:**

- [ ] Code splitting
- [ ] Lazy loading de componentes
- [ ] Otimizar imagens
- [ ] Analisar performance (Lighthouse)
- [ ] Minificação de bundl

**Duração:** 2 dias

### 5.3 Segurança

**Backend:**

- [ ] Validar entrada em todos endpoints
- [ ] CORS configurado
- [ ] HTTPS forçado
- [ ] Senha com bcrypt
- [ ] SQL injection protection (Prisma)
- [ ] Secrets em .env

**Frontend:**

- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Secure cookies
- [ ] Dependency audit

**Duração:** 2 dias

### 5.4 Documentação

**Backend:**

- [ ] README.md com setup
- [ ] Documentação de API (Swagger, futuro)
- [ ] Jusdocstrings em funções
- [ ] Comentários em lógica complexa

**Frontend:**

- [ ] README.md com setup
- [ ] Storybook (futuro)
- [ ] JSDoc em componentes
- [ ] Guia de componentes

**Duração:** 1 dia

### 5.5 Deploy

**Infraestrutura:**

- [ ] Escolher hospedagem (AWS, Vercel, DigitalOcean, etc)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Setup de domínio
- [ ] SSL/HTTPS
- [ ] Backup automático

**Database:**

- [ ] Criar BD produção
- [ ] Executar migrações
- [ ] Backup inicial

**Deploy:**

- [ ] Build backend
- [ ] Build frontend
- [ ] Fazer deploy
- [ ] Smoke tests
- [ ] Monitoramento

**Duração:** 2 dias

**Estimativa Total Phase 5: 10 dias**

---

## 📈 Timeline Detalhada

### Semana 1 (4 dias de trabalho)

- ✅ Setup inicial
- ✅ Auth backend
- 🟡 Auth frontend (parcial)

### Semana 2 (5 dias de trabalho)

- ✅ Auth frontend (completo)
- ✅ Banco de dados
- ✅ Setup UI frontend

### Semana 3

- ✅ Módulo Clientes (backend)
- ✅ Módulo Clientes (frontend)
- ✅ Módulo Produtos (backend, parcial)

### Semana 4

- ✅ Módulo Produtos (backend + frontend)
- ✅ Módulo Embalagens (backend)
- ✅ Módulo Embalagens (frontend)

### Semana 5

- ✅ Pedidos - Estrutura
- ✅ Pedidos - Criação
- 🟡 Gestão de Status (parcial)

### Semana 6-7

- ✅ Gestão de Status (completo)
- ✅ Cálculo de Embalagens
- 🟡 Dashboard (parcial)

### Semana 8

- ✅ Dashboard (completo)
- ✅ Relatório de Vendas
- ✅ Relatório de Produtos

### Semana 9

- ✅ Relatório de Clientes
- ✅ Relatório de Embalagens
- 🟡 Testes (parcial)

### Semana 10+

- ✅ Testes (completo)
- ✅ Otimizações
- ✅ Segurança
- ✅ Deploy

---

## 👥 Alocação de Recursos

**Equipe Sugerida:** 2 desenvolvedores

**Backend Developer:**

- Implementação de APIs
- Banco de dados
- Business logic
- Testes

**Frontend Developer:**

- Interfaces de usuário
- Componentes
- Integração com APIs
- Testes

---

## 🎯 Milestones Críticos

| Milestone           | Data         | Status       |
| ------------------- | ------------ | ------------ |
| Auth funcionando    | Fim Semana 2 | ✅ Critical  |
| CRUDs básicos       | Fim Semana 4 | ✅ Critical  |
| Pedidos funcionando | Fim Semana 7 | ✅ Critical  |
| Dashboard básico    | Fim Semana 8 | 🟡 Important |
| MVP pronto          | Fim Semana 9 | ✅ Critical  |
| Deploy Prod         | Semana 10+   | 🟡 Important |

---

## 📝 Dependências e Bloqueadores

**Sem bloqueadores iniciais identificados.**

**Possíveis riscos:**

- Indisponibilidade de servidor de hospedagem
- Mudanças no escopo de requisitos
- Atraso em integrações com serviços operacionais externos

---

## 🔄 Iterações e Melhorias

### Post-MVP (Future)

**Phase 6: Evoluções Internas**

- Otimizações do fluxo interno de pedidos
- Melhorias em painéis e indicadores operacionais
- Automação de tarefas administrativas

**Phase 7: Recursos Avançados**

- Histórico de preços
- Relatórios avançados (BI tools)
- Mobile app
- Modo offline
- Integração com gateway de pagamento

**Phase 8: Automação**

- Notificações por email
- SMS/WhatsApp
- Integração com fornecedores

---

## 📊 Métricas de Sucesso

- ✅ 100% dos CRUDs implementados
- ✅ Cobertura de testes > 80%
- ✅ Performance: Dashboard carrega < 2s
- ✅ Zero erros críticos em QA
- ✅ 0 downtime após deploy
- ✅ Usuários conseguem criar pedidos sem documentação

---

## 🚀 Como Usar Este Roadmap

1. **Estimativa:** Use como base para negociar prazos
2. **Planejamento:** Divida em sprints de 1-2 semanas
3. **Comunicação:** Compartilhe com cliente e equipe
4. **Acompanhamento:** Mude status regularmente
5. **Flexibilidade:** Adapte conforme necessário

---

## 🔗 Documentos Relacionados

- [project-overview.md](project-overview.md) - Visão geral
- [business-rules.md](business-rules.md) - Regras de negócio
- [system-architecture.md](system-architecture.md) - Arquitetura
- [database-design.md](database-design.md) - BD
- [api-design.md](api-design.md) - APIs
- [ui-guidelines.md](ui-guidelines.md) - UI/UX

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Roadmap Finalizado  
**Próxima Revisão:** Após conclusão Phase 1
