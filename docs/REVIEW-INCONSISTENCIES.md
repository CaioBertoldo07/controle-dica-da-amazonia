# 🔍 Revisão de Documentação - Inconsistências Identificadas

**Data:** Abril de 2026  
**Status:** ⚠️ CRÍTICAS E IMPORTANTES ENCONTRADAS  
**Recomendação:** Resolver antes de iniciar implementação

---

## 📊 Resumo Executivo

| Severidade        | Quantidade | Status              |
| ----------------- | ---------- | ------------------- |
| 🔴 **Crítica**    | 5          | Deve ser resolvida  |
| 🟠 **Importante** | 8          | Deve ser resolvida  |
| 🟡 **Atenção**    | 7          | Pode impactar       |
| 🟢 **Menor**      | 4          | Complementar        |
| **TOTAL**         | **24**     | **Inconsistências** |

---

## 🔴 CRÍTICAS (Bloqueadores)

### 1. Usuários e Autenticação - Tabela Não Definida

**Problema:**

- ❌ `api-design.md` especifica `/auth/login` com resposta contendo `user { id, email, name, role }`
- ❌ `database-design.md` **não define tabela `users`**
- ❌ Não há schema Prisma para autenticação

**Impacto:** Sem definição de usuários, impossível implementar autenticação

**Solução Recomendada:**

```
Criar tabela `User`:
- id (UUID)
- email (UNIQUE)
- password (hash)
- name
- role (ENUM: admin, gestor, vendedor, operador)
- isActive
- createdAt, updatedAt
```

**Por Quem:** Backend architect  
**Prioridade:** IMEDIATA

---

### 2. Pessoas de Contato - Cardinalidade Incorreta

**Problema:**

- ✅ `business-rules.md` diz: "B2B... Pode ter **múltiplas pessoas de contato**"
- ❌ `database-design.md` tabela `clients` tem apenas UMA pessoa de contato:
  - `pessoaContatoNome`
  - `pessoaContatoCPF`
- ❌ Sem tabela relacionada para múltiplos contatos

**Impacto:** Clientes B2B não conseguem registrar múltiplos contatos

**Solução Recomendada:**
Opção A: Criar tabela `ContactPerson`:

```
- id (UUID, PK)
- client_id (UUID, FK)
- name
- cpf
- email
- phone
- isPrimary (boolean)
- createdAt
```

Opção B: Manter simples por ora e apenas permitir 1 contato (MVP)

**Decisão:** Esclarecer com o cliente antes de implementar

---

### 3. Reserva de Embalagens - Lógica Indefinida

**Problema:**

- ✅ `business-rules.md` diz: "Embalagens são **reservadas quando pedido passa para PROCESSANDO**"
- ❌ Não há campo na tabela `OrderItem` para rastrear embalagens reservadas
- ❌ Não há lógica de como liberar embalagens ao cancelar
- ❌ Não há campo na `Packaging` para rastrear "embalagens em uso"

**Exemplo da Falha:**

```
Situação: Pedido com 10 unidades de Café de Açaí (usa 10 embalagens padrão)
Status: PENDENTE
- Estoque Embalagem Padrão: 50 unidades

Ao passar para PROCESSANDO:
- Devem reservar 10 unidades?
- O estoque baixa para 40?
- Se cancelar, volta para 50?
- E se outro pedido vier no meio?
```

**Banco de Dados Necessário:**

```
Adicionar em OrderItem:
- packaging_reserved: INT (quantidade de embalagens reservadas)

Adicionar em Packaging:
- reservedStock: INT (quantidade reservada)
```

**Lógica:**

```
Ao criar/atualizar pedido em PROCESSANDO:
  packaging.reservedStock += quantidade_de_embalagens
  packaging.availableStock = currentStock - reservedStock

Ao cancelar pedido:
  packaging.reservedStock -= quantidade_de_embalagens
```

**Por Quem:** Business analyst + Backend  
**Prioridade:** IMEDIATA

---

### 4. Inscrição Estadual B2B - Validação Inconsistente

**Problema:**

- ✅ `business-rules.md` especifica: "Inscrição Estadual **obrigatório para B2B**"
- ❌ `database-design.md` tabela `clients` define como `inscrEstadual: STRING(20), NULL`
- ❌ Sem validação condicional por tipo de cliente

**Impacto:** Sistema permitiria criar cliente B2B sem IE, violando regra de negócio

**Solução Recomendada:**

