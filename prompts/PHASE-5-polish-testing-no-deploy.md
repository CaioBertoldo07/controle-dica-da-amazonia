# Prompt: PHASE 5 — Polish, Testing, Security e Documentação (Sem Deploy)

> Para Claude Code. Leia este documento inteiro antes de escrever código.
> Sua missão é concluir a PHASE 5 deste projeto, exceto qualquer parte de deploy, CI/CD, domínio, SSL de infraestrutura, hospedagem ou publicação.

---

## Contexto do Projeto

Você está trabalhando no repositório `controle-dica-da-amazonia`, um sistema interno de gestão para a Dica da Amazônia.

O projeto já concluiu com sucesso:

- Phase 1: Foundation
- Phase 2: Core Modules
- Phase 3: Business Logic
- Phase 4: Reporting

Agora execute apenas a parte viável localmente da **PHASE 5**, com foco em:

- testes
- QA
- otimizações
- segurança aplicável ao cenário atual
- documentação final

Não faça deploy.

---

## Documentação Obrigatória para Ler Antes de Implementar

Leia estes arquivos antes de começar:

- `docs/development-roadmap.md`
- `docs/system-architecture.md`
- `docs/api-design.md`
- `docs/business-rules.md`
- `docs/ui-guidelines.md`

---

## Estado Atual Verificado do Repositório

Considere estes fatos como já verificados:

- Não existe suíte de testes hoje no repositório.
- Não existem arquivos `*.test.*` ou `*.spec.*`.
- O `backend/package.json` ainda não tem stack de testes, logging estruturado, rate limiting nem compressão.
- O `frontend/package.json` ainda não tem stack de testes unitários/integrados nem Playwright.
- Não existe `README.md` na raiz, nem em `backend/` ou `frontend/`.
- O frontend usa autenticação com **Bearer token em localStorage**, via Axios interceptor.
- O backend já usa JWT, bcrypt, Zod, Prisma, Express e CORS básico.
- O backend já possui lógica crítica principalmente em `authService.ts`, `orderService.ts` e `reportService.ts`.

Isso significa que a PHASE 5 não é uma revisão superficial. Ela precisa criar a infraestrutura faltante e endurecer o projeto com pragmatismo.

---

## Objetivo

Levar o projeto a um estado de entrega técnica localmente robusto, sem deploy, com estes resultados:

1. Infraestrutura de testes funcional no backend e frontend.
2. Cobertura relevante dos fluxos críticos.
3. Melhorias reais de performance e observabilidade.
4. Hardening de segurança compatível com a arquitetura atual.
5. Documentação de setup, uso, testes e limitações.

---

## Escopo Fechado

Implemente apenas o que faz sentido **agora**, neste repositório.

### Incluído

- Testes unitários backend
- Testes de integração backend
- Testes de componentes frontend
- Testes de integração frontend
- Testes E2E essenciais com Playwright
- Rate limiting
- Compressão HTTP
- Logging estruturado
- Code splitting e lazy loading onde houver ganho real
- Revisão de validações e segurança local
- Documentação final

### Excluído

- Deploy
- GitHub Actions
- Infra de produção
- Domínio
- SSL externo
- Hospedagem
- observabilidade externa SaaS
- migração completa da autenticação para cookies HttpOnly

Se algum item da roadmap mencionar deploy ou infraestrutura externa, apenas documente como futuro e não implemente.

---

## Decisões Técnicas para Esta Phase

Use estas escolhas, sem pedir confirmação:

### Testes

