# Design de Banco de Dados - Dica da Amazônia

## 📊 Diagrama de Entidades e Relacionamentos (DER)

```
┌──────────────────┐         ┌──────────────────┐
│    Client        │         │    Product       │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ cnpj (UNIQUE)    │         │ name             │
│ razaoSocial      │         │ description      │
│ nomeFantasia     │         │ price            │
│ type             │         │ packaging_id (FK)│
│ email (UNIQUE)   │         │ isActive         │
│ phone            │         │ createdAt        │
│ whatsapp         │         │ updatedAt        │
│ registroEstadual │         └──────────────────┘
│ pessoaContato    │                 ▲
│ endereco         │                 │
│ numero           │         ┌───────┴────────┐
│ complemento      │         │                │
│ bairro           │    ┌────▼──────────────┐
│ cidade           │    │   Packaging      │
│ uf               │    ├──────────────────┤
│ cep              │    │ id (PK)          │
│ createdAt        │    │ name             │
│ updatedAt        │    │ type             │
│ isActive         │    │ unitCost         │
└──┬───────────────┘    │ currentStock     │
   │                    │ minimumStock     │
   │ 1          ┌──────▶│ createdAt        │
   └────────────┤       │ updatedAt        │
          has   │       └──────────────────┘
                │
        ┌───────▼──────────────┐
        │      Order           │
        ├──────────────────────┤
        │ id (PK)              │
        │ client_id (FK)       │
        │ orderNumber (UNIQUE) │
        │ status               │
        │ totalValue           │
        │ createdAt            │
        │ updatedAt            │
        │ deliveryDate         │
        │ observations         │
        └───────┬──────────────┘
                │ 1
                │
                │ has many
                │
        ┌───────▼──────────────────┐
        │    OrderItem             │
        ├──────────────────────────┤
        │ id (PK)                  │
        │ order_id (FK)            │
        │ product_id (FK)          │
        │ quantity                 │
        │ unitPrice                │
        │ subtotal                 │
        │ createdAt                │
        └──────────────────────────┘
```

## 📋 Entidades Detalhadas

### 1. Client (Clientes)

**Propósito:** Armazenar informações de clientes B2B e B2C

**Tabela:** `clients`

| Campo             | Tipo        | Constraint              | Descrição                                 |
| ----------------- | ----------- | ----------------------- | ----------------------------------------- |
| id                | UUID        | PRIMARY KEY             | Identificador único                       |
| cnpj              | STRING(18)  | UNIQUE, NOT NULL        | CNPJ formatado (XX.XXX.XXX/0001-XX)       |
| razaoSocial       | STRING(255) | NOT NULL                | Nome oficial da empresa                   |
| nomeFantasia      | STRING(255) | NOT NULL                | Nome comercial                            |
| type              | ENUM        | NOT NULL                | 'B2B' ou 'B2C'                            |
| inscrEstadual     | STRING(20)  | NULL                    | Inscrição Estadual (obrigatório para B2B) |
| pessoaContatoNome | STRING(255) | NOT NULL                | Nome do responsável                       |
| pessoaContatoCPF  | STRING(14)  | NULL                    | CPF formatado (XXX.XXX.XXX-XX)            |
| email             | STRING(255) | UNIQUE, NOT NULL        | Email para contato                        |
| telefone          | STRING(15)  | NOT NULL                | Telefone (XX) XXXX-XXXX                   |
| whatsapp          | STRING(15)  | NOT NULL                | WhatsApp (XX) 9XXXX-XXXX                  |
| endereco          | STRING(255) | NOT NULL                | Logradouro                                |
| numero            | STRING(10)  | NOT NULL                | Número do endereço                        |
| complemento       | STRING(100) | NULL                    | Apto, sala, etc                           |
| bairro            | STRING(100) | NOT NULL                | Bairro                                    |
| cidade            | STRING(100) | NOT NULL                | Município                                 |
| uf                | CHAR(2)     | NOT NULL                | Sigla do estado                           |
| cep               | STRING(10)  | NOT NULL                | CEP formatado (XXXXX-XXX)                 |
| observacoes       | TEXT        | NULL                    | Campo livre                               |
| isActive          | BOOLEAN     | DEFAULT TRUE            | Status do cliente                         |
| createdAt         | DATETIME    | NOT NULL, DEFAULT NOW() | Data de criação                           |
| updatedAt         | DATETIME    | NOT NULL, DEFAULT NOW() | Última alteração                          |

**Índices:**

