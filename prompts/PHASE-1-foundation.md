# Prompt: PHASE 1 — Foundation

> **Para Claude Code.** Leia este documento inteiramente antes de escrever qualquer código.
> Implemente todas as tasks em ordem. Ao final de cada task, confirme o que foi criado.

---

## 🗂️ Contexto do Projeto

Você está implementando o **Controle Interno — Dica da Amazônia**, um dashboard web de gestão empresarial para uma empresa de produtos alimentícios da Amazônia. O sistema é **totalmente independente** do site institucional da empresa.

**Documentação de referência (leia antes de implementar):**

- `docs/system-architecture.md` — pilha tecnológica, estrutura de pastas, Docker, segurança
- `docs/database-design.md` — schema completo de todas as entidades
- `docs/business-rules.md` — regras de negócio
- `docs/ui-guidelines.md` — paleta de cores, tipografia, layout
- `docs/development-roadmap.md` — checklist detalhado de cada phase

**Skill de UI:** Para a Task 7 (Setup de UI), leia o arquivo `.agents/skills/frontend-design/SKILL.md` antes de implementar os componentes visuais. Ele contém boas práticas para produzir interfaces de alta qualidade.

---

## 🎯 Objetivo da PHASE 1

Criar a fundação completa do projeto:

- Monorepo com `backend/` e `frontend/` na raiz
- Containers Docker para banco de dados (MySQL) e backend (Node.js)
- Schema Prisma com as 4 tabelas iniciais: `users`, `clients`, `products`, `packagings`
- API de autenticação JWT funcional
- Frontend com login, rotas protegidas e layout base

---

## 📐 Decisões Técnicas Fixadas

Não pergunte sobre estas escolhas — já foram decididas:

| Decisão                   | Escolha                                                  |
| ------------------------- | -------------------------------------------------------- |
| Validação backend         | **Zod**                                                  |
| State management frontend | **Zustand**                                              |
| HTTP client frontend      | **Axios**                                                |
| JWT estratégia MVP        | Access token com expiração 7d (sem refresh token no MVP) |
| Roles de usuário          | `admin`, `gestor`, `vendedor`, `operador`                |
| Porta backend             | `3333`                                                   |
| Porta frontend (dev)      | `5173` (padrão Vite)                                     |
| Node.js versão            | `18 LTS`                                                 |

---

## 📁 Estrutura de Arquivos a Criar

```
controle-dica-da-amazonia/
├── docker-compose.yml
├── .gitignore                        ← atualizar com backend/.env, node_modules, dist
│
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   ├── database.ts
│       │   └── env.ts
│       ├── controllers/
│       │   └── authController.ts
│       ├── services/
│       │   └── authService.ts
│       ├── routes/
│       │   ├── index.ts
│       │   └── auth.ts
│       ├── middlewares/
│       │   ├── auth.ts
│       │   ├── errorHandler.ts
│       │   └── validation.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── password.ts
│
└── frontend/
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles/
        │   ├── globals.css
        │   └── variables.css
        ├── types/
        │   └── index.ts
        ├── config/
        │   └── api.ts
        ├── store/
        │   └── authStore.ts
        ├── hooks/
        │   └── useAuth.ts
        ├── components/
        │   └── common/
        │       ├── Header.tsx
        │       ├── Sidebar.tsx
        │       └── ProtectedRoute.tsx
        └── pages/
            ├── Login.tsx
            └── Dashboard.tsx
```

---

## 🔧 TASK 1 — Setup do Backend

### 1.1 `backend/package.json`

**Dependências de produção:**

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^18.0.0",
    "prisma": "^5.0.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

### 1.2 `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.3 `backend/src/config/env.ts`

Valide todas as variáveis de ambiente no startup com Zod. Se alguma estiver faltando, lance erro e encerre o processo. Nunca use `process.env.VAR!` diretamente em outros arquivos — importe sempre de `env.ts`.

```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3333").transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
```

### 1.4 `backend/src/app.ts`

Configure o Express com:

- `express.json()` com limite `10kb` (previne payload bombing)
- `cors` permitindo apenas `http://localhost:5173` em desenvolvimento
- Rota de health check: `GET /health` → `{ status: 'ok', timestamp: new Date() }`
- Middleware de erro global no final
- **Não exponha stack traces em produção** — o errorHandler deve retornar mensagens genéricas quando `NODE_ENV === 'production'`

