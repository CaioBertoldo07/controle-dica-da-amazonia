# Frontend — Dica da Amazônia

SPA do sistema de controle interno.

## Stack

| Componente       | Tecnologia                    |
|------------------|-------------------------------|
| UI               | React 18                      |
| Linguagem        | TypeScript 5                  |
| Build            | Vite 5                        |
| Roteamento       | React Router DOM 6            |
| HTTP Client      | Axios                         |
| Estado Global    | Zustand                       |
| Gráficos         | Recharts                      |
| Testes           | Vitest + Testing Library      |

## Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3333` (ou configure `VITE_API_URL`)

## Variáveis de Ambiente

| Variável        | Descrição              | Padrão                        |
|-----------------|------------------------|-------------------------------|
| `VITE_API_URL`  | URL base da API        | `http://localhost:3333/api`   |

Crie um arquivo `.env` na raiz de `frontend/` com:

```env
VITE_API_URL=http://localhost:3333/api
```

## Setup

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## Scripts Disponíveis

| Script                  | Descrição                                    |
|-------------------------|----------------------------------------------|
| `npm run dev`           | Servidor de desenvolvimento (HMR)            |
| `npm run build`         | Build de produção (TypeScript + Vite)        |
| `npm run preview`       | Preview do build de produção                 |
| `npm test`              | Executa todos os testes                      |
| `npm run test:watch`    | Testes em modo watch                         |
| `npm run test:coverage` | Testes com relatório de cobertura            |
| `npm run lint`          | Lint com ESLint                              |

## Executar Testes

```bash
# Todos os testes unitários e de integração
npm test

# Com cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

Os testes usam jsdom — **não** precisam de browser real.

### Suíte atual

| Arquivo                      | Casos cobertos                                                  |
|------------------------------|------------------------------------------------------------------|
| `authStore.test.ts`          | login/logout, persistência em localStorage, estado inicial       |
| `ProtectedRoute.test.tsx`    | redirect sem auth, render com auth, controle de role             |
| `Login.test.tsx`             | render, validações de campo, erro de API, chamada de POST        |

## Estrutura de Pastas

```
src/
├── components/common/     # Componentes reutilizáveis (Layout, Sidebar, etc.)
├── config/
│   └── api.ts             # Axios instance com interceptors de JWT
├── hooks/
│   └── useAuth.ts         # Hook de autenticação
├── pages/                 # Páginas por módulo (Clients, Orders, Reports…)
├── services/              # Funções de API por módulo
├── store/
│   └── authStore.ts       # Zustand store de autenticação
├── test/
│   └── setup.ts           # Setup global de testes (jest-dom, mocks)
├── tests/                 # Arquivos de teste
└── types/index.ts         # Tipos TypeScript compartilhados
```

## Code Splitting

A partir da Phase 5, todas as páginas são carregadas com `React.lazy` + `Suspense`:

- Cada módulo (Clientes, Produtos, Embalagens, Pedidos) é um chunk separado
- O módulo de Relatórios (contém Recharts) tem seu próprio chunk
- Um fallback de carregamento é exibido enquanto o chunk carrega

Isso reduz o bundle inicial e melhora o Time-to-Interactive.

## Autenticação

O token JWT é armazenado em `localStorage` com a chave `dica_token`.

**Fluxo:**
1. Login → `POST /api/auth/login` → token salvo em localStorage
2. Axios interceptor adiciona `Authorization: Bearer <token>` em toda requisição
3. Axios interceptor faz logout automático (limpa localStorage + redireciona para `/login`) ao receber 401

**Logout automático em 401** está implementado em `src/config/api.ts`.

## Observações de Segurança

### Token em localStorage

O token fica acessível a qualquer script JavaScript rodando na página.

**Riscos:**
- XSS pode roubar o token se scripts externos forem injetados

**Mitigações:**
- React escapa conteúdo dinâmico por padrão
- O projeto não usa `dangerouslySetInnerHTML`
- O backend tem rate limiting e o token expira

**Limitação conhecida:**
- CSRF não é necessário aqui (não há cookies de sessão)
- Migração para HttpOnly cookies é um item futuro (requer mudança na arquitetura de auth do backend)

## Fora de Escopo (Phase 5)

- Testes de cross-browser (Chrome, Firefox, Safari)
- Checklist de responsividade em breakpoints móveis
- Lighthouse audit
- Storybook
