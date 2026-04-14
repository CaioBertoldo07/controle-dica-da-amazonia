# Roadmap de Desenvolvimento - Dica da Amazônia

## 📅 Visão Geral do Roadmap

O projeto é dividido em **5 fases principais** com duração total estimada de **16 semanas** (4 meses).

```
Phase 1: Foundation          ✅ CONCLUÍDA
├─ Setup & Infraestrutura
└─ Auth & Banco de Dados
    ↓
Phase 2: Core Modules        ← PRÓXIMO PASSO
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

## 📊 PHASE 2: Core Modules (Próxima — Semanas 3-4)

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

**Duração estimada:** 5 dias

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

- [ ] Página ListaProdutos
- [ ] Formulário CriarProduto
- [ ] Página Detalhe
- [ ] Integração com API
- [ ] Validações

**Duração estimada:** 3 dias

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

- [ ] Página ListaEmbalagens
- [ ] Formulário CriarEmbalagem
- [ ] Widget de gerenciamento de estoque
- [ ] Alert quando estoque < mínimo

**Duração estimada:** 3 dias

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

### ⏳ Semanas 3-4 — Phase 2 (PRÓXIMA)

- [ ] Módulo Clientes (backend + frontend)
- [ ] Módulo Produtos (backend + frontend)
- [ ] Módulo Embalagens (backend + frontend)

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
| CRUDs básicos          | Semana 4      | ⏳ Em andamento |
| Pedidos funcionando    | Semana 7      | ⏳ Pendente     |
| Dashboard com KPIs     | Semana 8      | ⏳ Pendente     |
| MVP pronto             | Semana 9      | ⏳ Pendente     |
| Deploy Produção        | Semana 10+    | ⏳ Pendente     |

---

## 🚀 Próximo Passo Imediato — Phase 2

Iniciar o **Módulo de Clientes**, que é o primeiro CRUD completo do sistema.

**Ordem sugerida:**

1. **Backend:** criar rota `GET /clients` com paginação → testar via Postman/Insomnia
2. **Backend:** implementar `POST /clients` com validação de CNPJ e email único
3. **Backend:** implementar `PUT`, `PATCH` e `DELETE` (soft delete)
4. **Frontend:** criar página `ListaClientes` com tabela e paginação
5. **Frontend:** criar formulário `CriarCliente` com validações
6. Repetir o ciclo para Produtos e Embalagens

**Arquivos que serão criados:**

- `backend/src/controllers/clientController.ts`
- `backend/src/services/clientService.ts`
- `backend/src/routes/clientRoutes.ts`
- `frontend/src/pages/Clients/ListClients.tsx`
- `frontend/src/pages/Clients/CreateClient.tsx`

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

**Versão:** 1.1
**Atualizado em:** 14 de Abril de 2026
**Status:** Phase 1 concluída — Phase 2 iniciando
**Próxima Revisão:** Após conclusão Phase 2