```sql
CREATE UNIQUE INDEX idx_cnpj ON clients(cnpj);
CREATE UNIQUE INDEX idx_email ON clients(email);
CREATE INDEX idx_tipo_status ON clients(type, isActive);
```

---

### 2. Product (Produtos)

**Propósito:** Catálogo de produtos disponíveis

**Tabela:** `products`

| Campo        | Tipo          | Constraint              | Descrição                 |
| ------------ | ------------- | ----------------------- | ------------------------- |
| id           | UUID          | PRIMARY KEY             | Identificador único       |
| name         | STRING(100)   | NOT NULL, UNIQUE        | Nome do produto           |
| description  | TEXT          | NULL                    | Descrição detalhada       |
| code         | STRING(20)    | UNIQUE                  | Código interno do produto |
| price        | DECIMAL(10,2) | NOT NULL, CHECK > 0     | Preço em R$               |
| packaging_id | UUID          | FOREIGN KEY             | Referência para embalagem |
| isActive     | BOOLEAN       | DEFAULT TRUE            | Ativo/Inativo             |
| stock        | INT           | DEFAULT 0               | Estoque disponível        |
| createdAt    | DATETIME      | NOT NULL, DEFAULT NOW() | Data de criação           |
| updatedAt    | DATETIME      | NOT NULL, DEFAULT NOW() | Última alteração          |

**Dados Padrão:**

```
1. name: "Café de Açaí" | code: "CAF-001" | packaging_id: <padrão>
2. name: "Café de Açaí + Café Tradicional" | code: "CAF-002" | packaging_id: <padrão>
3. name: "Café de Milho" | code: "CAF-003" | packaging_id: <padrão>
4. name: "Rende+" | code: "REN-001" | packaging_id: <especial>
```

**Índices:**

```sql
CREATE UNIQUE INDEX idx_code ON products(code);
CREATE INDEX idx_active ON products(isActive);
```

---

### 3. Packaging (Embalagens)

**Propósito:** Tipos de embalagem e controle de estoque

**Tabela:** `packagings`

| Campo            | Tipo          | Constraint              | Descrição                   |
| ---------------- | ------------- | ----------------------- | --------------------------- |
| id               | UUID          | PRIMARY KEY             | Identificador único         |
| name             | STRING(100)   | NOT NULL, UNIQUE        | Nome/tipo de embalagem      |
| type             | ENUM          | NOT NULL                | 'PADRÃO' ou 'ESPECIAL'      |
| description      | TEXT          | NULL                    | Detalhes da embalagem       |
| unitCost         | DECIMAL(10,2) | NOT NULL, CHECK > 0     | Custo unitário em R$        |
| currentStock     | INT           | DEFAULT 0               | Estoque atual               |
| minimumStock     | INT           | DEFAULT 100             | Mínimo recomendado          |
| supplier         | STRING(255)   | NULL                    | Fornecedor (São Paulo)      |
| supplierContact  | STRING(15)    | NULL                    | Telefone do fornecedor      |
| lastPurchaseDate | DATE          | NULL                    | Data do último pedido       |
| lastPurchaseQty  | INT           | NULL                    | Quantidade do último pedido |
| createdAt        | DATETIME      | NOT NULL, DEFAULT NOW() | Data de criação             |
| updatedAt        | DATETIME      | NOT NULL, DEFAULT NOW() | Última alteração            |

**Dados Padrão:**

```
1. name: "Embalagem Padrão" | type: "PADRÃO" | unitCost: R$ X.XX
2. name: "Embalagem Especial (Rende+)" | type: "ESPECIAL" | unitCost: R$ Y.YY
```

**Índices:**

```sql
CREATE UNIQUE INDEX idx_packaging_name ON packagings(name);
```

---

### 4. Order (Pedidos)

**Propósito:** Registro de pedidos de clientes

**Tabela:** `orders`

