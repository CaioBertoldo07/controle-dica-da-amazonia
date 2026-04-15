# Roadmap de Desenvolvimento - Dica da Amazônia

## 📅 Visão Geral do Roadmap

O projeto é dividido em **5 fases principais** com duração total estimada de **16 semanas** (4 meses).

```
Phase 1: Foundation          ✅ CONCLUÍDA
├─ Setup & Infraestrutura
└─ Auth & Banco de Dados
    ↓
Phase 2: Core Modules        ✅ CONCLUÍDA
├─ CRUD Clientes
├─ CRUD Produtos
└─ CRUD Embalagens
    ↓
Phase 3: Business Logic      ✅ CONCLUÍDA
├─ CRUD Pedidos
├─ Cálculo de Embalagens
└─ Status de Pedidos
    ↓
Phase 4: Reporting           ✅ CONCLUÍDA
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

## ✅ PHASE 1: Foundation — CONCLUÍDA (Abril 2026)

### Objetivo

Preparar infraestrutura básica, autenticação e banco de dados.

### 1.1 Setup Inicial do Projeto

**Backend:**

- [x] Criar repositório GitHub
- [x] Inicializar projeto Node.js + TypeScript
- [x] Configurar package.json com dependências
- [x] Setup Express.js
- [x] Configurar ESLint + Prettier
- [x] Criar arquivo .env.example
- [x] Configurar nodemon para desenvolvimento

**Frontend:**

- [x] Inicializar projeto Vite + React + TypeScript
- [x] Instalar dependências (React Router, Axios, Zustand)
- [x] Configurar ESLint + Prettier
- [x] Setup de estrutura de pastas
- [x] Criar arquivo .env.example

### 1.2 Docker

**Configuração dos Containers:**

- [x] Criar `docker-compose.yml` (serviços: `db` + `backend`)
- [x] Criar `backend/Dockerfile`
- [x] Criar `backend/.env.example` com variáveis do container
- [x] Subir container MySQL e validar conexão
- [x] Configurar volume persistente para os dados do banco

### 1.3 Banco de Dados

**MySQL Setup (via Docker):**

- [x] Validar conexão Prisma → container `db`
- [x] Configurar Prisma
- [x] Criar arquivo prisma/schema.prisma base
- [x] Gerar client Prisma

**Schema Inicial:**

- [x] Tabela User (autenticação e perfis)
- [x] Tabela Client
- [x] Tabela Product
- [x] Tabela Packaging
- [x] Tabela Order + OrderItem
- [x] Seed inicial (usuário admin)

### 1.4 Autenticação

**Backend:**

- [x] Implementar controller de login
- [x] Setup JWT (access token + refresh token)
- [x] Middleware de autenticação
- [x] Validação de credentials (bcrypt)
- [x] Endpoint POST /auth/login
- [x] Endpoint POST /auth/refresh
- [x] Controle de roles (admin, gestor, vendedor, operador)

**Frontend:**

- [x] Criar página de Login
- [x] Implementar store de autenticação (Zustand)
- [x] Salvar token no localStorage
- [x] Criar hook useAuth
- [x] Implementar ProtectedRoute
- [x] Redirecionamento automático após login/logout

### 1.5 Setup Inicial de UI

**Frontend:**

- [x] Importar tipografia Open Sans (Google Fonts)
- [x] Configurar CSS variables (cores, spacing, radius, shadows)
- [x] Criar tema global (`globals.css` + `variables.css`)
- [x] Layout principal (Header + Sidebar + área de conteúdo)
- [x] Componentes base (classes `.btn`, `.form-input`, `.badge`)
- [x] Dashboard com card de boas-vindas e informações do usuário
- [x] Identidade visual aplicada com base nos designs da pasta `/design`:
  - Paleta verde floresta + creme amazônico
  - Header e Sidebar em verde escuro (`#253d22`)
  - Fundo creme (`#f0ece3`)
  - Tipografia hierárquica em marrom escuro
  - Botões, inputs e badges com novo tema

---

## ✅ PHASE 2: Core Modules — CONCLUÍDA (Abril 2026)

### Objetivo

Implementar CRUDs básicos para as 3 entidades principais.

### 2.0 Componentes e Infraestrutura de UI

**Frontend — componentes compartilhados criados:**

