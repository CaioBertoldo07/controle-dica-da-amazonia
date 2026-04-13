# Design de API REST - Dica da Amazônia

## 🔗 Convenções de API

### URL Base

```
http://localhost:3000/api/v1
https://api-interno.dicadaamazonia.com.br/v1 (produção - API interna do dashboard)
```

**Observação:** esta API pertence ao sistema interno de gestão e não possui dependência do site institucional.

### Recursos e Endpoints

**Convenção RESTful:**

- GET `/resource` - Listar todos
- GET `/resource/:id` - Obter um específico
- POST `/resource` - Criar novo
- PUT `/resource/:id` - Atualizar completo
- PATCH `/resource/:id` - Atualizar parcial
- DELETE `/resource/:id` - Deletar

### Status HTTP Esperados

| Código | Significado                              |
| ------ | ---------------------------------------- |
| 200    | OK - Requisição bem-sucedida             |
| 201    | Created - Recurso criado                 |
| 204    | No Content - Sucesso sem conteúdo        |
| 400    | Bad Request - Dados inválidos            |
| 401    | Unauthorized - Sem autenticação          |
| 403    | Forbidden - Sem permissão                |
| 404    | Not Found - Recurso não encontrado       |
| 409    | Conflict - Conflito (ex: CNPJ duplicado) |
| 500    | Internal Server Error - Erro no servidor |

### Headers Padrão

**Request:**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```
Content-Type: application/json
X-Total-Count: <número total de registros>
X-Page: <página atual>
X-Page-Size: <itens por página>
```

---

## 🔐 Autenticação

### POST /auth/login

**Descrição:** Autenticar usuário com email e senha

**Request:**

```json
{
  "email": "usuario@dicadaamazonia.com.br",
  "password": "senha123"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "usuario@dicadaamazonia.com.br",
    "name": "Nome Usuário",
    "role": "gestor"
  }
}
```

**Response (401):**

```json
{
  "error": "Credenciais inválidas"
}
```

### POST /auth/refresh

**Descrição:** Renovar token de acesso

**Request:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

## 👥 Endpoints de Clientes

### GET /clients

**Descrição:** Listar todos os clientes com filtros e paginação

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| page | number | Não | Página (padrão: 1) |
| limit | number | Não | Itens por página (padrão: 10, máx: 100) |
| type | string | Não | Filtro por tipo: B2B ou B2C |
| isActive | boolean | Não | Filtro por status |
| search | string | Não | Buscar por CNPJ, razão social ou email |
| sortBy | string | Não | Campo para ordenação (ex: createdAt, razaoSocial) |
| order | string | Não | Ordem: asc ou desc |

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "cnpj": "12.345.678/0001-99",
      "razaoSocial": "Empresa Exemplo LTDA",
      "nomeFantasia": "Exemplo",
      "type": "B2B",
      "email": "contato@exemplo.com.br",
      "telefone": "(92) 3333-3333",
      "whatsapp": "(92) 99999-9999",
      "pessoaContatoNome": "João Silva",
      "isActive": true,
      "createdAt": "2024-04-01T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

### GET /clients/:id

**Descrição:** Obter detalhes de um cliente específico

**Response (200):**

```json
{
  "id": "uuid",
  "cnpj": "12.345.678/0001-99",
  "razaoSocial": "Empresa Exemplo LTDA",
  "nomeFantasia": "Exemplo",
  "type": "B2B",
  "email": "contato@exemplo.com.br",
  "telefone": "(92) 3333-3333",
  "whatsapp": "(92) 99999-9999",
  "inscrEstadual": "12.345.678.901.234",
  "pessoaContatoNome": "João Silva",
  "pessoaContatoCPF": "123.456.789-00",
  "endereco": "Rua das Flores",
  "numero": "123",
  "complemento": "Apto 101",
  "bairro": "Centro",
  "cidade": "Manaus",
  "uf": "AM",
  "cep": "69000-000",
  "observacoes": "Cliente VIP",
  "isActive": true,
  "createdAt": "2024-04-01T10:30:00Z",
  "updatedAt": "2024-04-15T14:20:00Z"
}
```

### POST /clients

**Descrição:** Criar novo cliente

**Request:**

```json
{
  "cnpj": "12.345.678/0001-99",
  "razaoSocial": "Empresa Nova LTDA",
  "nomeFantasia": "Nova",
  "type": "B2B",
  "email": "nova@empresa.com.br",
  "telefone": "(92) 3333-3333",
  "whatsapp": "(92) 99999-9999",
  "inscrEstadual": "12.345.678.901.234",
  "pessoaContatoNome": "Maria Santos",
  "pessoaContatoCPF": "123.456.789-00",
  "endereco": "Avenida Principal",
  "numero": "456",
  "bairro": "Bairro",
  "cidade": "Manaus",
  "uf": "AM",
  "cep": "69000-000"
}
```

