# ✅ CHECKLIST PRÉ-IMPLEMENTAÇÃO

**Data Início:** \_**\_/\_\_**/2026  
**Data Conclusão:** \_**\_/\_\_**/2026  
**Responsável:** **\*\***\_\_\_\_**\*\***

---

## 🔴 CRÍTICOS - RESOLVER HOJE (4-6h)

### #1: Tabela de Usuários

- [ ] Schema `User` definido com campos: id, email, password, name, role, isActive, createdAt, updatedAt
- [ ] Roles enum definido: admin, gestor, vendedor, operador
- [ ] JWT setup documentado (claim structure)
- [ ] Hash strategy definido (bcrypt algoritmo)
- [ ] Arquivo `database-design.md` atualizado, seção User adicionada
- [ ] ✅ VALIDADO por: Tech Lead

### #2: Lógica de Embalagens (Reserva)

- [ ] `Packaging` tabela: campo `reservedStock: INT` adicionado
- [ ] `OrderItem` tabela: campo `packaging_reserved: INT` adicionado
- [ ] Fluxo documentado: PENDING → PROCESSING (reserva) → CANCELED (libera)
- [ ] SQL triggers/constraints definidos
- [ ] `business-rules.md` seção 13 atualizada com exemplos
- [ ] Service layer para reserva mapeado em `system-architecture.md`
- [ ] ✅ VALIDADO por: Database Architect + Backend Lead

### #3: Validação IE B2B

- [ ] Constraint SQL definido: `CHECK (type = 'B2C' OR inscrEstadual NOT NULL)`
- [ ] Validação em service layer especificada
- [ ] Algoritmo de validação de IE definido (qual estado? qual formato?)
- [ ] Teste de validação criado para IE por estado
- [ ] `database-design.md` campo `inscrEstadual` comentado
- [ ] ✅ VALIDADO por: Backend Architect

### #4: Máximo 3 Itens por Pedido

- [ ] Validação em POST /orders adicionada: `if (items.length > 3) throw Error`
- [ ] Teste unitário criado
- [ ] Mensagem de erro definida
- [ ] `api-design.md` POST /orders atualizado com validação
- [ ] Constraint em BD considerado (ou deixar em app?)
- [ ] ✅ VALIDADO por: Backend Lead

### #5: Campos de Produção em Order

- [ ] `Order.plannedEndDate: DATE` adicionado
- [ ] `Order.actualEndDate: DATE` adicionado
- [ ] `Order.productionStartedAt: DATETIME` adicionado
- [ ] `Order.isOverdue: BOOLEAN (computed)` considerado
- [ ] `database-design.md` tabela Order atualizada
- [ ] Lógica de cálculo de atraso documentada
- [ ] Relatório "Status de Produção" now implementável
- [ ] ✅ VALIDADO por: Database Architect

---

## 🟠 IMPORTANTES - CLARIFICAÇÃO COM PRODUTO (3-4h)

### #6: Parâmetro "item" = o quê?

**Decisão Necessária:**

- [ ] Confirmado: 1 embalagem por LINHA do pedido (não por unidade)
- [ ] Exemplo documentado: 10 un. = 1 linha = 1 embalagem
- [ ] Confirmado: Teste de cenário (10un + 5un = 2 linhas = 2 embalagens)
- [ ] `business-rules.md` seção atualizada com definição clara
- [ ] ✅ VALIDADO por: Product Manager

### #7: Estoque de Produtos - Bloqueia?

**Decisão Necessária:**

- [ ] Confirmado: NÃO bloqueia (sob demanda)
- [ ] Campo `product.stock` é apenas informativo
- [ ] Teste: criar pedido com stock = 0 → DEVE FUNCIONAR
- [ ] Documentado em `business-rules.md` seção 14
- [ ] API não tem validação de stock em POST /orders
- [ ] ✅ VALIDADO por: Product Manager

### #8: Independência do Site Institucional

**Decisão Necessária:**

- [ ] Confirmado: sistema 100% interno e independente
- [ ] Confirmado: sem consumo de APIs do site institucional
- [ ] Confirmado: sem sincronização de dados com o site público
- [ ] Confirmado: site usado apenas para identidade visual
- [ ] `roadmap.md` ajustado para reforçar escopo interno independente
- [ ] ✅ VALIDADO por: Product Manager

### #9: OrderNumber - Sequência Como?

**Decisão Necessária:**