- [x] `AppLayout` — wrapper de layout (Header + Sidebar + main) reutilizado por todas as páginas
- [x] `PageHeader` — título, descrição e botão de ação por página
- [x] `Pagination` — paginação com elipses e contador "X–Y de Z registros"
- [x] `ConfirmModal` — modal de confirmação para ações destrutivas
- [x] Classes CSS de botão: `.btn--sm`, `.btn--danger`, `.btn--success-outline`, `.btn--warning-outline`
- [x] Hover preenchido em todos os botões de tabela (Editar, Desativar, + Entrada, − Saída)

### 2.1 Módulo de Clientes

**Backend:**

- [x] GET /clients (listar com paginação, filtros por tipo, status e busca)
- [x] GET /clients/:id
- [x] POST /clients (criar com validação de CNPJ e email únicos)
- [x] PUT /clients/:id (atualizar completo)
- [x] PATCH /clients/:id (atualizar parcial)
- [x] DELETE /clients/:id (soft delete — seta `isActive: false`)
- [x] Validações via Zod (CNPJ, email, UF, campos obrigatórios)
- [x] Controle de acesso: leitura para todos, escrita apenas `admin`/`gestor`

**Frontend:**

- [x] Página `ClientList` com tabela, filtros (busca, tipo B2B/B2C, status) e paginação
- [x] Formulário `ClientForm` (criar e editar) dividido em seções: Empresa, Contato, Endereço, Observações
- [x] Select de UF com todos os 27 estados brasileiros
- [x] Integração completa com API (`clientApi.ts`)
- [x] Validações de formulário no frontend
- [x] Banner de erro de API (CNPJ/email duplicados, etc.)
- [x] Modal de confirmação para desativar cliente

### 2.2 Módulo de Produtos

**Backend:**

- [x] GET /products (com paginação, filtros por status e busca por nome/código)
- [x] GET /products/:id (inclui dados da embalagem associada)
- [x] POST /products (valida nome e código únicos, verifica embalagem existente)
- [x] PUT /products/:id
- [x] PATCH /products/:id
- [x] DELETE /products/:id (soft delete)
- [x] Conversão de `Decimal → number` antes de serializar resposta
- [x] Controle de acesso por role

**Frontend:**

- [x] Página `ProductList` com alerta visual de estoque zerado
- [x] Formulário `ProductForm` com select de embalagens carregado da API
- [x] Exibição de preço formatado (`R$ X.XX`)
- [x] Integração completa com API (`productApi.ts`)
- [x] Validações de formulário no frontend

### 2.3 Módulo de Embalagens

**Backend:**

- [x] GET /packagings (com paginação e busca)
- [x] GET /packagings/:id
- [x] POST /packagings
- [x] PUT /packagings/:id
- [x] PATCH /packagings/:id (atualizar dados)
- [x] PATCH /packagings/:id/stock (entrada/saída de estoque com validação de insuficiência)
- [x] Conversão de `Decimal → number` via generic type-safe serialize
- [x] Acesso a `/stock` estendido para role `operador`

**Frontend:**

- [x] Página `PackagingList` com alerta visual "⚠ baixo" quando `currentStock ≤ minimumStock`
- [x] Botões "+ Entrada" e "− Saída" com modal inline de ajuste de estoque
- [x] Formulário `PackagingForm` com seções: Dados, Estoque e Fornecedor
- [x] Integração completa com API (`packagingApi.ts`)
- [x] `fetchPackagingsAll()` para carregar embalagens no formulário de produtos

**Duração real:** 1 sessão

**Estimativa Total Phase 2: concluída**

---

## ✅ PHASE 3: Business Logic — CONCLUÍDA (Abril 2026)

### Objetivo

Implementar pedidos e lógica de negócio complexa.

### 3.1 Módulo de Pedidos — Backend

- [x] Enum `OrderStatus` no schema Prisma: PENDENTE, PROCESSANDO, PRODUCAO, PREPARADO, ENVIADO, ENTREGUE, CANCELADO
- [x] Models `Order` e `OrderItem` adicionados ao Prisma + relações com `Client` e `Product`
- [x] `GET /orders` — listagem paginada com filtros por status, clientId e busca (nº pedido / cliente)
- [x] `GET /orders/:id` — detalhe completo com client e items (incluindo produto e embalagem)
- [x] `POST /orders` — criação com validações: max 3 itens, 1–10.000 unidades/item, sem produtos duplicados, cliente ativo, produtos ativos; captura `unitPrice` do produto no momento da criação; calcula subtotals e total; gera `orderNumber` sequencial no formato `PED-YYYY-NNNN`
- [x] `PATCH /orders/:id/status` — máquina de estados com validação de transições; reserva estoque de embalagem ao avançar para PROCESSANDO; libera estoque ao cancelar se estava em PROCESSANDO/PRODUCAO/PREPARADO/ENVIADO; exige `cancelReason` ao cancelar de PRODUCAO em diante
- [x] Controle de acesso: criação permitida para admin/gestor/vendedor; troca de status para admin/gestor/operador
- [x] `orderService.ts`, `orderController.ts`, `routes/orders.ts` criados; `routes/index.ts` atualizado
- [x] Banco sincronizado com `prisma db push` no container