```typescript
// src/types/client.ts
type B2BClient = {
  type: "B2B";
  inscrEstadual: string; // OBRIGATÓRIO
  // ...
};

type B2CClient = {
  type: "B2C";
  inscrEstadual?: string; // OPCIONAL
  // ...
};
```

**Database:**

```sql
ALTER TABLE clients
ADD CONSTRAINT check_ie_required
CHECK (type = 'B2C' OR (type = 'B2B' AND inscrEstadual IS NOT NULL))
```

**Por Quem:** Backend + QA  
**Prioridade:** ALTA

---

### 5. Máximo de 3 Itens por Pedido - Sem Validação

**Problema:**

- ✅ `business-rules.md` seção 12 especifica: "**Máximo de 3 itens diferentes por pedido**"
- ❌ Não aparece em `api-design.md` como validação de request
- ❌ Não há constraint no banco de dados
- ❌ Roadmap não menciona testes para este limite

**Impacto:** Sistema permitiria 10+ itens em um pedido, violando restrição operacional

**Solução Recomendada:**

```typescript
// POST /orders - validação
if (request.items.length > 3) {
  throw new ValidationError("Máximo de 3 produtos diferentes por pedido");
}
```

**Database (futuro):**

```sql
ALTER TABLE orders
ADD CONSTRAINT check_max_items
CHECK (
  SELECT COUNT(*) FROM order_items WHERE order_id = id) <= 3
)
```

**Por Quem:** Backend + Frontend  
**Prioridade:** ALTA

---

## 🟠 IMPORTANTES (Devem ser resolvidas)

### 6. Histórico de Preços - Captura mas Sem Strategy

**Problema:**

- ✅ `api-design.md` menciona: "Preço unitário é **capturado no momento do pedido**"
- ✅ `database-design.md` OrderItem tem `unitPrice`
- ❌ Sem estratégia de versionamento de preços
- ❌ Se produto muda de preço, relatórios podem ficar inconsistentes
- ❌ Sem tabela de histórico de preços

**Impacto:** Dificuldade em análises históricas precisas

**Cenário Problemático:**

```
Jan/2024: Café Açaí = R$ 20
Pedido#1 criado com 10 un: total R$ 200

Fev/2024: Café Açaí = R$ 25 (novo preço)
Pedido#2 criado com 10 un: total R$ 250

Relatório "Próximos 3 meses": ambos aparecerem com qual preço?
```

**Solução Recomendada:**
Criar tabela `ProductPriceHistory`:

```
- id (UUID, PK)
- product_id (UUID, FK)
- price (DECIMAL)
- validFrom (DATE)
- validTo (DATE, nullable)
- createdAt
```

Ou campo `priceSnapshot` em Product com histórico JSON.

**Decisão:** MVP - apenas capturar unitPrice no OrderItem (simples). v2 - implementar versionamento.

**Por Quem:** Business Analyst  
**Prioridade:** MÉDIA

---

### 7. Separação do Site Institucional Não Estava Explícita

**Problema:**

- ❌ O escopo mencionava dependência de canal externo, contrariando a premissa de sistema interno
- ❌ Faltava declarar explicitamente independência do site institucional
- ❌ A documentação não reforçava backend, API e banco próprios como arquitetura autônoma

**Impacto:** Ambiguidade de escopo e risco de implementação de dependência externa indevida

**Correção Necessária:**

```
1. Declarar em todos os documentos que o sistema é interno e independente
2. Remover qualquer menção a importação de pedidos por canal externo institucional
3. Remover qualquer menção a sincronização de status com website
4. Manter site público apenas como referência de identidade visual
5. Reforçar backend, API e banco próprios
```

**Por Quem:** Product Manager + Tech Lead  
**Prioridade:** MÉDIA

---

### 8. Relatório Status de Produção - Campos Faltando

**Problema:**

- ✅ `business-rules.md` menciona relatório "Status de Produção" com:
  - Pedidos em andamento
  - **Tempo médio de produção** ❌
  - **Pedidos atrasados** ❌
- ❌ `database-design.md` Order não tem:
  - `plannedEndDate` (data planejada de conclusão)
  - `actualEndDate` (data real de conclusão)
- ❌ Impossível calcular tempo de produção ou atraso

**Impacto:** Relatório não pode ser implementado

**Solução Recomendada:**
Adicionar campos em Order:

