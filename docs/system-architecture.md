# Arquitetura do Sistema - Dica da Amazônia

## 🏗️ Visão Geral da Arquitetura

O sistema segue uma arquitetura **cliente-servidor** em três camadas:

```
┌─────────────────────────────────────────────────────┐
│          Frontend (React + TypeScript + Vite)       │
│              Dashboard Web Responsivo               │
└────────────────────────┬────────────────────────────┘
                         │ HTTP/HTTPS (REST API)
                         │
┌────────────────────────▼────────────────────────────┐
│      Backend (Node.js + TypeScript + Express)       │
│  Controllers → Services → Routes → Middlewares      │
└────────────────────────┬────────────────────────────┘
                         │ SQL
                         │
┌────────────────────────▼────────────────────────────┐
│    Banco de Dados (MySQL + Prisma ORM)             │
│          Persistência de Dados                      │
└─────────────────────────────────────────────────────┘
```

## Escopo e Independência

Este sistema é um **dashboard interno de gestão empresarial**, desenvolvido exclusivamente para uso interno da empresa.

Ele possui:

- backend próprio
- banco de dados próprio
- API própria

O sistema **não possui integração com o site institucional da empresa**, não consome APIs do site e não depende dele para funcionamento.

O site público da empresa é utilizado **apenas como referência de identidade visual (cores e estilo da marca)**.

## 💻 Pilha Tecnológica

### Backend

| Componente     | Tecnologia   | Versão   |
| -------------- | ------------ | -------- |
| Runtime        | Node.js      | 18+ LTS  |
| Linguagem      | TypeScript   | 5.0+     |
| Servidor Web   | Express.js   | 4.18+    |
| ORM            | Prisma       | 5.0+     |
| Banco de Dados | MySQL        | 8.0+     |
| Validação      | Zod ou Joi   | Latest   |
| Autenticação   | JWT          | Standard |
| CORS           | Express CORS | Latest   |

### Frontend

| Componente       | Tecnologia            | Versão |
| ---------------- | --------------------- | ------ |
| Biblioteca UI    | React                 | 18+    |
| Linguagem        | TypeScript            | 5.0+   |
| Build Tool       | Vite                  | 4.0+   |
| HTTP Client      | Axios ou Fetch API    | Latest |
| State Management | Redux/Zustand         | Latest |
| Roteamento       | React Router          | 6.0+   |
| UI Components    | Material-UI ou Chakra | Latest |
| Ícones           | React Icons           | Latest |

### Infraestrutura

| Componente      | Tecnologia              |
| --------------- | ----------------------- |
| Versionamento   | Git + GitHub            |
| CI/CD           | GitHub Actions (futuro) |
| Containerização | Docker + Docker Compose |
| Hospedagem      | A definir               |

## 📁 Estrutura do Backend

```
backend/
├── src/
│   ├── controllers/          # Controladores HTTP
│   │   ├── clientController.ts
│   │   ├── productController.ts
│   │   ├── packagingController.ts
│   │   ├── orderController.ts
│   │   └── reportController.ts
│   │
│   ├── services/             # Lógica de negócio
│   │   ├── clientService.ts
│   │   ├── productService.ts
│   │   ├── packagingService.ts
│   │   ├── orderService.ts
│   │   └── reportService.ts
│   │
│   ├── routes/               # Definição de rotas
│   │   ├── clients.ts
│   │   ├── products.ts
│   │   ├── packagings.ts
│   │   ├── orders.ts
│   │   └── reports.ts
│   │
│   ├── middlewares/          # Middleware HTTP
│   │   ├── auth.ts           # Autenticação JWT
│   │   ├── errorHandler.ts   # Tratamento de erros
│   │   └── validation.ts     # Validação de dados
│   │
│   ├── config/
│   │   ├── database.ts       # Configuração Prisma
│   │   └── env.ts            # Variáveis de ambiente
│   │
│   ├── types/                # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                # Utilitários
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   │
│   └── app.ts                # Configuração Express
│
├── prisma/
│   ├── schema.prisma         # Definição do schema
│   └── migrations/           # Histórico de migrações
│
├── tests/                    # Testes unitários e E2E
├── .env.example              # Variáveis de exemplo
├── package.json
├── tsconfig.json
└── README.md
```

## 📁 Estrutura do Frontend