- [ ] Confirmado: Formato PED-YYYY-NNNNNN
- [ ] Reset anual: 01/01/cada ano → contador 000001
- [ ] Padding: sempre 6 dígitos?
- [ ] Unique constraint em BD: sobre (year, sequence)?
- [ ] Service layer para geração mapeado
- [ ] Teste: virar ano → contador reset
- [ ] ✅ VALIDADO por: Tech Lead

### #10: Roles Completos - Quem Acessa Quê?

**Decisão Necessária:**

- [ ] Lista completa de roles: admin, gestor, vendedor, operador, outros?
- [ ] Matriz RBAC criada (role × endpoint)
- [ ] Documentado quem pode fazer o quê
- [ ] Exceção: vendedor vê só clientes atribuídos → tabela mapping
- [ ] `system-architecture.md` seção "RBACMiddleware" atualizada
- [ ] ✅ VALIDADO por: Product Manager + Security Architect

### #11: Múltiplos Contatos B2B - MVP ou Tabela?

**Decisão Necessária:**

- [ ] MVP: manter 1 contato por cliente ✅
- [ ] OU criar tabela `ContactPerson` com FK client_id
- [ ] Se tabela: campos definidos (id, name, cpf, email, phone, isPrimary)
- [ ] `database-design.md` atualizado
- [ ] API atualizada se necessário
- [ ] ✅ VALIDADO por: Product Manager

### #12: Soft Delete Policy - Tudo Soft?

**Decisão Necessária:**

- [ ] Clientes: soft delete (isActive = false) ✅
- [ ] Produtos: soft delete (isActive = false) ✅
- [ ] Embalagens: soft delete (isActive = false) ✅
- [ ] Pedidos: ≠ deletado, apenas status CANCELADO ✅
- [ ] Itens de pedido: se pedido deleted, cascade ✅
- [ ] `database-design.md` seção soft delete actualizada
- [ ] ✅ VALIDADO por: Database Architect

---

## 🟡 ATENÇÃO - Pode impactar

### #13: Histórico de Preços

- [ ] MVP: sem versionamento (apenas unitPrice em OrderItem)
- [ ] Futuro (v2): tabela ProductPriceHistory com validFrom/validTo
- [ ] Teste: pedido com preço A, depois muda para B, relatório usa correto?
- [ ] ✅ VALIDADO por: Product Manager

### #14: Rate Limiting

- [ ] Implementação: express-rate-limit + Redis (opcional)
- [ ] Limite: 100 req/min por IP
- [ ] Resposta: 429 Too Many Requests
- [ ] Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- [ ] `system-architecture.md` middleware adicionado
- [ ] ✅ VALIDADO por: Backend Architect

### #15: Timezone

- [ ] Decisão: UTC no BD, conversão para localidade no FE
- [ ] Todos times armazenados em UTC (+0)
- [ ] Frontend converte conforme user locale
- [ ] `system-architecture.md` atualizado
- [ ] ✅ VALIDADO por: Tech Lead

### #16: Email Pessoa de Contato

- [ ] Novo campo: `pessoaContatoEmail: STRING(255) NULL` adicionado
- [ ] Validação: email válido (se fornecido)
- [ ] ✅ VALIDADO por: Product Manager

### #17: Cancelamento de Pedidos - Workflow

- [ ] PENDENTE→CANCELADO: liberado sem questões
- [ ] PROCESSANDO→CANCELADO: liberado com justificativa
- [ ] PRODUÇÃO→CANCELADO: requer justificativa
- [ ] ENTREGUE→CANCELADO: BLOQUEADO
- [ ] Notificação de cancelamento → time produção? cliente?
- [ ] ✅ VALIDADO por: Product Manager

### #18: Paginação - Limite Máximo

- [ ] Code: `Math.min(limit || 10, 100)` implementado
- [ ] Teste: limit=1000 → retorna max 100
- [ ] Default: 10 itens se não enviar
- [ ] ✅ VALIDADO por: Backend Lead

---

## 🟢 MENORES - Complementar

### #19: Validação de CPF

- [ ] Biblioteca: `cpf-cnpj-validator` ou similar instalada
- [ ] Validação: formato + checksum
- [ ] Teste: CPF válido e inválido
- [ ] ✅ VALIDADO por: Backend

### #20: Campos Computados

- [ ] `Order.totalValue`: trigger ou service layer?
- [ ] Decisão: service layer recalcula após insert/update
- [ ] Teste: atualizar OrderItem → totalValue recalcula
- [ ] ✅ VALIDADO por: Backend

### #21:Índices Completos

- [ ] Tabela `users`: índices adicionados
- [ ] Tabela `order_items`: índices revisados
- [ ] Índices compostos considerados (performance)
- [ ] ✅ VALIDADO por: DBA