| Campo              | Tipo          | Constraint                   | Descrição                                                                |
| ------------------ | ------------- | ---------------------------- | ------------------------------------------------------------------------ |
| id                 | UUID          | PRIMARY KEY                  | Identificador único                                                      |
| client_id          | UUID          | FOREIGN KEY NOT NULL         | Cliente que fez o pedido                                                 |
| orderNumber        | STRING(20)    | UNIQUE, NOT NULL             | Número sequencial (ex: PED-2024-0001)                                    |
| status             | ENUM          | NOT NULL, DEFAULT 'PENDENTE' | PENDENTE, PROCESSANDO, PRODUÇÃO, PREPARADO, ENVIADO, ENTREGUE, CANCELADO |
| totalValue         | DECIMAL(12,2) | NOT NULL, DEFAULT 0          | Valor total do pedido                                                    |
| estimatedDelivery  | DATE          | NULL                         | Data estimada de entrega                                                 |
| actualDelivery     | DATE          | NULL                         | Data real de entrega                                                     |
| cancellationReason | TEXT          | NULL                         | Motivo do cancelamento (se aplicável)                                    |
| observations       | TEXT          | NULL                         | Observações adicionais                                                   |
| createdAt          | DATETIME      | NOT NULL, DEFAULT NOW()      | Data/hora do pedido                                                      |
| updatedAt          | DATETIME      | NOT NULL, DEFAULT NOW()      | Última atualização                                                       |
| createdBy          | UUID          | NULL                         | Usuário que criou                                                        |

**Índices:**

```sql
CREATE INDEX idx_client_id ON orders(client_id);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(createdAt);
CREATE UNIQUE INDEX idx_order_number ON orders(orderNumber);
```

**Gatilhos:**

- Alteração de status gera histórico em audit_log
- Cancelamento libera embalagens reservadas

---

### 5. OrderItem (Itens de Pedido)

**Propósito:** Detalhe de cada produto em um pedido

**Tabela:** `order_items`

| Campo              | Tipo          | Constraint              | Descrição                    |
| ------------------ | ------------- | ----------------------- | ---------------------------- |
| id                 | UUID          | PRIMARY KEY             | Identificador único          |
| order_id           | UUID          | FOREIGN KEY NOT NULL    | Pedido pai                   |
| product_id         | UUID          | FOREIGN KEY NOT NULL    | Produto referenciado         |
| quantity           | INT           | NOT NULL, CHECK > 0     | Quantidade pedida            |
| unitPrice          | DECIMAL(10,2) | NOT NULL, CHECK > 0     | Preço do produto no momento  |
| subtotal           | DECIMAL(12,2) | NOT NULL                | quantity × unitPrice         |
| packaging_reserved | INT           | NOT NULL                | Qtd de embalagens reservadas |
| createdAt          | DATETIME      | NOT NULL, DEFAULT NOW() | Data de criação              |

**Índices:**

```sql
CREATE INDEX idx_order_id ON order_items(order_id);
CREATE INDEX idx_product_id ON order_items(product_id);
```

**Constraint:**

```sql
ALTER TABLE order_items
ADD CONSTRAINT fk_order
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT fk_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;
```

---

## 🔗 Relacionamentos

### Client ↔ Order

- **Cardinalidade:** 1 para Muitos (1:N)
- **Tipo:** One-to-Many
- **Regra:** Um cliente pode ter vários pedidos; todo pedido pertence a um cliente
- **Cascade:** DELETE client → não deleta pedidos (regra de negócio)

### Product ↔ OrderItem

- **Cardinalidade:** 1 para Muitos (1:N)
- **Tipo:** One-to-Many
- **Regra:** Um produto pode estar em vários itens de pedido
- **Cascade:** DELETE product → impossível (RESTRICT)

### Packaging ↔ Product

- **Cardinalidade:** 1 para Muitos (1:N)
- **Tipo:** One-to-Many
- **Regra:** Uma embalagem é usada por um ou mais produtos
- **Cascade:** DELETE packaging → impossível (RESTRICT)

### Order ↔ OrderItem

- **Cardinalidade:** 1 para Muitos (1:N)
- **Tipo:** One-to-Many
- **Regra:** Um pedido tem 1 a N itens
- **Cascade:** DELETE order → deleta order_items (ON DELETE CASCADE)

---

## 🔐 Integridade Referencial

```sql
-- Constraints de integridade

ALTER TABLE products
ADD CONSTRAINT fk_products_packaging
FOREIGN KEY (packaging_id) REFERENCES packagings(id) ON DELETE RESTRICT;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT;

ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_order
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;
```

---

## 📈 Tabelas de Auditoria (futuro)

### audit_log

| Campo      | Tipo     | Descrição                   |
| ---------- | -------- | --------------------------- |
| id         | UUID     | PK                          |
| entity     | STRING   | Nome da entidade alterada   |
| entity_id  | UUID     | ID do registro alterado     |
| action     | ENUM     | CREATE, UPDATE, DELETE      |
| old_values | JSON     | Valores antigos             |
| new_values | JSON     | Valores novos               |
| changed_by | UUID     | Usuário que fez a alteração |
| changed_at | DATETIME | Quando foi alterado         |

