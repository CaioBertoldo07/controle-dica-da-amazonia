# Diretrizes de UI/UX - Dica da Amazônia

## 🎨 Identidade Visual

O sistema herda a identidade visual da Dica da Amazônia, com forte inspiração na natureza amazônica e café.

### Paleta de Cores

> Cores implementadas em `frontend/src/styles/variables.css` — Atualizado em Abril 2026.

#### Cores Primárias

| Token CSS               | Hex       | Uso                                            |
| ----------------------- | --------- | ---------------------------------------------- |
| `--color-primary`       | `#2d5a27` | Botões primários, borda ativa da sidebar       |
| `--color-primary-dark`  | `#1e3d1c` | Hover de botões primários                      |
| `--color-primary-light` | `#4a7c43` | Acentos, estados hover leves                   |
| `--color-accent`        | `#c8a84b` | CTAs especiais, destaques dourados             |

#### Cores de Layout

| Token CSS               | Hex       | Uso                                            |
| ----------------------- | --------- | ---------------------------------------------- |
| `--color-sidebar-bg`    | `#253d22` | Fundo da sidebar e header                      |
| `--color-header-bg`     | `#ffffff` | Reservado (header usa sidebar-bg atualmente)   |

#### Cores de Fundo e Superfícies

| Token CSS          | Hex       | Uso                              |
| ------------------ | --------- | -------------------------------- |
| `--color-bg`       | `#f0ece3` | Fundo geral (creme amazônico)    |
| `--color-surface`  | `#ffffff` | Cards, modais, inputs            |
| `--color-divider`  | `#e5ddd2` | Separadores e bordas leves       |

#### Cores de Texto

| Token CSS                   | Hex       | Uso                                  |
| --------------------------- | --------- | ------------------------------------ |
| `--color-text-primary`      | `#2c2010` | Títulos, corpo do texto              |
| `--color-text-secondary`    | `#7a6d5e` | Descrições, textos menos importantes |
| `--color-text-on-primary`   | `#ffffff` | Texto sobre fundos escuros           |

#### Cores de Status

| Status      | Hex     | Uso                                   |
| ----------- | ------- | ------------------------------------- |
| Sucesso     | #4CAF50 | Ações bem-sucedidas, status positivo  |
| Aviso       | #FF9800 | Alertas, ações que precisam atenção   |
| Erro/Alerta | #ED3237 | Erros, cancelamentos, status críticos |
| Info        | #2196F3 | Informações, dicas, notificações      |
| Pendente    | #FFC107 | Status pendente, em progresso         |

### Tipografia

#### Fonte Principal

**Open Sans**

- Weight: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- Fonte de fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

#### Escala Tipográfica

| Elemento            | Tamanho | Weight          | Line Height | Uso                                   |
| ------------------- | ------- | --------------- | ----------- | ------------------------------------- |
| H1 - Titles         | 32px    | 700 (Bold)      | 1.2         | Títulos de página, headers principais |
| H2 - Major Sections | 24px    | 700 (Bold)      | 1.3         | Seções principais, cards grandes      |
| H3 - Section Titles | 18px    | 600 (Semi-bold) | 1.4         | Subtítulos, cabeçalhos de seção       |
| H4 - Subtitle       | 16px    | 600 (Semi-bold) | 1.4         | Labels de seção pequena               |
| Body - Regular      | 14px    | 400 (Regular)   | 1.6         | Corpo do texto, descrições            |
| Body - Small        | 12px    | 400 (Regular)   | 1.5         | Textos secundários, metadados         |
| Button              | 14px    | 600 (Semi-bold) | 1.5         | Rótulos de botões                     |
| Badge/Tag           | 12px    | 500 (Medium)    | 1.4         | Tags, badges, status                  |
| Caption             | 11px    | 400 (Regular)   | 1.4         | Legendas muito pequenas               |

---

## 🎯 Componentes e Padrões

### Layout Geral