### #22: Datas Vagas

- [ ] "A definir" → datas específicas ou marcos
- [ ] "Futuro" → versão específica (v2, Q2, etc.)
- [ ] `roadmap.md` atualizado com datas
- [ ] ✅ VALIDADO por: Tech Lead

---

## 📄 DOCUMENTAÇÃO - Arquivos Atualizados

### database-design.md

- [ ] Tabela `User` adicionada (seção 0)
- [ ] Campo `packaging.reservedStock` adicionado
- [ ] Campos `order.plannedEndDate`, `order.actualEndDate` adicionados
- [ ] Constraint IE B2B adicionado
- [ ] Soft delete policy documentada
- [ ] Índices revisados
- [ ] ✅ Revisor: Database Architect

### business-rules.md

- [ ] Seção 13: "Cálculo de Embalagens - Detalhado" adicionada
- [ ] Seção 14: "Estoque de Produtos - Informativo" adicionada
- [ ] Decisão sobre múltiplos contatos documentada
- [ ] OrderNumber format especificado
- [ ] Validação IE B2B clarificada
- [ ] ✅ Revisor: Business Analyst

### api-design.md

- [ ] POST /orders: validação máximo 3 itens adicionada
- [ ] Rate limiting headers documentados
- [ ] Resposta 429 adicionada
- [ ] Endpoints de usuários/auth claros
- [ ] ✅ Revisor: Backend Architect

### system-architecture.md

- [ ] Seção "RBACMiddleware" adicionada
- [ ] Seção "RateLimiter" adicionada
- [ ] User table mencionada
- [ ] Fluxo de autenticação documentado
- [ ] ✅ Revisor: Tech Lead

### development-roadmap.md

- [ ] Semana 0 (PRÉ-IMPLEMENTAÇÃO) adicionada
- [ ] Gate de aprovação documentado
- [ ] Timeline ajustada se necessário
- [ ] ✅ Revisor: Tech Lead

### ARCHITECTURE-DECISIONS.md (NOVO)

- [ ] 10 decisões críticas documentadas
- [ ] Justificativa de cada decisão
- [ ] Impactos identificados
- [ ] Referências aos Documentos
- [ ] ✅ Criador: Tech Lead

---

## 📊 GATE FINAL - BLOCKER P/ INICIAR FASE 1

**Todos os itens abaixo devem ter ✅ antes de começar**

- [ ] **Todos 5 CRÍTICOS resolvidos**
- [ ] **Cliente aprovou todas as decisões importantes**
- [ ] **6 documentos atualizados e revisados**
- [ ] **Decisões documentadas em ARCHITECTURE-DECISIONS.md**
- [ ] **Roadmap revisto (Semana 0 adicionada)**
- [ ] **Git: todos commits feitos e pushed**
- [ ] **Reunião de kick-off agendada (Seg/Ter próximo)**

---

## 👥 ASSINATURAS DE APROVAÇÃO

| Papel              | Nome           | Data       | Assinatura           |
| ------------------ | -------------- | ---------- | -------------------- |
| Tech Lead          | \***\*\_\*\*** | **/**/\_\_ | \***\*\_\_\_\_\*\*** |
| Product Manager    | \***\*\_\*\*** | **/**/\_\_ | \***\*\_\_\_\_\*\*** |
| Backend Architect  | \***\*\_\*\*** | **/**/\_\_ | \***\*\_\_\_\_\*\*** |
| Database Architect | \***\*\_\*\*** | **/**/\_\_ | \***\*\_\_\_\_\*\*** |
| Product Owner      | \***\*\_\*\*** | **/**/\_\_ | \***\*\_\_\_\_\*\*** |

---

## 📅 TIMELINE REAL

| Fase                  | Data Início    | Data Fim       | Status |
| --------------------- | -------------- | -------------- | ------ |
| Reunião Clarificação  | **_/_**/\_\_\_ | **_/_**/\_\_\_ | ☐      |
| Atualiz. Documentação | **_/_**/\_\_\_ | **_/_**/\_\_\_ | ☐      |
| Review Cruzado        | **_/_**/\_\_\_ | **_/_**/\_\_\_ | ☐      |
| Git Commit & Push     | **_/_**/\_\_\_ | **_/_**/\_\_\_ | ☐      |
| **BLOCKER LIBERADO**  | **_/_**/\_\_\_ | -              | ☐      |

---

**Última Atualização:** **_/_**/2026  
**Próxima Revisão:** Após reunião de clarificação  
**Status:** 🚨 BLOQUEADO até resolução completa