### 1.5 `backend/src/server.ts`

Ponto de entrada. Importe `app.ts`, escute na porta de `env.PORT`, log a porta no console.

---

## 🐳 TASK 2 — Docker

### 2.1 `docker-compose.yml`

Crie na raiz do repositório. Use como referência o arquivo documentado em `docs/system-architecture.md` (seção Docker). Pontos obrigatórios:

- Serviço `db`: MySQL 8.0, volume persistente `db_data`
- Serviço `backend`: build via `backend/Dockerfile`, `depends_on: db`
- Network isolada `app_network`
- Healthcheck no serviço `db`:
  ```yaml
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    timeout: 5s
    retries: 5
  ```
- O backend deve aguardar o healthcheck do db estar `healthy` antes de iniciar (`condition: service_healthy`)

### 2.2 `backend/Dockerfile`

Use **multi-stage build** para separar build de produção:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3333
CMD ["node", "dist/server.js"]
```

### 2.3 `backend/.env.example`

```env
# Banco de Dados
DATABASE_URL="mysql://app_user:changeme@db:3306/dica_amazonia"

# Docker MySQL
DB_NAME=dica_amazonia
DB_USER=app_user
DB_PASSWORD=changeme
DB_ROOT_PASSWORD=rootchangeme

# Backend
PORT=3333
NODE_ENV=development

# JWT — use pelo menos 32 caracteres aleatórios
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_SECRET_WITH_AT_LEAST_32_CHARS
JWT_EXPIRES_IN=7d
```

---

## 🗄️ TASK 3 — Schema Prisma

### 3.1 `backend/prisma/schema.prisma`

Crie o schema com as **4 tabelas iniciais da Phase 1**. Use os campos exatos de `docs/database-design.md`. Pontos obrigatórios:

**Provider:** MySQL com `DATABASE_URL` de `env`

**Tabela `users`** (nova, não está no design original — adicionar):

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  name      String   @db.VarChar(100)
  role      Role     @default(vendedor)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  admin
  gestor
  vendedor
  operador
}
```

**Tabelas `clients`, `products`, `packagings`:** Implemente conforme `docs/database-design.md` incluindo:

- Tipos corretos (`@db.VarChar`, `@db.Decimal`, etc.)
- Índices documentados via `@@index` e `@@unique`
- Enums: `ClientType` (B2B, B2C), `PackagingType` (PADRAO, ESPECIAL)
- Relacionamento `Packaging → Product` (1:N)

**Não crie** as tabelas `orders` e `order_items` nesta phase — serão feitas na Phase 3.

### 3.2 `backend/prisma/seed.ts`

Crie um seed para dados iniciais:

- 1 usuário admin: `admin@dicadaamazonia.com.br` / senha `Admin@2024` (hash bcrypt, saltRounds=12)
- 2 embalagens: `Embalagem Padrão` (PADRAO) e `Embalagem Especial Rende+` (ESPECIAL)
- 4 produtos conforme `docs/business-rules.md` seção 3:
  - Café de Açaí (CAF-001) → Embalagem Padrão
  - Café de Açaí + Café Tradicional (CAF-002) → Embalagem Padrão
  - Café de Milho (CAF-003) → Embalagem Padrão
  - Rende+ (REN-001) → Embalagem Especial

---

## 🔐 TASK 4 — Autenticação (Backend)

### 4.1 `backend/src/types/index.ts`

Declare os tipos globais:

```typescript
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
```

### 4.2 `backend/src/utils/password.ts`

Funções para hash e compare de senha usando `bcryptjs` com `saltRounds = 12`.

### 4.3 `backend/src/services/authService.ts`

`login(email, password)`:

1. Busca usuário por email no banco via Prisma
2. Se não encontrar: **não diferencie** entre "usuário não existe" e "senha errada" — retorne sempre o mesmo erro genérico `"Credenciais inválidas"` (previne user enumeration)
3. Compara senha com `bcryptjs.compare`
4. Se `isActive === false`, retorne `"Usuário inativo"`
5. Gera JWT com payload `{ sub: user.id, email, role }` e assina com `env.JWT_SECRET`
6. Retorna `{ token, user: { id, name, email, role } }` — **nunca retorne o campo `password`**

### 4.4 `backend/src/middlewares/auth.ts`

Middleware `authenticate`:

1. Lê o header `Authorization: Bearer <token>`
2. Verifica o token com `jsonwebtoken.verify`
3. Injeta o payload em `req.user`
4. Em caso de token inválido/expirado: retorne `401` com mensagem genérica
5. **Nunca exponha o motivo exato** do erro JWT em produção

Middleware `authorize(...roles: Role[])`:

1. Verifica se `req.user.role` está na lista de roles permitidas
2. Retorna `403` se não autorizado

### 4.5 `backend/src/controllers/authController.ts`

`POST /auth/login`:

- Schema Zod: `{ email: z.string().email(), password: z.string().min(6) }`
- Delega para `authService.login`
- Retorna `200` com `{ token, user }` ou `401`

`GET /auth/me` (rota protegida — requer `authenticate`):

- Retorna dados do usuário logado a partir de `req.user`
- Faz nova consulta ao banco para pegar dados atualizados (não confie apenas no token)

### 4.6 `backend/src/routes/auth.ts` e `backend/src/routes/index.ts`

Monte as rotas com prefixo `/api`:

- `POST /api/auth/login`
- `GET /api/auth/me` (protegido)
- `GET /health` (sem prefixo /api)

### 4.7 `backend/src/middlewares/errorHandler.ts`

Handler global que captura todos os erros não tratados:

- Loga o erro completo no console (somente servidor)
- Em produção: retorna `{ error: "Erro interno do servidor" }` + status 500
- Em desenvolvimento: retorna `{ error: message, stack }` + status correto
- Trate `ZodError` retornando `422` com lista de campos inválidos

---

## 🖥️ TASK 5 — Setup do Frontend

### 5.1 Inicialização

```bash
npm create vite@latest frontend -- --template react-ts
```

**Dependências a instalar:**

```bash
npm install axios react-router-dom zustand
npm install -D @types/node
```

### 5.2 `frontend/.env.example`

```env
VITE_API_URL=http://localhost:3333/api
```

### 5.3 `frontend/src/config/api.ts`

Configure uma instância Axios com:

- `baseURL` de `import.meta.env.VITE_API_URL`
- Interceptor de request: injeta `Authorization: Bearer <token>` se existir token no store
- Interceptor de response: em caso de `401`, limpa o store de auth e redireciona para `/login`
- Timeout de `10000ms`

---

## 🔑 TASK 6 — Autenticação (Frontend)

### 6.1 `frontend/src/store/authStore.ts`

Store Zustand com:

```typescript
interface AuthState {
  token: string | null;
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthState["user"]) => void;
  logout: () => void;
}
```

- Persista o token no `localStorage` (key: `dica_token`)
- Na inicialização do store, verifique se existe token no localStorage e carregue o estado
- `logout()`: limpa localStorage e reseta o state

### 6.2 `frontend/src/hooks/useAuth.ts`

Hook que expõe o store e adiciona:

- `loginRequest(email, password)`: chama `POST /auth/login`, salva no store em caso de sucesso, retorna o erro em caso de falha
- `logoutAndRedirect()`: chama `store.logout()` e navega para `/login`

### 6.3 `frontend/src/components/common/ProtectedRoute.tsx`

Componente wrapper para rotas autenticadas:

- Se `!isAuthenticated`, redireciona para `/login` com `<Navigate>`
- Se precisar de role específica, aceite prop `allowedRoles: string[]` e redirecione para `/403` se role não permitida

### 6.4 `frontend/src/pages/Login.tsx`

Página de login com:

- Formulário: campo `email` e `password`
- Validação de formulário no cliente (email válido, senha ≥ 6 chars)
- Feedback de erro da API (mensagem amigável)
- Submit chama `useAuth().loginRequest` → em sucesso, navega para `/`
- Loading state no botão durante a requisição

**Importante:** Leia `.agents/skills/frontend-design/SKILL.md` antes de implementar esta e a Task 7. O design deve seguir a paleta de `docs/ui-guidelines.md`.

### 6.5 `frontend/src/App.tsx`

Configure o `BrowserRouter` com as rotas:

```
/login          → <Login />        (pública)
/               → <Dashboard />    (protegida)
/*              → redireciona para /
```

---

## 🎨 TASK 7 — Setup de UI e Layout Base

> **Leia `.agents/skills/frontend-design/SKILL.md` antes de implementar esta task.**

### 7.1 `frontend/src/styles/variables.css`