```
┌─────────────────────────────────────────────────┐
│               Header/Navbar                     │
│  Logo  |  Search  |  Notifications  |  Profile  │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Main Content Area           │
│  Menu    │                                      │
│          │                                      │
│          │    ┌─────────┐   ┌─────────┐       │
│          │    │  Card 1 │   │  Card 2 │       │
│          │    └─────────┘   └─────────┘       │
│          │                                      │
│          │    ┌─────────────────────────────┐  │
│          │    │    Data Table               │  │
│          │    └─────────────────────────────┘  │
│          │                                      │
└──────────┴──────────────────────────────────────┘
│                  Footer                        │
└─────────────────────────────────────────────────┘
```

### Espaçamento (Spacing Scale)

Sistema de spacing baseado em múltiplos de 8px:

| Token | Valor | Uso                      |
| ----- | ----- | ------------------------ |
| xs    | 4px   | Espaçamento mínimo       |
| sm    | 8px   | Espaçamento pequeno      |
| md    | 16px  | Espaçamento padrão       |
| lg    | 24px  | Espaçamento grande       |
| xl    | 32px  | Espaçamento extra grande |
| 2xl   | 48px  | Seções principais        |

### Border Radius (Arredondamento)

| Tipo   | Valor | Uso                        |
| ------ | ----- | -------------------------- |
| Mínimo | 2px   | Inputs, badges             |
| Padrão | 8px   | Cards, modais, botões      |
| Maior  | 12px  | Cards grandes, painéis     |
| Máximo | 16px  | Arredondamento emphasizado |

### Sombras (Shadows)

```css
/* Elevation 1 - Cards padrão */
box-shadow:
  0 1px 3px rgba(31, 45, 26, 0.12),
  0 1px 2px rgba(31, 45, 26, 0.24);

/* Elevation 2 - Hover em cards */
box-shadow:
  0 3px 6px rgba(31, 45, 26, 0.15),
  0 2px 4px rgba(31, 45, 26, 0.12);

/* Elevation 3 - Modais, dropdowns */
box-shadow:
  0 10px 40px rgba(31, 45, 26, 0.16),
  0 2px 4px rgba(31, 45, 26, 0.12);
```

---

## 🧩 Componentes de UI

### 1. Header/Navbar

**Características:**

- Altura: 64px
- Background: #FFFFFF com sombra leve (Elevation 1)
- Contém logo, search, notificações e perfil
- Responsivo: mobile collapsa para hamburger menu
- Fixado no topo (sticky)

**Elementos:**

- Logo (esquerda)
- Barra de busca (centro-esquerda)
- Notificações (direita)
- Menu do perfil (extrema direita)

### 2. Sidebar/Menu Lateral

**Características:**

- Largura: 280px (desktop), colapsável para 80px
- Background: #F4F6F2
- Scroll vertical quando necessário
- Itens com hover em verde secundário
- Item ativo destacado em Verde Floresta

**Itens de Menu:**

- Dashboard
- Clientes
- Produtos
- Embalagens
- Pedidos
- Relatórios
- Configurações (administrador)

**Mobile:** Drawer quando aberto

### 3. Cards

**Padrão Principal**

```
┌─────────────────────────────┐
│ Título do Card     [ícone]  │  (padding: 16px)
├─────────────────────────────┤
│                             │
│    Conteúdo do Card         │  (padding: 16px)
│                             │
│                             │
├─────────────────────────────┤
│ [Ação 1] [Ação 2] [Ação 3] │  (padding: 12px, texto: 14px)
└─────────────────────────────┘
```

**Propriedades:**

- Border-radius: 8px
- Background: #FFFFFF
- Sombra: Elevation 1
- Padding: 16px
- Hover: Elevation 2, cursor pointer (se acionável)

**Tipos de Cards:**

- Dados (estatísticas, informações)
- Ação (com botões)
- Navegação (links para outras páginas)
- Aviso (alerts, informações críticas)

### 4. Botões

**Estados:**

