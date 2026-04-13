# Regras de Negócio - Dica da Amazônia

## 📋 Regras Gerais do Sistema

## Escopo e Independência

Este sistema é um **dashboard interno de gestão empresarial**, desenvolvido exclusivamente para uso interno da empresa.

Ele possui:

- backend próprio
- banco de dados próprio
- API própria

O sistema **não possui integração com o site institucional da empresa**, não consome APIs do site e não depende dele para funcionamento.

O site público da empresa é utilizado **apenas como referência de identidade visual (cores e estilo da marca)**.

### 1. Modelo de Produção

- **Produção sob Demanda:** A empresa fabrica produtos conforme os pedidos chegam
- **Estoque Mínimo:** Mantém apenas quantidades mínimas em estoque para emergências
- **Impacto no Sistema:** O sistema deve priorizar a gestão de pedidos em aberto

### 2. Tipos de Clientes

O sistema deve distinguir dois tipos de cliente:

#### 2.1 B2B - Revenda

- Empresa ou pessoa jurídica que compra para revender
- CNPJ obrigatório
- Inscrição Estadual obrigatória
- Pode ter múltiplas pessoas de contato
- Condições comerciais específicas por cliente
- Histórico de compras para análise

#### 2.2 B2C - Consumo

- Consumidor final (pessoa física ou jurídica pequena)
- Via canais internos de atendimento e equipe comercial
- Dados simplificados de contato
- Pedidos de menor volume

### 3. Gestão de Produtos

**Produtos Disponíveis:**

1. **Café de Açaí**
   - Embalagem: Padrão
   - Fornecedor: Terceiros
   - Código: CAF-001

2. **Café de Açaí + Café Tradicional (Blend)**
   - Embalagem: Padrão
   - Fornecedor: Terceiros
   - Código: CAF-002

3. **Café de Milho**
   - Embalagem: Padrão
   - Fornecedor: Terceiros
   - Código: CAF-003

4. **Rende+**
   - Embalagem: Especial
   - Fornecedor: Terceiros
   - Código: REN-001

**Regras:**

- Cada produto tem um preço unitário definido
- Produtos podem estar ativados ou desativados
- Alterações de preço devem ter data de vigência
- Máximo de 3 produtos compartilham a mesma embalagem

### 4. Gestão de Embalagens

**Tipos de Embalagem:**

- **Embalagem Padrão:** Utilizada por 3 produtos (Café de Açaí, Blend, Café de Milho)
- **Embalagem Especial:** Utilizada exclusivamente por Rende+

**Regras de Embalagem:**

- Todas as embalagens são compradas em São Paulo
- Estoque mínimo deve ser mantido para cada tipo
- Quando estoque < mínimo, gera alerta (não bloqueia vendas)
- Custo unitário de embalagem é rastreado
- Histórico de compras é registrado

**Impacto em Pedidos:**

- Ao criar um pedido, o sistema calcula a quantidade de embalagens necessárias
- Embalagens reservadas não podem ser utilizadas para outro pedido
- Relatórios mostram consumo de embalagens

### 5. Dados Obrigatórios de Cliente

Para todos os tipos de cliente:

**Dados Corporativos:**

- ✅ CNPJ (único no sistema)
- ✅ Razão Social
- ✅ Nome Fantasia
- ✅ Tipo de Cliente (B2B ou B2C)

**Dados de Endereço:**

- ✅ Logradouro
- ✅ Número
- ✅ Complemento (opcional)
- ✅ Bairro
- ✅ Cidade
- ✅ UF
- ✅ CEP

**Dados de Contato:**

- ✅ Telefone (formato: (XX) XXXX-XXXX)
- ✅ WhatsApp (formato: (XX) 9XXXX-XXXX)
- ✅ Email (válido e único)

**Dados Comerciais:**

- ✅ Inscrição Estadual (obrigatório para B2B)
- ✅ Nome da Pessoa de Contato
- ✅ CPF da Pessoa de Contato (para traceability)

**Dados Administrativos:**

- ✅ Data de Cadastro
- ✅ Status (Ativo/Inativo)
- ✅ Observações (campo livre)

### 6. Gestão de Pedidos

**Criação de Pedido:**

- Cliente deve existir no sistema
- Mínimo 1 item de pedido
- Data do pedido é automática (data/hora do servidor)
- Status inicial: PENDENTE

**Status de Pedido:**

```
PENDENTE → PROCESSANDO → PRODUÇÃO → PREPARADO → ENVIADO → ENTREGUE
         → CANCELADO (a qualquer momento)
```

**Regras de Cancelamento:**

- Pedidos PENDENTE ou PROCESSANDO podem ser cancelados livremente
- Pedidos em PRODUÇÃO requerem justificativa
- Pedidos ENTREGUE não podem ser cancelados
- Cancelamento libera embalagens reservadas

**Itens de Pedido:**

- Cada item referencia um produto
- Quantidade deve ser > 0
- Preço unitário é capturado no momento do pedido (histórico)
- Cálculo de total: quantidade × preço unitário
- Um pedido pode ter múltiplos itens

**Cálculo de Embalagens:**

- Para 3 produtos que usam embalagem padrão: 1 embalagem por item
- Para Rende+: 1 embalagem especial por item
- As embalagens são reservadas quando pedido passa para PROCESSANDO

### 7. Relatórios e Análises

**Relatórios Essenciais:**

1. **Vendas por Período**
   - Filtro por data inicial/final
   - Exibe: total de vendas, número de pedidos, ticket médio
   - Segmentação por cliente

2. **Produtos Mais Vendidos**
   - Top 10 produtos
   - Volume total por produto
   - Tendências mensais

3. **Clientes Principais**
   - Ordenação por volume de compras
   - Faturamento acumulado
   - Frequência de pedidos

4. **Análise de Embalagens**
   - Consumo por tipo
   - Estoque atual
   - Previsão de reposição
   - Custo total de embalagens

5. **Status de Produção**
   - Pedidos em andamento
   - Tempo médio de produção
   - Pedidos atrasados

### 8. Integrações Externas

**Observação de escopo:**

- Não existe integração técnica com o site institucional
- O dashboard opera de forma totalmente independente

**Fornecedores e canais operacionais (futuro):**

- Dados de compra de café e embalagens
- Rastreamento de entradas de estoque
- Notificações por canais corporativos

### 9. Segurança e Validações

**Validações de Dados:**

- Email válido em formato
- CNPJ válido (algoritmo de validação)
- Inscrição Estadual válida para o estado
- CPF válido (quando fornecido)
- Telefone em formato brasileiro
- CEP em formato válido

**Regras de Acesso:**

- Vendedores visualizam apenas clientes atribuídos
- Gestores visualizam tudo
- Auditoria de alterações é importante
- Histórico de pedidos deve ser imutável

### 10. Conversão de Valores

**Moeda:** Real (R$)  
**Precisão:** 2 casas decimais  
**Cálculos:** Sempre usar arredondamento bancário (ROUND HALF EVEN)

### 11. Períodos e Datas

- **Ano Fiscal:** Janeiro a Dezembro
- **Trimestres:** Q1 (Jan-Mar), Q2 (Abr-Jun), Q3 (Jul-Set), Q4 (Out-Dez)
- **Timezone:** America/Manaus ou America/Belem (conforme localização)

### 12. Limitações Operacionais

- Máximo de 3 itens diferentes por pedido (para otimizar produção)
- Quantidade máxima por item: 10.000 unidades
- Mínimo por item: 1 unidade
- Atraso máximo de produção: 7 dias

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Última Atualização:** Abril de 2026