```
frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── common/           # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── clients/          # Módulo de clientes
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   └── ClientDetail.tsx
│   │   │
│   │   ├── products/         # Módulo de produtos
│   │   ├── packagings/       # Módulo de embalagens
│   │   ├── orders/           # Módulo de pedidos
│   │   └── reports/          # Módulo de relatórios
│   │
│   ├── pages/                # Páginas (rotas)
│   │   ├── Dashboard.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── PackagingsPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── Login.tsx
│   │
│   ├── services/             # Chamadas de API
│   │   ├── clientService.ts
│   │   ├── productService.ts
│   │   ├── packagingService.ts
│   │   ├── orderService.ts
│   │   └── reportService.ts
│   │
│   ├── store/                # State Management (Redux/Zustand)
│   │   ├── slices/
│   │   ├── hooks/
│   │   └── store.ts
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   │
│   ├── styles/               # Estilos globais
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── theme.ts
│   │
│   ├── utils/                # Utilitários
│   │   ├── api.ts            # Configuração Axios
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── types/                # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── App.tsx               # Componente raiz
│   └── main.tsx              # Ponto de entrada
│
├── public/                   # Arquivos estáticos
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🗄️ Camadas de Aplicação

### Camada de Apresentação (Frontend)

**Responsabilidades:**

- Interface de usuário responsiva
- Coleta e validação de dados do cliente
- Apresentação de informações formatadas
- Gerenciamento de estado local
- Roteamento de páginas

**Tecnologias:**

- React (UI)
- TypeScript (Type Safety)
- Vite (Build)
- React Router (Navegação)

### Camada de Aplicação (Backend)

**Responsabilidades:**

- Processamento de requisições HTTP
- Validação de dados
- Aplicação de regras de negócio
- Autenticação e autorização
- Geração de relatórios

**Camadas Internas do Backend:**

#### 1. Controllers

- Recebem requisições HTTP
- Delegam para services
- Retornam respostas formatadas
- Tratam erros HTTP

#### 2. Services

- Implementam lógica de negócio
- Acessam dados via Prisma
- Fazem cálculos e transformações
- Orquestram operações complexas

#### 3. Routes

- Definem endpoints (GET, POST, PUT, DELETE)
- Vinculam controllers
- Aplicam middlewares específicos

#### 4. Middlewares

- Autenticação (verificar JWT)
- Validação de dados (Zod/Joi)
- Tratamento de erros global
- CORS
- Logging

### Camada de Dados (Banco de Dados)

**Responsabilidades:**

- Armazenar dados estruturados
- Garantir integridade referencial
- Indexar dados para performance
- Backup e recuperação

**Tecnologia:**

- MySQL 8.0+
- Prisma ORM

## 🔄 Fluxo de Dados

### Exemplo: Criar um Novo Pedido

```
1. Frontend → POST /api/orders (com dados + JWT)
                ↓
2. Middleware → Valida token JWT
                ↓
3. Middleware → Valida dados com Zod
                ↓
4. Controller (orderController.createOrder)
                ↓
5. Service (orderService.createOrder)
   - Valida cliente existe
   - Valida produtos existem
   - Calcula embalagens necessárias
   - Cria registro no BD
   - Retorna pedido criado
                ↓
6. Prisma → INSERT INTO orders
             INSERT INTO order_items
                ↓
7. MySQL → Armazena dados
                ↓
8. Service → Retorna objeto pedido
                ↓
9. Controller → Retorna JSON (200 OK)
                ↓
10. Frontend → Exibe sucesso/erro ao usuário
```

## 🛡️ Segurança

### Autenticação

- JWT (JSON Web Token) com expiração
- Refresh tokens para sessões longas
- Senha com hash bcrypt

### Autorização

- Role-based access control (RBAC)
- Vendedores veem apenas seus clientes
- Gestores veem tudo

### Validação

- Validação de entrada em dois níveis (Frontend + Backend)
- SQL Injection prevention via Prisma
- XSS prevention em templates React

### Dados Sensíveis

- CNPJ, CPF criptografados no BD
- Senha nunca armazenada em texto
- Comunicação HTTPS obrigatória

## � Docker

O banco de dados e o backend rodam em containers Docker, gerenciados via **Docker Compose**. O frontend continua rodando localmente durante o desenvolvimento (ou pode ser adicionado ao Compose futuramente).

### Estrutura dos Containers

```
docker-compose.yml
├── db          → MySQL 8.0 (porta 3306)
└── backend     → Node.js + Express (porta 3333)
```

### `docker-compose.yml` (referência)

```yaml
version: "3.9"

services:
  db:
    image: mysql:8.0
    container_name: dica_amazonia_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dica_amazonia_backend
    restart: always
    env_file:
      - ./backend/.env
    ports:
      - "3333:3333"
    depends_on:
      - db
    networks:
      - app_network

volumes:
  db_data:

networks:
  app_network:
    driver: bridge
```

### `backend/Dockerfile` (referência)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3333
CMD ["node", "dist/app.js"]
```

### Variáveis de Ambiente

As variáveis do container são definidas no arquivo `backend/.env` (nunca versionado). O `.env.example` serve como referência:

```env
# Banco de Dados
DB_HOST=db
DB_PORT=3306
DB_NAME=dica_amazonia
DB_USER=app_user
DB_PASSWORD=
DB_ROOT_PASSWORD=

# Backend
PORT=3333
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Prisma
DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@db:3306/${DB_NAME}
```

### Comandos Úteis

```bash
# Subir ambiente completo
docker compose up -d

# Ver logs do backend
docker compose logs -f backend

# Rodar migrations do Prisma dentro do container
docker compose exec backend npx prisma migrate deploy

# Derrubar containers
docker compose down

# Derrubar e remover volumes (apaga o banco!)
docker compose down -v
```

---

## �📦 Padrões de Projeto

### MVC (Model-View-Controller)

- Model: Prisma schema
- View: Componentes React
- Controller: Controladores Express

### Repository Pattern (via Prisma)

- Services usam Prisma como abstração
- Troca de BD sem alterar lógica

### Dependency Injection (futura)

- Facilita testes unitários
- Desacopla componentes

## 🚀 Fluxo de Deployment

```
1. Desenvolvedor → Push para GitHub
                ↓
2. GitHub Actions → Testa código
                ↓
3. Build → Compila TypeScript
                ↓
4. Deploy → Produção
```

## 🔌 Integrações Futuras

- **Observação:** sem integração com o site institucional em qualquer fase do projeto
- **E-mail:** Notificações de pedidos
- **SMS/WhatsApp:** Via Twilio ou similar
- **Relatórios:** Exportação para Excel/PDF

## 📊 Performance e Escalabilidade

### Índices de BD

- Índice em CNPJ (clientes)
- Índice em product_id (itens de pedido)
- Índice em created_at (buscas por data)

### Cache (futura)

- Redis para sessões
- Dados imutáveis em cache

### Load Balance (futura)

- Múltiplas instâncias do Backend
- Load balancer nginx

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Blueprints finalizados