### 3.2 Módulo de Pedidos — Frontend

- [x] Tipos `OrderStatus`, `Order`, `OrderItem`, `CreateOrderInput` adicionados a `types/index.ts`
- [x] `fetchClientsAll()` adicionado a `clientApi.ts` (busca todos os clientes ativos)
- [x] `fetchProductsAll()` adicionado a `productApi.ts` (busca todos os produtos ativos)
- [x] `orderApi.ts` criado: `fetchOrders`, `fetchOrder`, `createOrder`, `updateOrderStatus`
- [x] Badges de status no `globals.css`: `.badge--processando`, `.badge--producao`, `.badge--preparado`, `.badge--enviado`, `.badge--entregue`, `.badge--cancelado`
- [x] Página `OrderList` — tabela com nº pedido, cliente, itens, total, badge de status colorido e data; filtros por busca e status; paginação
- [x] Página `OrderForm` — selects dinâmicos de cliente e produto (ativos apenas); até 3 linhas de produto; subtotal em tempo real por linha; total calculado ao vivo; validações client-side; redireciona para detalhe após criação
- [x] Página `OrderDetail` — layout de 2 colunas (tabela de itens + sidebar de info); botão de avançar status com label contextual; botão de cancelar com modal; aviso de reserva de estoque ao avançar para PROCESSANDO; exibição de motivo de cancelamento; `cancelReason` obrigatório ao cancelar de PRODUCAO em diante
- [x] `App.tsx` atualizado com rotas `/pedidos`, `/pedidos/novo`, `/pedidos/:id`
- [x] `Sidebar.tsx` — Pedidos habilitado (removido `disabled: true`); footer atualizado para "Phase 3 — Orders"
- [x] `tsconfig.json` corrigido com `"types": ["vite/client"]` (resolve erro pré-existente de `import.meta.env`)

**Duração real:** 1 sessão

---

## ✅ PHASE 4: Reporting & Analytics — CONCLUÍDA (Abril 2026)

### Objetivo

Implementar dashboard e relatórios analíticos.

### 4.1 Dashboard Principal

**Frontend:**

- [x] Página Dashboard redesenhada com layout de cards
- [x] KPI Cards:
  - Faturamento do mês (excluindo cancelados)
  - Ticket médio do mês
  - Clientes ativos
  - Produtos ativos
- [x] Gráfico de linha (Recharts): Faturamento nos últimos 7 dias
- [x] Widget de pedidos recentes (últimos 5, clicáveis)
- [x] Widget de status: contador de pedidos por status
- [x] Banner de alerta de estoque baixo (clicável, redireciona para análise)

**Backend:**

- [x] `GET /reports/summary` — KPIs do mês atual + totais + pedidos por status + alertas de estoque + pedidos recentes

**Duração real:** 1 sessão

### 4.2 Relatório de Vendas

**Backend:**

- [x] `GET /reports/sales`
  - Filtro por data (startDate, endDate)
  - groupBy: day | week | month
  - Retorna: period, orders, revenue

**Frontend:**

- [x] Página Relatório de Vendas (tab "Vendas" em `/relatorios`)
- [x] Filtros de date picker (input type="date")
- [x] Cards de resumo: Faturamento Total, Total de Pedidos, Ticket Médio
- [x] Gráfico de linha: Faturamento ao longo do tempo (com eixo duplo para pedidos)
- [x] Gráfico de barras: Volume de pedidos
- [x] Tabela com dados por período

### 4.3 Relatório de Produtos

**Backend:**

- [x] `GET /reports/top-products`
  - Top N produtos (padrão 10, max 50)
  - Volume vendido e faturamento
  - Número de pedidos distintos

**Frontend:**

- [x] Página Top Produtos (tab "Produtos")
- [x] Gráfico de barras horizontal com gradiente de verde
- [x] Tabela com ranking, código, qtd vendida, pedidos e faturamento

