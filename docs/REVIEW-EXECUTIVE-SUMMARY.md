# ⚡ SUMÁRIO EXECUTIVO - Inconsistências Encontradas

**Status:** 🚨 **24 INCONSISTÊNCIAS IDENTIFICADAS**  
**Bloqueadores Críticos:** 5 → Devem ser resolvidos ANTES de iniciar  
**Questões Importantes:** 8 → Devem ser clarificadas  
**Atenções:** 7 → Podem impactar se não resolvidas  
**Menores:** 4 → Complementares

---

## 🔴 5 CRÍTICOS - RESOLVER IMEDIATAMENTE

### 1️⃣ **Tabela de Usuários Não Definida**

- **Onde:** API menciona `/auth/login` → usuários onde?
- **Impacto:** Impossível fazer autenticação
- **Ação:** Criar schema `User` com email, password, role

### 2️⃣ **Múltiplos Contatos B2B Não Mapeados**

- **Onde:** Business-rules diz "múltiplos", BD tem apenas 1
- **Impacto:** Clientes B2B quebram regra
- **Ação:** Criar tabela `ContactPerson` ou confirmar simplificação

### 3️⃣ **Lógica de Reserva de Embalagens Indefinida**

- **Onde:** Sem campos nas tabelas para rastrear reservas
- **Impacto:** Controle de estoque de embalagem impossível
- **Ação:** Adicionar `packaging_reserved`, `reservedStock`

### 4️⃣ **Inscrição Estadual B2B Sem Validação**

- **Onde:** Definida como NULLABLE mas "obrigatório para B2B"
- **Impacto:** Sistema aceita B2B sem IE
- **Ação:** Adicionar constraint de validação condicional

### 5️⃣ **Máximo 3 Itens por Pedido Sem Enforcement**

- **Onde:** Mencionado em business-rules mas sem validação
- **Impacto:** Sistema aceita pedidos com 10+ itens
- **Ação:** Implementar validação em POST /orders

---

## 🟠 8 IMPORTANTES - ESCLARECER COM PRODUTO/CLIENTE

### 6️⃣ **Separação do Site Institucional - Está Explícita?**

- O escopo de independência está documentado em todos os arquivos principais?

### 7️⃣ **Estoque de Produtos - Bloqueia ou Informa?**

- Empresa é sob demanda, mas há campo stock
- Sistema rejeita pedido com estoque=0?

### 8️⃣ **"1 embalagem por item" - Significa o quê?**

- 1 por linha de pedido OU 1 por unidade de produto?

### 9️⃣ **Roles e Permissões - Qual a Matriz Completa?**

- Admin, Gestor, Vendedor... mais alguém?
- Vendedor acessa quais endpoints?

### 🔟 **Múltiplas Pessoas de Contato B2B - MVP ou Versão 1?**

- Implementar já ou v2?

### 1️⃣1️⃣ **Soft Delete vs Hard Delete - Política Clara?**

- Clientes soft delete? Produtos? Pedidos?

### 1️⃣2️⃣ **Formato OrderNumber - Sequência Como?**

- PED-2024-001? Reinicia anual? Global?

### 1️⃣3️⃣ **Relatório "Status de Produção" - Acrescimo de Campos?**

- Precisa de plannedEndDate, actualEndDate

---

## 🟡 7 DE ATENÇÃO - Podem impactar

| #   | Assunto                    | Solução                                 |
| --- | -------------------------- | --------------------------------------- |
| 14  | Histórico Preços           | Criar ProductPriceHistory ou field JSON |
| 15  | Rate Limiting Sem Detalhes | Use express-rate-limit + Redis          |
| 16  | Timezone Indefinido        | Use UTC no BD, timezone do user no FE   |
| 17  | Email Pessoa Contato       | Adicionar campo opcional                |
| 18  | Cancelamento Sem Workflow  | Adicionar notificações                  |
| 19  | Paginação Sem Limite       | Math.min(limit, 100)                    |
| 20  | CPF Sem Algoritmo          | Usar lib de validação                   |

---

## 📊 DISTRIBUIÇÃO DE ESFORÇO

```
Resolução Crítica        → 4-6 horas (Debate + atualização doc)
Questões para Produto    → 2-3 horas (Reunião)
Atualização Documentação → 3-4 horas (Writer)
Ajuste Roadmap          → 1-2 horas (Tech Lead)
─────────────────────────────────────
TOTAL PRÉ-IMPLEMENTAÇÃO → ~12-15 horas (2-3 dias)
```

---

## ✅ NÃO INICIAR IMPLEMENTAÇÃO SEM:

1. ☐ Tabela de usuários definida
2. ☐ Lógica de embalagens documentada
3. ☐ Regras de validação B2B/B2C clarificadas
4. ☐ Máximo 3 itens especificado em API
5. ☐ Datas de produção adicionadas ao schema
6. ☐ Documento atualizado com decisões

---

## 📅 TIMELINE RECOMENDADA

```
Hoje (Dia 1):
  08:00 - Revisar este documento
  09:00 - Reunião com Product (1h)
  10:30 - Reunião com Tech Lead (1h)
  12:00 - Atualizar documentação (2h)
  14:00 - Validar mudanças (1h)

Amanhã (Dia 2):
  ✅ PRONTO para iniciar Semana 1 (Foundation Phase)
```

---

## 🎯 AÇÃO IMEDIATA

👤 **Product Manager:**

- Revisar items #7, #8, #9, #11, #18
- Providenciar clarificação HOJE

👤 **Tech Lead:**

- Revisar items #1, #3, #4, #5, #14
- Atualizar schema database HOJE

👤 **Developer Lead:**

- Revisar items #2, #6, #10, #12, #13, #15, #16
- Preparar sprints com base em decisões

---

**Status:** BLOQUEADO ATÉ RESOLUÇÃO  
**Próxima Revisão:** Após reunião de clarificação  
**Responsável:** Tech Lead + Product Manager
