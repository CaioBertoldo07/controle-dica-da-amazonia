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
Phase 3: Business Logic      ← PRÓXIMO PASSO
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

- [ ] Página ListaPedidos com tabela
- [ ] Componente de status colorido
- [ ] Paginação e filtros avançados
- [ ] Detail Pedido com itens
- [ ] Integração com API

**Duração estimada:** 4 dias

### 3.2 Módulo de Pedidos - Criação

**Backend:**

- [ ] POST /orders com validação completa
  - Calcular embalagens por item
  - Verificar estoque
  - Persistir OrderItems
- [ ] Ordem de pedidos (sequencial único)
- [ ] Testes

**Frontend:**

- [ ] Form Pedido com seleção de cliente
- [ ] Tabela dinâmica de itens
- [ ] Cálculo em tempo real de total
- [ ] Visualização de embalagens necessárias
- [ ] Validações

**Duração estimada:** 4 dias

### 3.3 Gestão de Status de Pedidos

**Backend:**

- [ ] PATCH /orders/:id/status
  - Validar transições de status
  - Atualizar embalagens reservadas/liberadas
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

**Duração estimada:** 3 dias

### 3.4 Cálculo de Embalagens

**Backend:**

- [ ] Service de cálculo de embalagens
- [ ] Reserva automática ao criar pedido
- [ ] Liberação ao cancelar
- [ ] Atualizar estoque de embalagem
- [ ] Alert quando estoque < mínimo
- [ ] Testes

**Duração estimada:** 2 dias

**Estimativa Total Phase 3: 13 dias**

---

## 📊 PHASE 4: Reporting & Analytics (Semanas 8-9)

### Objetivo

Implementar dashboard e relatórios analíticos.

### 4.1 Dashboard Principal

**Frontend:**

- [ ] Página Dashboard com layout de cards
- [ ] KPI Cards:
  - Total de vendas (mês)
  - Número de pedidos (mês)
  - Ticket médio
  - Clientes ativos
- [ ] Gráficos (Chart.js ou Recharts):
  - Vendas ao longo do tempo
  - Produtos mais vendidos
- [ ] Widget de pedidos recentes
- [ ] Widget de alertas (estoque baixo, etc)

**Backend:**

- [ ] Service de agregação de dados
- [ ] Caching de KPIs (Redis, futuro)

**Duração estimada:** 4 dias

### 4.2 Relatório de Vendas

**Backend:**

- [ ] GET /reports/sales
  - Filtro por data
  - Groupby (day, week, month)
  - Total de vendas, pedidos, tickets, clientes

**Frontend:**

- [ ] Página Relatório de Vendas
- [ ] Filtros de date picker
- [ ] Cards de resumo
- [ ] Tabela com dados
- [ ] Gráfico de linha
- [ ] Exportar CSV (futuro)

**Duração estimada:** 3 dias

### 4.3 Relatório de Produtos

**Backend:**

- [ ] GET /reports/top-products
  - Top 10 produtos
  - Volume e faturamento
  - Clientes por produto

**Frontend:**

- [ ] Página Top Produtos
- [ ] Ranking com posição
- [ ] Gráfico de barras
- [ ] Tabela com detalhes

**Duração estimada:** 2 dias

### 4.4 Relatório de Clientes

**Backend:**

- [ ] GET /reports/top-clients
  - Top clientes por faturamento
  - Frequência de pedidos

**Frontend:**

- [ ] Página Top Clientes
- [ ] Ranking e detalhes

**Duração estimada:** 2 dias

### 4.5 Relatório de Embalagens

**Backend:**

- [ ] GET /reports/packaging-analysis
  - Consumo por embalagem
  - Estoque atual vs mínimo
  - Previsão de compra

**Frontend:**

- [ ] Página Análise Embalagens
- [ ] Cards de estoque
- [ ] Alert de reordenação

**Duração estimada:** 2 dias

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

### ⏳ Semanas 5-7 — Phase 3

- [ ] Módulo Pedidos (estrutura + criação)
- [ ] Gestão de status
- [ ] Cálculo de embalagens

### ⏳ Semanas 8-9 — Phase 4

- [ ] Dashboard com KPIs e gráficos
- [ ] Relatórios (vendas, produtos, clientes, embalagens)

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
| Pedidos funcionando    | Semana 7      | ⏳ Pendente     |
| Dashboard com KPIs     | Semana 8      | ⏳ Pendente     |
| MVP pronto             | Semana 9      | ⏳ Pendente     |
| Deploy Produção        | Semana 10+    | ⏳ Pendente     |

---

## 🚀 Próximo Passo Imediato — Phase 3

Iniciar o **Módulo de Pedidos**, que é o coração do sistema com lógica de negócio complexa.

**Ordem sugerida:**

1. **Backend:** adicionar model `Order` e `OrderItem` ao schema Prisma e rodar migration
2. **Backend:** implementar `GET /orders` com filtros por status, cliente e data
3. **Backend:** implementar `POST /orders` com cálculo de embalagens e reserva de estoque
4. **Backend:** implementar `PATCH /orders/:id/status` com validação de transições
5. **Backend:** implementar `PATCH /orders/:id/cancel` com liberação de embalagens
6. **Frontend:** criar página `OrderList` com tabela e badges de status coloridos
7. **Frontend:** criar formulário `OrderForm` com seleção de cliente, itens e cálculo em tempo real

**Arquivos que serão criados:**

- `backend/src/services/orderService.ts`
- `backend/src/controllers/orderController.ts`
- `backend/src/routes/orders.ts`
- `frontend/src/services/orderApi.ts`
- `frontend/src/pages/Orders/OrderList.tsx`
- `frontend/src/pages/Orders/OrderForm.tsx`
- `frontend/src/pages/Orders/OrderDetail.tsx`

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

**Versão:** 1.3
**Atualizado em:** 14 de Abril de 2026
**Status:** Phases 1 e 2 concluídas — Phase 3 iniciando
**Próxima Revisão:** Após conclusão Phase 3