### 4.4 Relatório de Clientes

**Backend:**

- [x] `GET /reports/top-clients`
  - Top N clientes (padrão 10, max 50)
  - Frequência de pedidos e faturamento

**Frontend:**

- [x] Página Top Clientes (tab "Clientes")
- [x] Tabela com ranking, razão social, pedidos, faturamento, % do total
- [x] Barra de participação visual por cliente

### 4.5 Relatório de Embalagens

**Backend:**

- [x] `GET /reports/packaging-analysis`
  - Estoque atual vs mínimo
  - Consumo nos últimos 30 dias (via pedidos processados)
  - Flag `needsReorder`

**Frontend:**

- [x] Página Análise de Embalagens (tab "Embalagens")
- [x] Cards de resumo: total, precisam reposição, adequado
- [x] Banner de alerta com lista de embalagens críticas
- [x] Tabela com nível de estoque (barra visual), consumo e status

### Dependências adicionadas

- [x] `recharts@3.8.1` instalado no frontend

### Arquivos criados

**Backend:**
- `backend/src/services/reportService.ts`
- `backend/src/controllers/reportController.ts`
- `backend/src/routes/reports.ts`
- `backend/src/routes/index.ts` — `reportsRouter` adicionado

**Frontend:**
- `frontend/src/services/reportApi.ts`
- `frontend/src/pages/Reports/ReportsPage.tsx` — hub com 4 tabs
- `frontend/src/pages/Reports/ReportSales.tsx`
- `frontend/src/pages/Reports/ReportProducts.tsx`
- `frontend/src/pages/Reports/ReportClients.tsx`
- `frontend/src/pages/Reports/ReportPackaging.tsx`
- `frontend/src/types/index.ts` — tipos de relatório adicionados
- `frontend/src/App.tsx` — rota `/relatorios`
- `frontend/src/components/common/Sidebar.tsx` — Relatórios habilitado
- `frontend/src/pages/Dashboard.tsx` — redesign completo com KPIs

**Duração real:** 1 sessão

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
- [ ] Testes E2E (Playwright)
- [ ] Checklist de cross-browser
- [ ] Checklist de responsividade

**Duração estimada:** 3 dias

### 5.2 Otimizações

**Backend:**

- [ ] Implementar índices no BD
- [ ] Analisar queries lentas
- [ ] Compressão de respostas
- [ ] Rate limiting
- [ ] Logging estruturado

**Frontend:**

- [ ] Code splitting
- [ ] Lazy loading de componentes
- [ ] Otimizar imagens
- [ ] Analisar performance (Lighthouse)
- [ ] Minificação de bundle

**Duração estimada:** 2 dias

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

**Duração estimada:** 2 dias

### 5.4 Documentação

**Backend:**

- [ ] README.md com setup
- [ ] Documentação de API (Swagger, futuro)
- [ ] Docstrings em funções
- [ ] Comentários em lógica complexa

**Frontend:**

- [ ] README.md com setup
- [ ] Storybook (futuro)
- [ ] JSDoc em componentes
- [ ] Guia de componentes

**Duração estimada:** 1 dia

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

**Duração estimada:** 2 dias

**Estimativa Total Phase 5: 10 dias**

---

## 📈 Timeline Real

### ✅ Semanas 1-2 — Phase 1 (CONCLUÍDA — Abril 2026)

- ✅ Setup inicial (repositório, Node.js, Vite, TypeScript)
- ✅ Docker + MySQL via container
- ✅ Schema Prisma completo (User, Client, Product, Packaging, Order, OrderItem)
- ✅ Auth backend (JWT, bcrypt, refresh token, roles)
- ✅ Auth frontend (Login, useAuth, Zustand store, ProtectedRoute)
- ✅ Layout base (Header, Sidebar, Dashboard)
- ✅ Sistema de design (CSS variables, globals, componentes base)
- ✅ Identidade visual aplicada (tema verde floresta amazônico)

### ✅ Semanas 3-4 — Phase 2 (CONCLUÍDA — Abril 2026)