```
- plannedEndDate: DATE (data esperada de conclusão)
- actualEndDate: DATE (data real de conclusão)
- productionStartedAt: DATETIME
- isOverdue: BOOLEAN (computed)
```

**Por Quem:** Business Analyst + Backend  
**Prioridade:** ALTA

---

### 9. Roles e Permissões - Indefinidas

**Problema:**

- ✅ `business-rules.md` menciona: "Vendedores visualizam apenas clientes atribuídos"
- ✅ `api-design.md` resposta login contém `"role": "gestor"`
- ❌ Sem lista completa de roles
- ❌ Sem matriz de permissões (quem acessa quais endpoints)
- ❌ Sem tabelade atribuição vendedor → cliente

**Roles Presumidas:**

```
- admin (full access)
- gestor (full access + relatórios)
- vendedor (clientes atribuídos, pedidos, basic reports)
- operador (read-only na produção?)
```

**Falta:**

- Tabela `VendorClient` (muitos-para-muitos: vendors x clients)
- Matriz RBAC (Role-Based Access Control)

**Por Quem:** Security Architect + Product  
**Prioridade:** MÉDIA

---

### 10. Soft Delete vs Delete - Inconsistente

**Problema:**

- ✅ `api-design.md` `DELETE /clients/:id` é soft delete
- ❌ Sem clareza em outros recursos:
  - DELETE /products é soft ou hard?
  - DELETE /packagings é soft ou hard?
  - DELETE /orders é permitido?
  - Qual exatamente é a lógica de "exclusão"?

**Impacto:** Comportamento imprevisível

**Solução Recomendada:**
Política clara:

```
Hard Delete (removido físico):
- Nenhum (nunca)

Soft Delete (marcado como inativo):
- Clients (business critical)
- Products (historical data)
- Packagings (inventory tracking)
- Orders (NUNCA - apenas status CANCELADO)
```

**Por Quem:** Database Architect  
**Prioridade:** MÉDIA

---

### 11. Estoque de Produtos - Modelo Indefinido

**Problema:**

- ❌ Empresa trabalha **produção sob demanda** (conforme business-rules)
- ✅ `database-design.md` Product tem campo `stock: INT`
- ❌ Incerteza: estoque bloqueia vendas ou apenas informativo?
- ❌ Business-rules não especifica

**Cenários Conflitantes:**

```
Cenário A (Engajado):
  Produto com estoque = 0
  → Novo pedido BLOQUEIA

Cenário B (Sob Demanda):
  Estoque = apenas informativo
  → Novo pedido SEMPRE aceito
```

**Recomendação:**
Esclarecer com Cliente: sistema bloqueia pedidos com estoque zero ou não?

**Por Quem:** Product Manager  
**Prioridade:** ALTA

---

### 12. Formato OrderNumber - Sequência Indefinida

**Problema:**

- ✅ `database-design.md` specifica `orderNumber: STRING(20) UNIQUE`
- ✅ `api-design.md` exemplo: `"PED-2024-0001"`
- ❌ Sem definição clara:
  - Reset anual (2024→0001, 2025→0001)?
  - Auto-increment global (0001, 0002, ...)?
  - Com padding (sempre 4 dígitos, 6 dígitos)?

**Impacto:** Ambiguidade na implementação

**Opções:**

```
Opção A: PED-YYYY-NNNNNN (ano + sequência)
Opção B: PED-NNNNNNNNNN (sequência global)
Opção C: Outro padrão?
```

**Por Quem:** Backend Architect  
**Prioridade:** MÉDIA

---

---

## 🟡 ATENÇÃO (Podem impactar)

### 13. Tabela Auditoria Não Usa Usuários Corretamente

**Problema:**

- ✅ `database-design.md` define `audit_log` com `changed_by: UUID`
- ❌ Sem referência à tabela `users`
- ❌ Sem constraint de Foreign Key
- ❌ Sem mecanismo de preenchimento automático

**Solução:**

```sql
ALTER TABLE audit_log
ADD CONSTRAINT fk_audit_log_user
FOREIGN KEY (changed_by) REFERENCES users(id)
```

**Por Quem:** Database Architect  
**Prioridade:** MÉDIA

---

### 14. Cálculo de Embalagem - "1 por item" Ambíguo

**Problema:**

- ✅ `business-rules.md` diz: "1 embalagem por item"
- ❌ "Item" significa:
  - 1 linha do pedido (exemplo: 2 unidades de Café Açaí = 1 embalagem)?
  - 1 unidade (exemplo: 2 unidades = 2 embalagens)?

