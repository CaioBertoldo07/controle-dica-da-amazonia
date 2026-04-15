# Controle Dica da Amazônia

Sistema interno de gestão para a empresa Dica da Amazônia. Permite controlar clientes, produtos, embalagens, pedidos e acompanhar relatórios de vendas.

## Visão Geral

| Camada     | Tecnologia                       |
|------------|----------------------------------|
| Frontend   | React 18 + TypeScript + Vite     |
| Backend    | Node.js + Express + TypeScript   |
| Banco      | MySQL 8 + Prisma ORM             |
| Auth       | JWT (Bearer token)               |
| Container  | Docker + Docker Compose          |

## Estrutura do Repositório

```
controle-dica-da-amazonia/
├── backend/       # API REST (Express + Prisma)
├── frontend/      # SPA (React + Vite)
├── e2e/           # Testes E2E (Playwright)
├── docs/          # Documentação técnica
└── docker-compose.yml
```

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose (para banco de dados)
- npm 9+

## Setup Local (Desenvolvimento)

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd controle-dica-da-amazonia

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# Frontend
cp frontend/.env.example frontend/.env
# Edite frontend/.env com a URL da API
```

### 3. Suba o banco de dados

```bash
docker compose up -d db
```

### 4. Execute as migrações do Prisma

```bash
cd backend
npx prisma migrate dev
npx prisma db seed   # cria usuário admin inicial
```

### 5. Inicie os servidores

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3333
- Health check: http://localhost:3333/health

## Executar Testes

```bash
# Testes unitários e integração (backend)
cd backend && npm test

# Testes com cobertura (backend)
cd backend && npm run test:coverage

# Testes unitários e integração (frontend)
cd frontend && npm test

# Testes com cobertura (frontend)
cd frontend && npm run test:coverage

# Testes E2E (requer frontend e backend rodando)
cd e2e && npm install && npm run install:browsers
cd e2e && npm test
```

## Fases Implementadas

- **Phase 1** — Foundation (Auth, Docker, Banco)
- **Phase 2** — Core Modules (Clientes, Produtos, Embalagens)
- **Phase 3** — Business Logic (Pedidos, máquina de estados)
- **Phase 4** — Reporting (Dashboard, relatórios de vendas, produtos, clientes, embalagens)
- **Phase 5** — Polish & Testing (testes, hardening, lazy loading, documentação)

## Roles de Usuário

| Role      | Permissões                                      |
|-----------|-------------------------------------------------|
| admin     | Acesso total                                    |
| gestor    | Acesso total                                    |
| vendedor  | Criar pedidos; visualizar clientes e produtos   |
| operador  | Atualizar status de pedidos; ajuste de estoque  |

## Observações de Segurança

O token JWT é armazenado em `localStorage`. Veja [`backend/README.md`](backend/README.md) para detalhes sobre riscos e mitigações.

## Documentação Adicional

- [Arquitetura do Sistema](docs/system-architecture.md)
- [Regras de Negócio](docs/business-rules.md)
- [Design de API](docs/api-design.md)
- [Roadmap de Desenvolvimento](docs/development-roadmap.md)