Defina as CSS custom properties com base exata em `docs/ui-guidelines.md`:

```css
:root {
  /* Cores Primárias */
  --color-primary: #4a7a1e;
  --color-primary-light: #bace3c;
  --color-accent: #d4a800;

  /* Fundo e Superfícies */
  --color-bg: #f4f6f2;
  --color-surface: #ffffff;
  --color-divider: #e8ebdf;

  /* Texto */
  --color-text-primary: #1f2d1a;
  --color-text-secondary: #6b7a6e;
  --color-text-on-primary: #ffffff;

  /* Status */
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #ed3237;
  --color-info: #2196f3;
  --color-pending: #ffc107;

  /* Spacing (base 8px) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Sidebar */
  --sidebar-width: 240px;
  --header-height: 64px;
}
```

### 7.2 `frontend/src/styles/globals.css`

- Importe a fonte Open Sans do Google Fonts
- Reset CSS básico (`box-sizing: border-box`, `margin: 0`, `padding: 0`)
- `body`: aplique `--color-bg`, `--color-text-primary`, font-family Open Sans
- Defina classes utilitárias básicas para os status badges (`.badge--success`, `.badge--error`, etc.)

### 7.3 `frontend/src/components/common/Header.tsx`

Barra superior com:

- Logo/nome da empresa à esquerda
- Nome do usuário logado + botão de logout à direita
- `height: var(--header-height)`
- Background: `var(--color-primary)`

### 7.4 `frontend/src/components/common/Sidebar.tsx`

Menu lateral com:

- `width: var(--sidebar-width)`
- Background: `var(--color-primary)` levemente mais escuro
- Links de navegação (por ora só Dashboard ativo, demais desabilitados):
  - Dashboard
  - Clientes (desabilitado)
  - Produtos (desabilitado)
  - Embalagens (desabilitado)
  - Pedidos (desabilitado)
  - Relatórios (desabilitado)
- Indicador visual no item ativo

### 7.5 `frontend/src/pages/Dashboard.tsx`

Página placeholder com:

- Layout usando `Header` + `Sidebar` + área de conteúdo
- Card central com mensagem de boas-vindas: `"Sistema em implementação — Phase 1 concluída"`
- Exibe o nome e role do usuário logado

---

## ✅ Critérios de Conclusão

Ao finalizar, confirme cada item:

**Backend:**

- [ ] `npm run dev` inicia sem erros
- [ ] `GET /health` retorna `200`
- [ ] `POST /api/auth/login` com credenciais válidas retorna token JWT
- [ ] `POST /api/auth/login` com credenciais inválidas retorna `401` com mensagem genérica
- [ ] `GET /api/auth/me` sem token retorna `401`
- [ ] `GET /api/auth/me` com token válido retorna dados do usuário

**Docker:**

- [ ] `docker compose up -d` sobe `db` e `backend` sem erros
- [ ] `docker compose exec backend npx prisma migrate deploy` executa com sucesso
- [ ] `docker compose exec backend npm run db:seed` popula o banco

**Banco de Dados:**

- [ ] Migrations criadas em `backend/prisma/migrations/`
- [ ] Tabelas `users`, `clients`, `products`, `packagings` existem no MySQL
- [ ] Seed cria os 4 produtos, 2 embalagens e 1 usuário admin

**Frontend:**

- [ ] `npm run dev` inicia sem erros de TypeScript
- [ ] Acessar `localhost:5173` redireciona para `/login`
- [ ] Login com `admin@dicadaamazonia.com.br` / `Admin@2024` redireciona para `/`
- [ ] Dashboard exibe Header, Sidebar e card de boas-vindas
- [ ] Botão de logout limpa a sessão e retorna para `/login`

---

## 🔒 Restrições de Segurança (OWASP Top 10)

1. **Nunca** armazene a senha em texto simples — sempre bcrypt
2. **Nunca** diferencie "usuário não existe" de "senha errada" na resposta da API
3. **Nunca** exponha stack trace em produção
4. **Nunca** retorne o campo `password` em qualquer resposta
5. CORS: somente `localhost:5173` em desenvolvimento
6. Content-Type: force `application/json` em todas as respostas da API
7. JWT secret mínimo de 32 caracteres aleatórios
8. Rate limiting não é necessário no MVP, mas **não implemente** nenhum endpoint sem autenticação exceto `/health` e `/api/auth/login`