---

## 📊 Relatórios - Views (SQL)

### View: Sales Summary

```sql
CREATE VIEW v_sales_summary AS
SELECT
  DATE(o.createdAt) as data,
  COUNT(o.id) as total_pedidos,
  SUM(o.totalValue) as total_vendido,
  COUNT(DISTINCT o.client_id) as clientes_unicos,
  AVG(o.totalValue) as ticket_medio
FROM orders o
WHERE o.status IN ('ENVIADO', 'ENTREGUE')
GROUP BY DATE(o.createdAt)
ORDER BY data DESC;
```

### View: Top Products

```sql
CREATE VIEW v_top_products AS
SELECT
  p.name,
  p.code,
  SUM(oi.quantity) as total_vendido,
  COUNT(DISTINCT o.client_id) as clientes,
  SUM(oi.subtotal) as faturamento
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('ENVIADO', 'ENTREGUE')
GROUP BY p.id, p.name, p.code
ORDER BY total_vendido DESC;
```

### View: Top Clients

```sql
CREATE VIEW v_top_clients AS
SELECT
  c.id,
  c.nomeFantasia,
  c.type,
  COUNT(DISTINCT o.id) as total_pedidos,
  SUM(o.totalValue) as faturamento_total,
  MAX(o.createdAt) as ultimo_pedido
FROM clients c
LEFT JOIN orders o ON c.id = o.client_id AND o.status != 'CANCELADO'
GROUP BY c.id, c.nomeFantasia, c.type
ORDER BY faturamento_total DESC;
```

---

## 🚀 Migrações Iniciais (Prisma)

```prisma
// Schema base em prisma/schema.prisma

model Client {
  id                    String   @id @default(cuid())
  cnpj                  String   @unique
  razaoSocial           String
  nomeFantasia          String
  type                  String   // B2B ou B2C
  inscrEstadual         String?
  pessoaContatoNome     String
  pessoaContatoCPF      String?
  email                 String   @unique
  telefone              String
  whatsapp              String
  endereco              String
  numero                String
  complemento           String?
  bairro                String
  cidade                String
  uf                    String
  cep                   String
  observacoes           String?  @db.Text
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  orders                Order[]

  @@index([type, isActive])
}

model Packaging {
  id                    String   @id @default(cuid())
  name                  String   @unique
  type                  String   // PADRÃO ou ESPECIAL
  description           String?  @db.Text
  unitCost              Decimal  @db.Decimal(10, 2)
  currentStock          Int      @default(0)
  minimumStock          Int      @default(100)
  supplier              String?
  supplierContact       String?
  lastPurchaseDate      DateTime?
  lastPurchaseQty       Int?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  products              Product[]
}

model Product {
  id                    String   @id @default(cuid())
  name                  String   @unique
  description           String?  @db.Text
  code                  String   @unique
  price                 Decimal  @db.Decimal(10, 2)
  packaging_id          String
  packaging             Packaging @relation(fields: [packaging_id], references: [id])
  isActive              Boolean  @default(true)
  stock                 Int      @default(0)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  orderItems            OrderItem[]

  @@index([isActive])
}

model Order {
  id                    String   @id @default(cuid())
  client_id             String
  client                Client   @relation(fields: [client_id], references: [id])
  orderNumber           String   @unique
  status                String   @default("PENDENTE")
  totalValue            Decimal  @db.Decimal(12, 2) @default(0)
  estimatedDelivery     DateTime?
  actualDelivery        DateTime?
  cancellationReason    String?  @db.Text
  observations          String?  @db.Text
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  createdBy             String?

  items                 OrderItem[]

  @@index([client_id])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id                    String   @id @default(cuid())
  order_id              String
  order                 Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product_id            String
  product               Product  @relation(fields: [product_id], references: [id])
  quantity              Int
  unitPrice             Decimal  @db.Decimal(10, 2)
  subtotal              Decimal  @db.Decimal(12, 2)
  packaging_reserved    Int
  createdAt             DateTime @default(now())

  @@index([order_id])
  @@index([product_id])
}
```

---

## 🔄 Migrações Futuras

1. **Adicionar tabela de usuários e autenticação**
2. **Adicionar tabela de auditoria**
3. **Adicionar histórico de preços**
4. **Adicionar tabela de fornecedores**
5. **Adicionar tabela de pagamentos**

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Esquema finalizado