- ✅ Componentes compartilhados de UI (AppLayout, PageHeader, Pagination, ConfirmModal)
- ✅ Sistema de classes de botão para tabelas (`.btn--sm`, `.btn--danger`, `.btn--success-outline`, `.btn--warning-outline`) com hover preenchido
- ✅ Módulo Clientes — backend (CRUD + soft delete + validações Zod) + frontend (lista com filtros, formulário por seções, modal de confirmação)
- ✅ Módulo Produtos — backend (CRUD + relação com embalagem + serialização Decimal) + frontend (lista com alerta de estoque, formulário com select dinâmico)
- ✅ Módulo Embalagens — backend (CRUD + ajuste de estoque com validação) + frontend (lista com alerta de estoque baixo, modal de entrada/saída, formulário em seções)
- ✅ API services tipados no frontend (clientApi, productApi, packagingApi)
- ✅ 9 rotas novas no App.tsx (list + create + edit para cada módulo)
- ✅ Sidebar habilitada para Clientes, Produtos e Embalagens

### ✅ Semanas 5-7 — Phase 3 (CONCLUÍDA — Abril 2026)

- ✅ Módulo Pedidos backend: schema Order + OrderItem, service, controller, rotas
- ✅ Máquina de estados completa com reserva/liberação de estoque de embalagens
- ✅ Módulo Pedidos frontend: OrderList, OrderForm, OrderDetail com modal de status
- ✅ Badges visuais por status; cálculo de total em tempo real no formulário
- ✅ Build frontend corrigido (tsconfig + vite/client types)

### ✅ Semanas 8-9 — Phase 4 (CONCLUÍDA — Abril 2026)

- ✅ Dashboard redesenhado com KPIs do mês, gráfico de vendas, pedidos recentes e status overview
- ✅ Backend: 5 endpoints de relatório (`/reports/summary`, `/sales`, `/top-products`, `/top-clients`, `/packaging-analysis`)
- ✅ Página `/relatorios` com 4 tabs: Vendas (linha+barra+tabela), Produtos (barras horizontal+ranking), Clientes (ranking+participação), Embalagens (análise de estoque)
- ✅ Recharts instalado; filtros de período nativos; todos os componentes com estados de loading/empty

### ⏳ Semana 10+ — Phase 5

- [ ] Testes e QA
- [ ] Otimizações e segurança
- [ ] Deploy em produção

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

| Milestone              | Data prevista | Status          |
| ---------------------- | ------------- | --------------- |
| Auth funcionando       | Semana 2      | ✅ Concluído    |
| Identidade visual      | Abril 2026    | ✅ Concluído    |
| CRUDs básicos          | Semana 4      | ✅ Concluído    |
| Pedidos funcionando    | Semana 7      | ✅ Concluído    |
| Dashboard com KPIs     | Semana 8      | ✅ Concluído    |
| MVP pronto             | Semana 9      | ✅ Concluído    |
| Deploy Produção        | Semana 10+    | ⏳ Pendente     |

---

## 🚀 Próximo Passo Imediato — Phase 5: Polish, Testing & Deploy

Finalizar, testar, otimizar e fazer deploy do sistema.

**Ordem sugerida:**

1. **Correção pendente:** rodar `prisma generate` no container para resolver erros de tipo do Prisma Client
2. **Testes:** implementar testes unitários nos Services e testes de integração nas APIs
3. **Segurança:** revisar CORS, rate limiting, validação de inputs
4. **Deploy:** configurar CI/CD e infraestrutura de produção

---

## 📝 Dependências e Bloqueadores

**Sem bloqueadores ativos.**

**Possíveis riscos:**

- Indisponibilidade de servidor de hospedagem
- Mudanças no escopo de requisitos
- Atraso em integrações com serviços externos

---

## 🔄 Iterações e Melhorias

### Post-MVP (Futuro)

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

- ✅ Phase 1 concluída — Auth + infraestrutura + identidade visual
- [ ] 100% dos CRUDs implementados
- [ ] Cobertura de testes > 80%
- [ ] Performance: Dashboard carrega < 2s
- [ ] Zero erros críticos em QA
- [ ] 0 downtime após deploy
- [ ] Usuários conseguem criar pedidos sem documentação

---

## 🔗 Documentos Relacionados

- [project-overview.md](project-overview.md) - Visão geral
- [business-rules.md](business-rules.md) - Regras de negócio
- [system-architecture.md](system-architecture.md) - Arquitetura
- [database-design.md](database-design.md) - BD
- [api-design.md](api-design.md) - APIs
- [ui-guidelines.md](ui-guidelines.md) - UI/UX

---

**Versão:** 1.5
**Atualizado em:** 14 de Abril de 2026
**Status:** Phases 1, 2, 3 e 4 concluídas — Phase 5 próxima
**Próxima Revisão:** Após conclusão Phase 5
