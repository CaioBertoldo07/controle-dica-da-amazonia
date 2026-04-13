# 🔧 PLANO DE AÇÃO - Resolução de Inconsistências

**Objetivo:** Resolver 24 inconsistências para permitir implementação  
**Timeline:** 2-3 dias de trabalho  
**Resultado:** Documentação clarificada + schema ajustado

---

## FASE 1: REUNIÃO DE CLARIFICAÇÃO (2h)

**Participantes:**

- Product Manager / Cliente
- Tech Lead
- Backend Architect
- Database Architect

**Agenda:**

### Bloco 1: Regras de Negócio Críticas (30min)

| Questão                              | Opções                                         | Recomendação     |
| ------------------------------------ | ---------------------------------------------- | ---------------- |
| **#2: Múltiplos contatos B2B?**      | A) MVP com 1 contato / B) Tabela ContactPerson | A (MVP)          |
| **#7: Escopo independente do site?** | A) Parcial / B) Totalmente independente        | B (independente) |
| **#8: Embalagem "item"?**            | A) 1 por linha / B) 1 por unidade              | A (1 por linha)  |
| **#11: Estoque bloqueia pedido?**    | A) Sim bloqueia / B) Não, apenas informativo   | B (sob demanda)  |
| **#14: 1 embalagem por unidade?**    | Deve ser 1 por UNIDADE ou 1 por ITEM?          | **CONFIRMAR**    |

### Bloco 2: Arquitetura & Segurança (30min)

| Questão                     | Opções                                      | Recomendação     |
| --------------------------- | ------------------------------------------- | ---------------- |
| **#1: Tabela Users?**       | A) Com role enum / B) Com permissões matrix | A (simples)      |
| **#9: Roles completas?**    | Admin, Gestor, Vendedor, Operador?          | **LISTAR TODOS** |
| **#12: OrderNumber**?       | A) PED-YYYY-NNN / B) PED-NNN global         | A (com ano)      |
| **#4: IE obrigatório B2B?** | Constraint de BD ou validação?              | Ambas            |

### Bloco 3: Dados & Relatórios (1h)

| Questão                        | Ação                                    | Responsável |
| ------------------------------ | --------------------------------------- | ----------- |
| **#8: Campos de produção**     | Adicionar plannedEndDate, actualEndDate | Tech Lead   |
| **#6: Histórico de preços**    | MVP sem versionamento, v2 com           | Product     |
| **#17: Email pessoa contato**  | Adicionar campo opcional                | Tech Lead   |
| **#18: Workflow cancelamento** | Versão 1 básico, v2 com notificações    | Product     |

---

## FASE 2: ATUALIZAÇÃO DE DOCUMENTAÇÃO (3-4h)

### Task 2.1: Atualizar `database-design.md`

**Responsável:** Database Architect  
**Tempo:** 1h

Adicionar:

```diff
+### 0. User (Usuários)
+
+**Tabela:** `users`
+
+| Campo | Tipo | Constraint | Descrição |
+| id | UUID | PRIMARY KEY | Identificador único |
+| email | STRING(255) | UNIQUE, NOT NULL | Email login |
+| password | STRING(255) | NOT NULL | Hash bcrypt |
+| name | STRING(100) | NOT NULL | Nome do usuário |
+| role | ENUM | NOT NULL | admin, gestor, vendedor, operador |
+| isActive | BOOLEAN | DEFAULT TRUE | Ativo/Inativo |
+| createdAt | DATETIME | NOT NULL | Data criação |
+| updatedAt | DATETIME | NOT NULL | Última modificação |

+ Adicionar em Packaging:
+ - reservedStock: INT (DEFAULT 0)

+ Adicionar em Order:
+ - plannedEndDate: DATE
+ - actualEndDate: DATE
+ - productionStartedAt: DATETIME

+ Adicionar constraint em Client:
+   CHECK (type = 'B2C' OR (type = 'B2B' AND inscrEstadual IS NOT NULL))
```

### Task 2.2: Atualizar `business-rules.md`

**Responsável:** Business Analyst  
**Tempo:** 45min

Adicionar seção pós-#12:

```markdown
### 13. Cálculo de Embalagens - Detalhado

**Definição Crítica: "Item" = 1 linha do pedido**

Exemplo:
```

Pedido:

- 10 unidades Café Açaí (1 item/linha) = RESERVA 10 embalagens padrão
- 5 unidades Café Milho (1 item/linha) = RESERVA 5 embalagens padrão

Total: 2 linhas x embalagens necessárias = 15 embalagens padrão reservadas

```

**Fluxo de Reserva:**
1. Pedido PENDENTE: sem reserva
2. Pedido → PROCESSANDO: reserva embalagens
   - packaging.reservedStock += quantidade
   - packaging.availableStock = currentStock - reservedStock
3. Pedido → CANCELADO: libera embalagens
   - packaging.reservedStock -= quantidade
4. Pedido → ENTREGUE: mantém consumo (reserva não retorna)

**Validação:**
```

Se packaging.availableStock < quantidade_necessária:
→ AVISO: "Embalagem com estoque abaixo do mínimo"
→ Permite criar pedido (sob demanda)
→ Notifica admin para compra urgente

```

### 14. Estoque de Produtos - Informativo

Empresa trabalha com **produção 100% sob demanda**.
Campo `product.stock` é apenas **informativo** (para referência operacional).

**Sistema ≠ bloqueia pedidos por estoque de produtos**

Validações:
- ✅ Permite criar pedido com estoque = 0
- ✅ Permite criar pedido com estoque negativo (produção sob demanda)
- ❌ Não há check de stock no POST /orders
- ✅ Relatórios mostram stock para awareness operacional
```

### Task 2.3: Atualizar `api-design.md`

**Responsável:** Backend Architect  
**Tempo:** 1h

Adicionar validações em POST /orders:

```diff
+### POST /orders - Validações
+
+- Check: items.length <= 3 (máximo 3 itens)
+- Check: cada item.quantity <= 10000
+- Check: cada item.quantity >= 1
+- Check: client_id existe e isActive=true
+- Check: cada product_id existe e isActive=true
```

Adicionar em Headers Response:

```diff
+X-RateLimit-Limit: 100
+X-RateLimit-Remaining: 99
+X-RateLimit-Reset: 1713607200
```

### Task 2.4: Atualizar `system-architecture.md`

**Responsável:** Tech Lead  
**Tempo:** 45min

Adicionar seção "Middlewares":

```diff
+### Middlewares Específicos
+
+1. **RateLimiter Middleware**
+   - 100 req/min por IP
+   - Retorna 429 se excedido
+   - Exceptions: admin endpoints (futuro)
+
+2. **AuthMiddleware**
+   - Valida JWT token
+   - Popula req.user com dados
+   - Retorna 401 se inválido
+
+3. **RBACMiddleware**
+   - Verifica role do usuário
+   - Restringe acesso por endpoint
+   - Retorna 403 se sem permissão
```

### Task 2.5: Criar Arquivo de Decisões

**Responsável:** Tech Lead  
**Tempo:** 30min

Novo arquivo: `ARCHITECTURE-DECISIONS.md`

```markdown
# Decisões de Arquitetura Tomadas

## 1. Múltiplos Contatos B2B

**Decisão:** MVP com 1 contato por cliente
**Justificativa:** Simplifica implementação inicial
**Futuro:** v2 com tabela ContactPerson

## 2. Independência do Site Institucional

**Decisão:** Sem integração em qualquer fase do projeto
**Escopo:** Dashboard interno com backend, API e banco próprios
**Website:** Uso exclusivo como referência visual da marca

## 3. Embalagens - "Item" = Linha do Pedido

**Decisão:** 1 embalagem por LINHA (não por unidade)
**Exemplo:** 10 un. Café = 1 linha = 1 embalagem
**Implementação:** Cálculo em orderService.reservePackaging()

## 4. Estoque de Produtos

**Decisão:** Puramente informativo
**Validação:** Sistema NUNCA bloqueia por stock
**Motivo:** Empresa é sob demanda

## 5. Soft Delete Policy

**Decisão:** Soft delete para Clients, Products, Packagings
**Hard Delete:** Nunca
**Orders:** Apenas status CANCELADO, nunca deletado

## 6. OrderNumber Format

**Decisão:** PED-YYYY-NNNNNN (ex: PED-2024-000001)
**Reset:** Anualmente em 01/janeiro (sequence por ano)
**Implementation:** Stored procedure ou service layer

## 7. Roles de Usuário

**Decisão:** 4 roles iniciais

- admin: full access
- gestor: access + relatórios
- vendedor: clientes atribuídos + criar pedidos
- operador: read-only produtor

## 8. Validação IE B2B

**Decisão:** Constraint em BD + validação em aplicação
**BD:** CHECK (type = 'B2C' OR inscrEstadual NOT NULL)
**App:** Service valida estado correto da IE

## 9. Histórico de Preços

**Decisão:** MVP sem versionamento, v2 implementa
**MVP:** Apenas unitPrice em OrderItem (capturado)
**Futuro:** ProductPriceHistory table

## 10. Timezone

**Decisão:** UTC no BD, localidade do usuário no FE
**Implementação:** Field createdAt em UTC, conversão no frontend
```