**Cenário:**

```
Pedido com:
- 10 unidades de Café de Açaí
- 5 unidades de Café de Milho

Opção A: 2 embalagens (1 por item/linha) = TOTAL 20 unidades em 2 caixas
Opção B: 15 embalagens (1 por unidade) = TOTAL 20 unidades em 15 caixas
```

**Clarificação Necessária:** Qual é a correta?

**Por Quem:** Product Manager  
**Prioridade:** ALTA

---

### 15. Rate Limiting - Sem Detalhes de Implementação

**Problema:**

- ✅ `api-design.md` menciona: "100 requisições por minuto por IP"
- ❌ Sem middleware específico em `system-architecture.md`
- ❌ Sem tratamento de erro (429 Too Many Requests)
- ❌ Sem definição de exceções por perfil de acesso

**Impacto:** Ambiguidade na implementação

**Por Quem:** Backend Architect  
**Prioridade:** MENOR (implementável com biblioteca Redis/express-rate-limit)

---

### 16. Timezone Sistema - Manaus ou Belém?

**Problema:**

- ✅ `business-rules.md` menciona: "America/Manaus ou America/Belem"
- ❌ Sem clareza qual usar
- ❌ Sem especificação se há suporte a múltiplas zonas

**Cenário:**

```
Usuário em Manaus cria pedido às 23:00
Usuário em Belém vê o pedido com qual hora?
```

**Recomendação:** Usar UTC internamente, exibir conforme localidade do usuário.

**Decisão:** Usar sempre UTC no banco, timezone do usuário no frontend.

**Por Quem:** Tech Lead  
**Prioridade:** MENOR

---

### 17. Email Pessoa de Contato - Não Especificado

**Problema:**

- ✅ `business-rules.md` menciona "Nome da Pessoa de Contato"
- ❌ Sem campo de email da pessoa de contato
- ❌ Usa email da empresa para notificações?

**Impacto:** Ambiguidade em comunicações

**Solução:**
Adicionar `pessoaContatoEmail: STRING(255)` em Client (opcional)

**Por Quem:** Product Manager  
**Prioridade:** MENOR

---

### 18. Cancelamento de Pedidos - Sem Compensação

**Problema:**

- ✅ `business-rules.md` especifica: "PRODUÇÃO requer justificativa"
- ❌ Sem lógica de compensação:
  - Se pedido PRODUÇÃO é cancelado, produção já iniciada é perdida?
  - Há reembolso/crédito?
  - Há notificação para produção?

**Impacto:** Falta clareza operacional

**Recomendação:** Adicionar workflows de cancelamento com notificações.

**Por Quem:** Business Analyst  
**Prioridade:** MENOR

---

### 19. Paginação Sem Limite Máximo

**Problema:**

- ✅ `api-design.md` permite `limit: 100` como máximo
- ❌ Sem validação se `limit > 100` é rejeitado ou capped
- ❌ Sem default se `limit` não enviar

**Recomendação:**

```typescript
const limit = Math.min(query.limit || 10, 100);
```

**Por Quem:** Backend  
**Prioridade:** MENOR

---

### 20. Validação de CPF - Sem Algoritmo Especificado

**Problema:**

- ✅ `business-rules.md` menciona: "CPF válido (quando fornecido)"
- ❌ Sem especificação do algoritmo:
  - Valida formato (XXX.XXX.XXX-XX)?
  - Valida algoritmo de checksum?
  - Ambos?

**Recomendação:** Usar biblioteca `cpf-cnpj-validator` no backend.

**Por Quem:** Backend  
**Prioridade:** MENOR

---

## 🟢 MENORES (Complementar)

### 21. Campos Computados - Sem Trigger

**Problema:**

- `orders.totalValue` é calculado em tempo de query?
- Ou em trigger ao inserir/atualizar order_items?

**Recomendação:** Usar trigger ou computar na aplicação após insert/update.

---

### 22. Índices Não Mencionados em Algumas Tabelas

**Tabelas sem índices especificados:**

- Tabela User (não existe ainda)
- OrderItem (apenas PK mencionados)

---

### 23. Frase "Conforme necesário" Vaga

**Documentação tem frases vagas:**

- "A definir" (hospedagem)
- "Futuro" (muitas features)

**Recomendação:** Substituir por datas ou marcos claros.

---

### 24. Views SQL - Sem Estratégia de Atualização

**Problema:**