- Backend: `Vitest` + `Supertest` + `@vitest/coverage-v8`
- Frontend: `Vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
- E2E: `Playwright`

### Backend hardening

- Rate limiting: `express-rate-limit`
- Compressão: `compression`
- Logging estruturado: `pino` + `pino-http`
- Security headers: `helmet`, desde que não quebre o frontend local

### Frontend

- Use lazy loading de rotas/páginas com `React.lazy` e `Suspense`
- Não faça otimizações artificiais. Só implemente o que gera ganho real

---

## Regras Importantes

1. Trabalhe em cima do código existente. Não reescreva a aplicação do zero.
2. Preserve a arquitetura atual e o estilo do projeto.
3. Faça mudanças pequenas e justificáveis.
4. Não invente uma estratégia de segurança incompatível com o app.
5. Como a autenticação atual usa Bearer token em `localStorage`, **não implemente CSRF tokens nem secure cookies como se o app já usasse cookie auth**.
6. Em vez disso, documente claramente essa limitação e reforce as proteções compatíveis com o cenário atual.
7. Não remova funcionalidades existentes para facilitar testes.
8. Se a meta de 80% de cobertura total do monorepo for inviável em uma única passada, atinja cobertura forte nos fluxos críticos e documente a cobertura real obtida.

---

## Ordem de Execução Obrigatória

Siga esta sequência.

### Etapa 1 — Inspeção Inicial

Antes de editar, leia:

- `backend/package.json`
- `frontend/package.json`
- `backend/src/app.ts`
- `backend/src/middlewares/errorHandler.ts`
- `backend/src/services/authService.ts`
- `backend/src/services/orderService.ts`
- `backend/src/services/reportService.ts`
- `frontend/src/App.tsx`
- `frontend/src/config/api.ts`
- `frontend/src/store/authStore.ts`
- `frontend/src/components/common/ProtectedRoute.tsx`

Depois disso, escreva um plano curto do que será implementado.

### Etapa 2 — Infra de Testes Backend

Implemente a base de testes no backend.

Entregáveis mínimos:

- scripts de teste e cobertura em `backend/package.json`
- configuração do Vitest
- utilitários de setup para testes
- estratégia para testes unitários e integração

Priorize cobertura dos serviços críticos:

- `authService.ts`
- `orderService.ts`
- `reportService.ts`

Crie testes para casos como:

- login com credenciais válidas
- login com senha inválida
- login com usuário inativo
- criação de pedido com cliente inativo
- criação de pedido com produtos duplicados
- criação de pedido com quantidade fora do limite
- transições válidas de status
- transições inválidas de status
- cancelamento exigindo justificativa nas etapas corretas
- cálculos de relatórios e serialização numérica

Para integração backend, cubra no mínimo:

- `POST /auth/login`
- `GET /health`
- pelo menos um fluxo representativo de pedidos
- pelo menos um endpoint de relatórios

Se precisar escolher entre profundidade e quantidade, cubra melhor os fluxos críticos em vez de espalhar testes rasos.

### Etapa 3 — Infra de Testes Frontend

Implemente a base de testes do frontend.

Entregáveis mínimos:

- scripts de teste e cobertura em `frontend/package.json`
- configuração do Vitest com `jsdom`
- setup de Testing Library
- mocks adequados para API e router quando necessário

Cubra no mínimo:

- `ProtectedRoute`
- fluxo de autenticação em nível de hook/store ou componente
- pelo menos um formulário crítico
- pelo menos uma página de listagem
- pelo menos um comportamento de erro de API

Prioridade recomendada:

- `frontend/src/components/common/ProtectedRoute.tsx`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/store/authStore.ts`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Orders/OrderForm.tsx`

### Etapa 4 — E2E com Playwright

Crie uma suíte E2E mínima, mas realista.

Fluxos obrigatórios:

- login com sucesso
- redirecionamento para login quando não autenticado
- navegação até uma área protegida
- criação de pedido ou, se isso ficar caro demais para o E2E inicial, ao menos abertura do fluxo e validações principais do formulário

Os testes devem ser estáveis. Evite depender de timing frágil.

### Etapa 5 — Hardening do Backend

Implemente melhorias reais no backend:

- `helmet`
- `compression`
- `express-rate-limit`
- `pino` / `pino-http`
- request logging com status code, método, rota e tempo de resposta

Faça isso de forma limpa em `app.ts` e, se necessário, em novos arquivos de config/middleware.

Também revise:

- limites de payload
- mensagens de erro em produção vs desenvolvimento
- padronização de respostas de erro quando fizer sentido
- validação de entrada nos endpoints já existentes

Não adicione complexidade desnecessária.

### Etapa 6 — Otimizações do Frontend

Implemente otimizações proporcionais ao projeto.

Obrigatório:

- code splitting por rotas ou grupos de páginas
- lazy loading das páginas mais pesadas
- fallback de carregamento simples e coerente

Opcional, apenas se houver ganho claro:

- pequenos ajustes de renderização
- separar chunks do módulo de relatórios

Não invente otimização de imagens se o projeto praticamente não usa imagens.
Não faça micro-otimização sem evidência.

### Etapa 7 — Revisão de Segurança Aplicável

Faça um hardening compatível com o estado atual do app.

Valide e ajuste:

- CORS
- armazenamento e uso de secrets
- exposição de erros
- fluxo de logout em 401
- ausência de uso inseguro de HTML raw
- dependências vulneráveis, se houver auditoria viável

Importante:

- Não implemente CSRF token à força se não há auth baseada em cookie.
- Não migre a arquitetura de auth inteira nesta fase.
- Documente claramente os riscos remanescentes do uso de token em `localStorage`.

### Etapa 8 — Documentação Final

Crie a documentação que está faltando.

Arquivos esperados:

- `README.md` na raiz
- `backend/README.md`
- `frontend/README.md`

Esses READMEs devem cobrir:

- visão geral do projeto
- stack usada
- pré-requisitos
- setup local
- variáveis de ambiente
- como rodar backend e frontend
- como rodar testes unitários, integração e E2E
- principais scripts
- observações de segurança
- escopo fora desta fase

Se fizer sentido, adicione uma seção curta em `docs/development-roadmap.md` marcando os itens realmente concluídos da PHASE 5, sem inventar progresso inexistente.

---

## Critérios de Aceite

Considere a task concluída apenas se todos estes pontos forem atendidos:

1. Backend compila.
2. Frontend compila.
3. Suíte de testes backend roda.
4. Suíte de testes frontend roda.
5. E2E Playwright roda ou, se depender de ambiente específico, fica configurado e documentado com comandos exatos.
6. Existem scripts claros para teste e cobertura.
7. O backend passa a ter rate limiting, compressão e logging estruturado.
8. O frontend passa a usar lazy loading em rotas/páginas relevantes.
9. Existem READMEs úteis na raiz, backend e frontend.
10. O resumo final informa exatamente o que foi implementado, o que ficou pendente e por quê.

---

## Resultado Esperado no Final

Ao concluir, entregue:

1. Resumo curto do que mudou.
2. Lista objetiva dos arquivos principais alterados.
3. Comandos executados para validação.
4. Resultado dos testes.
5. Cobertura obtida.
6. Riscos remanescentes.
7. Itens de deploy explicitamente deixados fora.

---

## Instrução Final

Não pare só no planejamento. Implemente a PHASE 5 inteira dentro do escopo definido aqui, com mudanças reais no código, testes, documentação e validação final.
