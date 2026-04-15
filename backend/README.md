# Backend — Dica da Amazônia

API REST do sistema de controle interno.

## Stack

| Componente     | Tecnologia                |
|----------------|---------------------------|
| Runtime        | Node.js 18+               |
| Framework      | Express 4                 |
| Linguagem      | TypeScript 5              |
| ORM            | Prisma 5 + MySQL 8        |
| Autenticação   | JWT (jsonwebtoken)        |
| Validação      | Zod                       |
| Segurança      | helmet, express-rate-limit|
| Compressão     | compression               |
| Logging        | pino + pino-http          |
| Testes         | Vitest + Supertest        |

## Pré-requisitos

- Node.js 18+
- MySQL 8 (via Docker Compose recomendado)
- Arquivo `.env` configurado (veja `.env.example`)

## Variáveis de Ambiente

| Variável       | Descrição                              | Exemplo                                 |
|----------------|----------------------------------------|-----------------------------------------|
| `DATABASE_URL` | URL de conexão Prisma                  | `mysql://user:pass@localhost:3306/dica` |
| `JWT_SECRET`   | Segredo JWT (mínimo 32 caracteres)     | gerado com `openssl rand -hex 32`       |
| `JWT_EXPIRES_IN` | Expiração do token                   | `7d`                                    |
| `PORT`         | Porta do servidor                      | `3333`                                  |
| `NODE_ENV`     | Ambiente (`development`/`production`)  | `development`                           |

## Setup

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Seed inicial (cria usuário admin)
npm run db:seed

# Iniciar em desenvolvimento
npm run dev
```

## Scripts Disponíveis

| Script              | Descrição                                  |
|---------------------|--------------------------------------------|
| `npm run dev`       | Servidor em desenvolvimento (ts-node-dev)  |
| `npm run build`     | Compila TypeScript para `dist/`            |
| `npm start`         | Inicia servidor compilado                  |
| `npm test`          | Executa todos os testes                    |
| `npm run test:watch`| Testes em modo watch                       |
| `npm run test:coverage` | Testes com relatório de cobertura      |
| `npm run db:generate` | Regenera o Prisma Client                 |
| `npm run db:migrate`  | Executa migrações pendentes              |
| `npm run db:seed`     | Popula banco com dados iniciais          |

## Executar Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

Os testes mocam o Prisma Client — **não** precisam de banco de dados real.

### Suíte atual

| Tipo        | Arquivo                                | Casos cobertos                                              |
|-------------|----------------------------------------|-------------------------------------------------------------|
| Unit        | `authService.test.ts`                  | Login válido, senha errada, usuário inativo, anti-enum      |
| Unit        | `orderService.test.ts`                 | Criação com cliente inativo, duplicatas, quantidades, status|
| Unit        | `reportService.test.ts`                | Serialização Decimal, cálculo de avgTicket, BigInt          |
| Integration | `health.test.ts`                       | GET /health                                                 |
| Integration | `auth.test.ts`                         | POST /api/auth/login (todos os casos)                       |
| Integration | `orders.test.ts`                       | POST /api/orders, GET /api/orders, RBAC                     |

## Endpoints Principais

| Método | Rota                        | Descrição                          |
|--------|-----------------------------|------------------------------------|
| GET    | `/health`                   | Health check                       |
| POST   | `/api/auth/login`           | Autenticação                       |
| GET    | `/api/auth/me`              | Usuário atual                      |
| GET    | `/api/clients`              | Listar clientes                    |
| POST   | `/api/clients`              | Criar cliente                      |
| GET    | `/api/products`             | Listar produtos                    |
| GET    | `/api/packagings`           | Listar embalagens                  |
| GET    | `/api/orders`               | Listar pedidos                     |
| POST   | `/api/orders`               | Criar pedido                       |
| PATCH  | `/api/orders/:id/status`    | Atualizar status do pedido         |
| GET    | `/api/reports/summary`      | KPIs do dashboard                  |
| GET    | `/api/reports/sales`        | Relatório de vendas                |
| GET    | `/api/reports/top-products` | Top produtos                       |
| GET    | `/api/reports/top-clients`  | Top clientes                       |

Documentação completa em [`docs/api-design.md`](../docs/api-design.md).

## Hardening Implementado (Phase 5)

- **helmet** — headers de segurança HTTP (X-Frame-Options, CSP, etc.)
- **express-rate-limit** — 100 req/min por IP (desabilitado em testes)
- **compression** — respostas gzip/deflate
- **pino + pino-http** — logging estruturado com nível, método, rota e tempo de resposta
- **payload limit** — corpo da requisição limitado a 10kb
- **erros em produção** — stack trace nunca exposto ao cliente quando `NODE_ENV=production`

## Observações de Segurança

### Token em localStorage

O token JWT é armazenado em `localStorage` no frontend. Isso é adequado para aplicações internas com acesso restrito, mas implica:

**Riscos:**
- Vulnerável a ataques XSS — se um script malicioso for injetado, pode ler o token.

**Mitigações já implementadas:**
- React escapa valores por padrão (sem `dangerouslySetInnerHTML` no projeto)
- Helmet previne clickjacking e configura Content-Security-Policy básico
- Token expira em `JWT_EXPIRES_IN` (padrão: 7 dias)
- Interceptor Axios faz logout automático ao receber 401

**Itens fora de escopo nesta fase:**
- Migração para cookies HttpOnly + SameSite (requer mudança na arquitetura de auth)
- CSRF tokens (irrelevante enquanto não usar cookies de sessão)

### CORS

Configurado para aceitar apenas `http://localhost:5173` em desenvolvimento.
Em produção, ajuste `CORS_ORIGIN` no `.env` para o domínio real.

### SQL Injection

Prevenido pelo Prisma ORM (queries parametrizadas). As queries raw (`$queryRaw`) usam template literals que o Prisma parametriza automaticamente.