---

## FASE 3: VALIDAÇÃO & MERGE (1-2h)

### Task 3.1: Review Cruzado

**Quem:** Tech Lead + Backend Arch + BA  
**Tempo:** 1h
**Checklist:**

- ☐ database-design.md é consistente com api-design.md?
- ☐ api-design.md segue business-rules.md?
- ☐ system-architecture.md cobre novos middlewares?
- ☐ roadmap precisa ser atualizado?

### Task 3.2: Comitamento em Git

**Responsável:** Tech Lead  
**Branch:** `docs/fix-inconsistencies`  
**Commit:**

```
docs: resolve 24 inconsistencies before implementation

- Add Users table schema
- Define packaging reservation logic
- Add production date fields to Order
- Clarify IE validation for B2B clients
- Max 3 items per order validation
- Role-based access control matrix
- Order number sequence (PED-YYYY-NNNNNN)
- Soft delete policy for all entities
- Architecture decisions documented

Type: Breaking (affects DB schema)
Impact: Must deploy migrations before backend code
```

### Task 3.3: Atualizar Roadmap

**Responsável:** Tech Lead  
**Tempo:** 30min

Adicionar na Semana 0:

```markdown
## SEMANA 0 (PRÉ-IMPLEMENTAÇÃO)

### 0.1 Documentação & Decisões (2-3 dias)

- [ ] Reunião de clarificação (2h)
- [ ] Atualizar 5 docs principais (3h)
- [ ] Review cruzado (1h)
- [ ] Comitamento (30min)

**Gate:** Documentação aprovada pelo cliente

### 0.2 Preparação de Ambiente (1-2 dias)

- [ ] Setup repositório (1h)
- [ ] Configurar CI/CD (1h)
- [ ] Preparar ambiente de dev (30min)
```

---

## FASE 4: ACOMPANHAMENTO (Semanal)

**Sprint Planning Checklist:**

- ☐ Todos os stories cobrem decisões documentadas?
- ☐ Testes cobrem validações mencionadas?
- ☐ Database migrations estão em ordem?
- ☐ Endpoints refletem API design?

---

## 📊 ESTIMATIVAS FINAIS

| Task                      | Responsável    | Tempo        | Data       |
| ------------------------- | -------------- | ------------ | ---------- |
| Reunião clarificação      | Product + Tech | 2h           | Hoje       |
| database-design.md        | DB Arch        | 1h           | Hoje       |
| business-rules.md         | BA             | 45min        | Hoje       |
| api-design.md             | Backend        | 1h           | Hoje       |
| system-architecture.md    | Tech Lead      | 45min        | Hoje       |
| ARCHITECTURE-DECISIONS.md | Tech Lead      | 30min        | Hoje       |
| Review cruzado            | Tech + BA      | 1h           | Amanhã     |
| Git commit                | Tech Lead      | 30min        | Amanhã     |
| Roadmap atualizado        | Tech Lead      | 30min        | Amanhã     |
| **TOTAL**                 | **8 pessoas**  | **~8 horas** | **2 dias** |

---

## ✅ GATE ANTES DE INICIAR FASE 1

- ☐ Todos os 5 críticas resolvidas?
- ☐ Cliente aprovou decisões?
- ☐ Documentação atualizada?
- ☐ Roadmap revisto?
- ☐ Git commits feitos?

**Se SIM em todos → LIBERAR FASE 1**  
**Se NÃO em qualquer → BLOQUEAR até resolver**

---

**Versão:** 1.0  
**Status:** PRONTO PARA EXECUÇÃO  
**Próximo:** Agendar reunião de clarificação