**Response (201):**

```json
{
  "id": "uuid-novo",
  "cnpj": "12.345.678/0001-99",
  "razaoSocial": "Empresa Nova LTDA",
  "nomeFantasia": "Nova",
  "type": "B2B",
  "createdAt": "2024-04-20T09:00:00Z"
}
```

**Response (409):**

```json
{
  "error": "CNPJ já cadastrado no sistema"
}
```

### PUT /clients/:id

**Descrição:** Atualizar cliente completo

**Request:** (todos os campos obrigatórios)

**Response (200):** Cliente atualizado

### PATCH /clients/:id

**Descrição:** Atualizar campos específicos do cliente

**Request:**

```json
{
  "nomeFantasia": "Novo Nome",
  "whatsapp": "(92) 98888-8888"
}
```

**Response (200):** Cliente com campos atualizados

### DELETE /clients/:id

**Descrição:** Desativar cliente (soft delete)

**Response (204):** Sem conteúdo

---

## 📦 Endpoints de Produtos

### GET /products

**Descrição:** Listar produtos

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| page | number | Página |
| limit | number | Itens por página |
| isActive | boolean | Filtro por status |
| search | string | Buscar por nome ou código |

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Café de Açaí",
      "code": "CAF-001",
      "description": "Bebida à base de café com açaí",
      "price": 25.5,
      "packaging": {
        "id": "uuid",
        "name": "Embalagem Padrão"
      },
      "isActive": true,
      "stock": 500,
      "createdAt": "2024-04-01T10:30:00Z"
    }
  ]
}
```

### GET /products/:id

**Response (200):** Detalhes do produto

### POST /products

**Request:**

```json
{
  "name": "Novo Produto",
  "code": "NEW-001",
  "description": "Descrição do novo produto",
  "price": 35.0,
  "packaging_id": "uuid-packaging",
  "stock": 0
}
```

**Response (201):** Produto criado

### PUT /products/:id

**Descrição:** Atualizar produto

### DELETE /products/:id

**Descrição:** Desativar produto

---

## 📫 Endpoints de Embalagens

### GET /packagings

**Query Parameters:** page, limit, search

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Embalagem Padrão",
      "type": "PADRÃO",
      "unitCost": 2.5,
      "currentStock": 5000,
      "minimumStock": 1000,
      "supplier": "Fornecedor São Paulo LTDA",
      "supplierContact": "(11) 3333-3333",
      "lastPurchaseDate": "2024-04-10T00:00:00Z",
      "lastPurchaseQty": 2000,
      "createdAt": "2024-04-01T10:30:00Z"
    }
  ]
}
```

### GET /packagings/:id

**Response (200):** Detalhes da embalagem

### POST /packagings

**Request:**

```json
{
  "name": "Nova Embalagem",
  "type": "PADRÃO",
  "description": "Descrição",
  "unitCost": 3.0,
  "minimumStock": 500,
  "supplier": "Fornecedor",
  "supplierContact": "(11) 9999-9999"
}
```

### PATCH /packagings/:id/stock

**Descrição:** Atualizar estoque da embalagem

**Request:**

```json
{
  "quantity": 150,
  "operation": "add" // "add" ou "remove"
}
```

**Response (200):**

```json
{
  "currentStock": 5150
}
```

---

## 📋 Endpoints de Pedidos