- `database-design.md` define views para relatórios
- ❌ Sem clareza: views são recalculadas a cada query?
- ❌ Sem consideração de performance em dados grandes

**Recomendação:** Documentar se usar materialized views ou queries dinâmicas.

---

## 📋 MATRIZ DE RESOLUÇÃO

| #   | Assunto                     | Severidade | Depende De | Responsável   | Semana |
| --- | --------------------------- | ---------- | ---------- | ------------- | ------ |
| 1   | Tabela Users                | 🔴         | -          | Backend Arch  | 0      |
| 2   | Múltiplos Contatos          | 🔴         | Product    | BA            | 0      |
| 3   | Lógica Embalagens           | 🔴         | Product    | BA            | 0      |
| 4   | IE Obrigatório B2B          | 🔴         | 1          | Backend       | 0      |
| 5   | Max 3 itens                 | 🔴         | -          | Backend       | 0      |
| 6   | Histórico Preços            | 🟠         | -          | BA            | 1      |
| 7   | Escopo independente do site | 🟠         | Product    | Tech Lead     | 0      |
| 8   | Relatório Status            | 🟠         | -          | BA            | 0      |
| 9   | Roles/Perms                 | 🟠         | 1          | Security Arch | 0      |
| 10  | Soft Delete                 | 🟠         | -          | DB Arch       | 0      |
| 11  | Estoque Modelo              | 🟠         | Product    | BA            | 0      |
| 12  | OrderNumber Format          | 🟠         | -          | Backend       | 0      |
| 13  | Audit Constraints           | 🟡         | 1          | DB Arch       | 1      |
| 14  | Cálc Embalagem              | 🟡         | Product    | BA            | 0      |
| 15  | Rate Limiting               | 🟡         | -          | Backend       | 1      |
| 16  | Timezone                    | 🟡         | -          | Backend       | 1      |
| 17  | Email Contato               | 🟡         | Product    | BA            | 1      |
| 18  | Cancel Workflow             | 🟡         | Product    | BA            | 1      |
| 19  | Paginação                   | 🟡         | -          | Backend       | 0      |
| 20  | Validar CPF                 | 🟡         | -          | Backend       | 0      |
| 21  | Campos Computed             | 🟢         | -          | Backend       | 1      |
| 22  | Índices                     | 🟢         | -          | DB Arch       | 1      |
| 23  | Datas Claras                | 🟢         | -          | Product       | 0      |
| 24  | Views Performance           | 🟢         | -          | Backend       | 1      |

---

## 🎯 PRÓXIMOS PASSOS

### Antes de Iniciar Implementação (Dia 1):

1. ✅ **Revisar com Product Manager:**
   - Itens #2, #7, #11, #14, #18, #17
   - Clarificar regras de negócio ambíguas

2. ✅ **Revisar com Tech Lead:**
   - Itens #1, #4, #5, #8, #9, #10, #12
   - Decidir arquitetura

3. ✅ **Atualizar Documentação:**
   - Incorporar decisões
   - Criar addendum com detalhes

### Durante Implementação (Semana 0-1):

- Impedir item #1 (Usuários) - BLOQUEADOR
- Impedir item #3 (Embalagens) - BLOQUEADOR
- Impedir item #5 (Max 3 items) - BLOQUEADOR
- Impedir item #8 (Producd Dates) - BLOQUEADOR

### Roadmap Ajustado:

```
Semana 0 (PRÉ-IMPLEMENTAÇÃO):
  - Reunião de clarificação (4h)
  - Atualizar documentação (2h)
  - Resolver 5 itens críticas (4h)

Semana 1-2:
  - Prosseguir com Phase 1 (Foundation)
  - Implementar tabela Users
  - Implementar lógica de embalagens
```

---

## ✍️ Recomendação Final

**🚨 NÃO INICIAR IMPLEMENTAÇÃO sem resolver:**

- ☐ Item #1 (Usuários)
- ☐ Item #3 (Embalagens)
- ☐ Item #4 (IE obrigatório)
- ☐ Item #5 (Max 3 itens)
- ☐ Item #8 (Datas de produção)

**Risco:** Retrabalho significativo se começar sem clareza.

---

**Próximas Ações:**

1. Compartilhar documento com stakeholders
2. Agendar reunião de clarificação (2h)
3. Incorporar feedback em addendum
4. Atualizar roadmap com correções

**Versão deste relatório:** 1.0  
**Data:** Abril de 2026
