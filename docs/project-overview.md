# Visão Geral do Projeto - Dica da Amazônia

## 📋 Sobre o Projeto

Sistema web de gestão interna para a empresa regional **Dica da Amazônia**, especializada na fabricação de produtos derivados de café de açaí.

### Objetivo Principal

Centralizar e automatizar a gestão de:

- Clientes (B2B e B2C)
- Produtos
- Embalagens
- Pedidos
- Relatórios de vendas

## Escopo e Independência

Este sistema é um **dashboard interno de gestão empresarial**, desenvolvido exclusivamente para uso interno da empresa.

Ele possui:

- backend próprio
- banco de dados próprio
- API própria

O sistema **não possui integração com o site institucional da empresa**, não consome APIs do site e não depende dele para funcionamento.

O site público da empresa é utilizado **apenas como referência de identidade visual (cores e estilo da marca)**.

## 🏢 Sobre a Empresa

**Nome:** Dica da Amazônia  
**Segmento:** Alimentos - Bebidas à base de café de açaí  
**Modelo de Negócio:** Produção sob demanda com estoque mínimo  
**Site institucional (referência visual):** https://dicadaamazonia.com.br/

### Característica Operacional Importante

A empresa trabalha com **produção quase totalmente sob demanda**, mantendo um estoque mínimo de produtos acabados. Isso significa que a maioria dos pedidos é fabricada conforme os pedidos chegam.

## 📦 Portfólio de Produtos Atual

| Produto                         | Descrição                            | Embalagem |
| ------------------------------- | ------------------------------------ | --------- |
| Café de Açaí                    | Bebida à base de café com açaí       | Padrão    |
| Café de Açaí + Café Tradicional | Blend café açaí com café tradicional | Padrão    |
| Café de Milho                   | Bebida à base de café com milho      | Padrão    |
| Rende+                          | Produto complementar premium         | Especial  |

**Observação:** 3 produtos (primeiros da lista) compartilham a mesma embalagem. Rende+ possui embalagem diferenciada.

## 🎯 Escopo Funcional

### Módulos Principais

1. **Gestão de Clientes**
   - Cadastro e manutenção de dados corporativos e de contato
   - Classificação por tipo (B2B revenda ou B2C consumo)
   - Histórico de transações

2. **Gestão de Produtos**
   - Catálogo de produtos disponíveis
   - Informações técnicas e de estoque
   - Relação com embalagens

3. **Gestão de Embalagens**
   - Cadastro de tipos de embalagem
   - Rastreamento de compras (fornecedor: São Paulo)
   - Controle de estoque mínimo

4. **Gestão de Pedidos**
   - Criação e acompanhamento de pedidos
   - Integração com itens de pedido
   - Status e histórico

5. **Itens de Pedido**
   - Detalhe dos produtos por pedido
   - Quantidade e preço unitário

6. **Relatórios**
   - Vendas por período
   - Produtos mais vendidos
   - Clientes principais
   - Análise de embalagens

## 💼 Público-Alvo do Sistema

- **Equipe de Vendas:** Gestão de clientes e pedidos
- **Equipe Administrativa:** Controle de estoque e embalagens
- **Gestores:** Acompanhamento de relatórios e métricas
- **Equipe de Produção:** Visualização de pedidos pendentes

## 📊 Benefícios Esperados

- ✅ Centralização de informações de clientes
- ✅ Melhor controle de pedidos e produção
- ✅ Rastreamento eficiente de embalagens
- ✅ Relatórios de vendas em tempo real
- ✅ Redução de erros operacionais
- ✅ Alinhamento visual com a identidade da marca

## 🔄 Fluxo Geral de Negócio

```
Cliente → Pedido (via equipe comercial interna) → Processamento
  ↓
Produção (sob demanda) → Embalagem → Entrega → Relatório
```

## 📝 Próximas Etapas

1. Implementação do backend (API REST)
2. Implementação do frontend (Dashboard React)
3. Testes e validação
4. Deploy em produção
5. Treinamento da equipe

---

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Planejamento