- Default: Verde Floresta (#4A7A1E)
- Hover: Verde Floresta mais escuro
- Active: Verde Floresta com borda
- Disabled: Cinza claro (#CCCCCC)
- Loading: Spinner + texto desabilitado

**Variantes:**

| Tipo      | Uso               | Cor                                     |
| --------- | ----------------- | --------------------------------------- |
| Primary   | Ações principais  | Verde Floresta                          |
| Secondary | Ações secundárias | Verde Lima                              |
| Outline   | Ações neutras     | Bordaverde Floresta, fundo transparente |
| Danger    | Deletar, cancelar | Vermelho (#ED3237)                      |
| Success   | Confirmar, enviar | Verde (#4CAF50)                         |
| Ghost     | Ações muito leves | Sem borda/fundo                         |

**Tamanhos:**

- Small: 32px altura, padding 8px 12px
- Medium: 40px altura, padding 10px 16px (padrão)
- Large: 48px altura, padding 12px 24px

**Exemplo CSS:**

```css
.btn-primary {
  background-color: #4a7a1e;
  color: #ffffff;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #3d6318;
  box-shadow: 0 3px 6px rgba(74, 122, 30, 0.2);
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
```

### 5. Inputs e Forms

**TextField:**

- Height: 40px
- Border-radius: 8px
- Border: 1px sólido #E8EBDF
- Padding: 8px 12px
- Font: Body Regular 14px
- Focus: Borda Verde Floresta + sombra
- Placeholder: Texto Secundário com opacity 50%

**Label:**

- Font: Body Regular 12px, peso 600
- Cor: Texto Principal
- Margin-bottom: 6px
- Obrigatório: adicione \* em vermelho

**Validação:**

- Erro: Borda vermelha + ícone X + mensagem em vermelho
- Sucesso: Borda verde + ícone checkmark
- Info: Ícone info + mensagem em azul

**Select/Dropdown:**

- Mesmo estilo de input
- Ícone de dropdown (chevron down)
- Opções ao abrir

**Checkbox:**

- Tamanho: 20px × 20px
- Cor selecionada: Verde Floresta
- Transição suave

**Radio Buttons:**

- Círculo: 20px de diâmetro
- Cor selecionada: Verde Floresta

### 6. Tabelas de Dados

**Estrutura:**

```
┌──────┬──────────┬──────────┬──────────┬──────┐
│ Sel. │ Coluna 1 │ Coluna 2 │ Coluna 3 │ Ação │
├──────┼──────────┼──────────┼──────────┼──────┤
│ [ ]  │ Valor 1  │ Valor 2  │ Valor 3  │ ⋯   │
├──────┼──────────┼──────────┼──────────┼──────┤
│ [ ]  │ Valor 1  │ Valor 2  │ Valor 3  │ ⋯   │
└──────┴──────────┴──────────┴──────────┴──────┘
```

**Propriedades:**

- Header: Fundo #F4F6F2, texto bold
- Rows: Altura 56px, hover em #F9F9F9
- Padding: 12px
- Striped: Linhas alternadas com #FAFAF9
- Border: 1px #E8EBDF entre linhas

**Responsividade:** Scroll horizontal em mobile

### 7. Badges/Tags

**Padrão:**

- Padding: 4px 8px
- Border-radius: 4px
- Font: Badge 12px
- Cor de fundo: Conforme status
- Cor de texto: Ajustada para contraste

**Exemplos:**

```
[Ativo]          → Verde fundo, texto branco
[Pendente]       → Amarelo fundo, texto escuro
[Cancelado]      → Vermelho fundo, texto branco
[B2B]            → Verde Lima fundo, texto escuro
```

### 8. Modais/Diálogos

**Propriedades:**

- Overlay: Fundo preto com 40% de opacity
- Modal: Centrado, width máximo 500px
- Border-radius: 12px
- Sombra: Elevation 3
- Padding: 24px

**Estrutura:**

```
┌─────────────────────────────────┐
│ Título               [Fechar X] │
├─────────────────────────────────┤
│                                 │
│    Conteúdo do Modal            │
│                                 │
├─────────────────────────────────┤
│  [Cancelar]      [Confirmar]    │
└─────────────────────────────────┘
```

### 9. Alertas/Notificações

**Toast (Temporário):**

- Posição: Bottom-right
- Auto-close: 5 segundos
- Animation: Slide in/out

**Banner (Permanente):**

- Posição: Topo da página
- Pode ser fechado
- Usa cores de status

**Exemplo:**

```
┌────────────────────────────────────┐
│ ✓ Pedido criado com sucesso!       │ [X]
└────────────────────────────────────┘
```

### 10. Barra de Navegação Paginação

```
[< Anterior]  [1] [2] [3] ... [10]  [Próximo >]
```

---

## 📱 Responsividade

### Breakpoints

| Device  | Breakpoint     | Uso          |
| ------- | -------------- | ------------ |
| Mobile  | < 640px        | Smartphones  |
| Tablet  | 640px - 1024px | Tablets      |
| Desktop | > 1024px       | PCs, laptops |

### Adaptações por Device

**Mobile:**

- Sidebar → Drawer/hamburger
- Colunas de tabela → Cards empilhados
- Cards → Full width ou 1 coluna
- Modal → Full screen ou quase

**Tablet:**

- Sidebar → Colapsável
- Grid → 2 colunas
- Tabelas → Scroll horizontal

**Desktop:**

- Todos elementos visíveis
- Grid → 3+ colunas
- Tabelas → Completas

---

## 🌈 Estados de Componentes

### Pedidos

**Status Visual:**

```
PENDENTE    → Amarelo (#FFC107)   - Aguardando processamento
PROCESSANDO → Azul (#2196F3)      - Em processamento
PRODUÇÃO    → Laranja (#FF9800)   - Sendo produzido
PREPARADO   → Verde-Claro (#4CAF50) - Pronto para envio
ENVIADO     → Roxo (#9C27B0)      - Em trânsito
ENTREGUE    → Verde (#4CAF50)     - Finalizado
CANCELADO   → Vermelho (#ED3237)  - Cancelado
```

### Clientes

```
ATIVO      → Verde (#4CAF50)
INATIVO    → Cinza (#CCCCCC)
SUSPENSO   → Vermelho (#ED3237)
```

---

## ♿ Acessibilidade

- **Contraste:** Razão mínima 4.5:1 para texto normal, 3:1 para grande
- **Keyboard Navigation:** Todos elementos clicáveis acessíveis por Tab
- **ARIA Labels:** Ícones sem texto têm aria-label
- **Alt Text:** Imagens têm descrição
- **Color Blind:** Não use cores sozinhas para comunicar; adicione símbolos/text
- **Focus Visible:** Ring de foco claro em todos inputs

---

## 🎬 Micro-interações

### Transições

- Fade: 200ms
- Slide: 300ms
- Scale: 250ms

### Animações

- Carregamento: Spinner rotativo (Verde Floresta)
- Erro: Shake (pequeno tremor)
- Sucesso: Checkmark com slide + fade

---

## 📐 Grid System

Grid de 12 colunas com gutter de 16px:

```
Desktop: 12 colunas
Tablet: 6 colunas
Mobile: 2 colunas
```

---

## 🖼️ Imagens e Ícones

### Ícones

- Fonte: React Icons (Feather, Material Design)
- Tamanho padrão: 24px
- Hover: Cor muda para Verde Floresta
- Peso da linha: 2px

### Logo da Empresa

- Posicionada no topo esquerdo do Header
- Altura: 40px
- Links para Dashboard (home)

---

## 🎨 Modo Escuro (Futuro)

Possível implementação futura:

- Background: #1a1a1a
- Cards: #2d2d2d
- Texto: #F0F0F0
- Primário: #7ECE38 (verde mais claro)

---

**Versão:** 1.1
**Atualizado em:** 14 de Abril de 2026
**Status:** Identidade visual implementada — paleta atualizada para verde floresta amazônico