### GET /orders

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| page | number | Página |
| limit | number | Itens por página |
| status | string | Filtro por status |
| client_id | uuid | Filtro por cliente |
| dateFrom | date | Data inicial (YYYY-MM-DD) |
| dateTo | date | Data final (YYYY-MM-DD) |
| sortBy | string | Campo de ordenação |

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "orderNumber": "PED-2024-0001",
      "client": {
        "id": "uuid",
        "nomeFantasia": "Empresa"
      },
      "status": "PROCESSANDO",
      "totalValue": 102.0,
      "itemsCount": 4,
      "estimatedDelivery": "2024-04-25T00:00:00Z",
      "createdAt": "2024-04-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10
  }
}
```

### GET /orders/:id

**Response (200):**

```json
{
  "id": "uuid",
  "orderNumber": "PED-2024-0001",
  "client": {
    "id": "uuid",
    "cnpj": "12.345.678/0001-99",
    "nomeFantasia": "Empresa",
    "email": "contato@empresa.com.br"
  },
  "status": "PROCESSANDO",
  "totalValue": 102.0,
  "estimatedDelivery": "2024-04-25T00:00:00Z",
  "observations": "Entrega prioritária",
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Café de Açaí",
        "code": "CAF-001"
      },
      "quantity": 2,
      "unitPrice": 25.5,
      "subtotal": 51.0
    }
  ],
  "createdAt": "2024-04-15T10:30:00Z"
}
```

### POST /orders

**Descrição:** Criar novo pedido

**Request:**

```json
{
  "client_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2
    },
    {
      "product_id": "uuid",
      "quantity": 4
    }
  ],
  "observations": "Entrega rápida",
  "estimatedDelivery": "2024-04-25"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "orderNumber": "PED-2024-0001",
  "status": "PENDENTE",
  "totalValue": 102.0,
  "createdAt": "2024-04-20T10:00:00Z"
}
```

### PATCH /orders/:id/status

**Descrição:** Atualizar status de um pedido

**Request:**

```json
{
  "status": "PROCESSANDO"
}
```

**Response (200):**

```json
{
  "orderNumber": "PED-2024-0001",
  "status": "PROCESSANDO",
  "updatedAt": "2024-04-20T10:30:00Z"
}
```

**Status válidos:** PENDENTE, PROCESSANDO, PRODUÇÃO, PREPARADO, ENVIADO, ENTREGUE

### PATCH /orders/:id/cancel

**Descrição:** Cancelar pedido

**Request:**

```json
{
  "reason": "Cliente solicitou cancelamento"
}
```

**Response (200):**

```json
{
  "status": "CANCELADO",
  "cancellationReason": "Cliente solicitou cancelamento"
}
```

---

## 📊 Endpoints de Relatórios

### GET /reports/sales

**Descrição:** Relatório de vendas por período

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório |
|-----------|------|-----------|
| dateFrom | date | Sim |
| dateTo | date | Sim |
| groupBy | string | Não (day, week, month) |

**Response (200):**

```json
{
  "period": {
    "from": "2024-04-01",
    "to": "2024-04-30"
  },
  "summary": {
    "totalSales": 25450.0,
    "totalOrders": 125,
    "averageTicket": 203.6,
    "uniqueClients": 45
  },
  "data": [
    {
      "date": "2024-04-01",
      "sales": 450.0,
      "orders": 2,
      "clients": 2
    }
  ]
}
```

### GET /reports/top-products

**Descrição:** Produtos mais vendidos

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| limit | number | Top N produtos (padrão: 10) |
| dateFrom | date | Data inicial |
| dateTo | date | Data final |

**Response (200):**

```json
{
  "data": [
    {
      "product": {
        "id": "uuid",
        "name": "Café de Açaí",
        "code": "CAF-001"
      },
      "totalQty": 450,
      "totalRevenue": 11475.0,
      "percentage": 45.1,
      "uniqueClients": 50
    }
  ]
}
```

### GET /reports/top-clients

**Descrição:** Clientes principais

**Query Parameters:** limit, dateFrom, dateTo

**Response (200):**

```json
{
  "data": [
    {
      "client": {
        "id": "uuid",
        "nomeFantasia": "Empresa Principal",
        "type": "B2B"
      },
      "totalOrders": 25,
      "totalSpent": 5000.0,
      "averageOrder": 200.0,
      "lastOrder": "2024-04-18T14:30:00Z"
    }
  ]
}
```

### GET /reports/packaging-analysis

**Descrição:** Análise de consumo de embalagens

**Query Parameters:** dateFrom, dateTo

**Response (200):**

```json
{
  "data": [
    {
      "packaging": {
        "id": "uuid",
        "name": "Embalagem Padrão"
      },
      "totalConsumed": 2500,
      "currentStock": 5000,
      "minimumStock": 1000,
      "daysToReorder": 2,
      "estimatedCost": 6250.0
    }
  ]
}
```

---

## ❌ Tratamento de Erros

### Formato de Erro Padrão

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido",
        "value": "invalid-email"
      }
    ]
  }
}
```

### Códigos de Erro Comuns

| Código               | HTTP | Descrição                |
| -------------------- | ---- | ------------------------ |
| VALIDATION_ERROR     | 400  | Dados inválidos          |
| RESOURCE_NOT_FOUND   | 404  | Recurso não encontrado   |
| DUPLICATE_CNPJ       | 409  | CNPJ já existe           |
| DUPLICATE_EMAIL      | 409  | Email já existe          |
| INVALID_CLIENT_TYPE  | 400  | Tipo de cliente inválido |
| INVALID_ORDER_STATUS | 400  | Status inválido          |
| INSUFFICIENT_STOCK   | 400  | Estoque insuficiente     |
| UNAUTHORIZED         | 401  | Não autenticado          |
| FORBIDDEN            | 403  | Sem permissão            |

---

## 📄 Paginação

Todos os endpoints de listagem suportam paginação cursorizada:

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🔄 Rate Limiting

- **Limite:** 100 requisições por minuto por IP
- **Header Response:** `X-RateLimit-Remaining`

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Especificação completa
