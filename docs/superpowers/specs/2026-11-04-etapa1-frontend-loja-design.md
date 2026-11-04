# Etapa 1 — Frontend da loja (especificação)

Data: 2026-11-04 · Status: aprovada por delegação (o proprietário autorizou o trabalho autônomo nesta sessão; revisar as decisões da seção 3 ao retornar).

## 1. Decisões já tomadas com o proprietário

| Tema | Decisão |
|---|---|
| Stack | Next.js + React + TypeScript; ASP.NET Core 10 Web API; PostgreSQL; EF Core; ASP.NET Core Identity |
| Ordem de trabalho | Frontend da loja primeiro (opção A). Painel administrativo junto com o backend |
| Conta | Obrigatória para finalizar; cadastro dentro da finalização; carrinho funciona sem login |
| Frete | Regra configurável no painel: valor único ou por UF, frete grátis acima de um valor |
| Sessão | Cookie `HttpOnly` do Identity; navegador fala só com o domínio da loja; Next.js repassa `/api/*` para a API |
| Pagamento | Adiado para a última etapa. Pedido nasce "Aguardando pagamento"; provedores intercambiáveis (manual / Mercado Pago) |
| Hospedagem | Adiada; projeto portátil (configuração por variáveis de ambiente) |
| Arquitetura geral | Aprovada a parte 1 (camadas `Store.Domain/Application/Infrastructure/Api`, pastas `backend/`, `frontend/`, `docs/`) |

Partes 2 a 5 do design do backend (banco, estoque/concorrência, pedidos/segurança, infraestrutura/cronograma) serão apresentadas antes da etapa do backend.

## 2. Objetivo e escopo desta etapa

Entregar a loja virtual completa em termos de interface e navegação, com dados vindos de uma camada única que hoje usa **dados de demonstração** e depois será ligada à API real sem reescrever telas.

**Dentro:** identidade visual provisória; páginas públicas; carrinho; finalização; cadastro, login, confirmação de e-mail, recuperação de senha; área do cliente; histórico e acompanhamento de pedidos; políticas; contato; contrato tipado da API.

**Fora:** painel administrativo; backend; pagamentos; busca textual; cupons; avaliações; lista de desejos; formulário de contato; consulta automática de CEP; nota fiscal.

## 3. Decisões tomadas durante a ausência do proprietário (revisar)

1. **Marca provisória:** "Sua Marca", slogan "Joias em prata 925". Tudo em `frontend/src/config/brand.ts` (nome, slogan, contatos, razão social, CNPJ, redes). Nenhum nome comercial inventado.
2. **Tipografia:** Italiana (títulos grandes; traço finíssimo que lembra fio de prata) + Jost (textos e navegação, geométrica e legível). Ambas do Google Fonts via `next/font` (auto-hospedadas no build, sem chamadas ao Google em produção). *Revisado na implementação: Bodoni Moda foi trocada por ser a escolha padrão de lojas de moda.*
3. **Paleta:** mineral e fria — quase branco, névoa cinza-azulada nos fundos das fotos, texto em "prata oxidada". Sem dourado. Só tema claro (pedido: "fundo predominantemente claro"). *Revisado na implementação: o fundo porcelana quente foi trocado por tons frios, mais próximos da prata.*
4. **Fotos provisórias:** ilustrações vetoriais originais (traço fino com brilho prateado) por tipo de peça. Servem até as fotografias reais existirem; o componente de imagem já aceita fotos reais.
5. **Modo demonstração visível:** enquanto os dados forem de demonstração, uma faixa fixa avisa "Ambiente de demonstração — produtos, contas e pedidos são fictícios". Nenhum pagamento é simulado; pedidos de demonstração ficam sempre "Aguardando pagamento".
6. **Login em modo demonstração não verifica senha** (não há backend). Nada é gravado em disco; tudo fica em memória do servidor de desenvolvimento e some ao reiniciar.
7. **Rotas em português:** `/produtos`, `/categorias/[slug]`, `/produtos/[slug]`, `/carrinho`, `/finalizar`, `/entrar`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/confirmar-email`, `/minha-conta`, `/minha-conta/pedidos`, `/minha-conta/pedidos/[numero]`, `/politicas/privacidade`, `/politicas/troca-e-devolucao`, `/contato`.
8. **Catálogo enxuto:** filtro por categoria, ordenação (novidades, menor preço, maior preço) e paginação (12 por página). Sem busca textual por enquanto (não pedida; catálogo inicial pequeno).
9. **Contato sem formulário:** canais configuráveis (e-mail, WhatsApp, Instagram, horário). Formulário exigiria backend, e-mail e antispam.
10. **Políticas como modelo:** textos-base com os direitos da LGPD e o direito de arrependimento de 7 dias (art. 49 do CDC), com campos `[a preencher]` e aviso para revisão jurídica. Nenhum prazo comercial inventado.
11. **Endereço sem consulta automática de CEP** (seria integração externa não pedida). Campo de CEP com máscara.
12. **Carrinho guarda apenas `variantId` e quantidade** no navegador. Preço, disponibilidade e frete sempre recalculados pelo servidor a cada exibição.

## 4. Identidade visual

- **Tom:** editorial, silencioso, com respiro. Fotografia grande, poucos elementos, linhas finas (1px) em vez de caixas com sombra.
- **Tokens de cor:** `paper #FBFBFC`, `surface #FFFFFF`, `mist #EDEFF1` (fundo das imagens), `line #DADDE1`, `ink #23272C`, `ink-soft #3B4148`, `muted #6A7079`, `sheen #A9B0B8`, `focus #3E5C76`, `danger #A23B3B`, `success #2E6B57`.
- **Tipos:** títulos grandes em Italiana; navegação, rótulos e corpo em Jost (16px), sempre em caixa normal — sem rótulos em maiúsculas.
- **Movimento:** um único movimento automático — um reflexo de luz que atravessa a peça do destaque uma vez, como em metal polido. Os demais movimentos respondem a ações (abrir menu, adicionar ao carrinho, segunda foto no hover do produto). Tudo desligado com `prefers-reduced-motion`.
- **Formas:** botões em pílula (como um aro), campos e fundos de foto com cantos levemente arredondados; sem sombras nem cartões com borda.
- **Responsivo:** projetado primeiro para celular; grade de produtos 2 colunas no celular, 3–4 no desktop; menu em gaveta no celular.

## 5. Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Destaque editorial, categorias, novidades, bloco sobre prata 925 e cuidados, garantias de compra (troca, envio, segurança) |
| `/produtos` | Grade com filtro por categoria, ordenação, paginação |
| `/categorias/[slug]` | Mesma grade, título e descrição da categoria |
| `/produtos/[slug]` | Galeria, nome, preço, seleção de variação (numeração/comprimento) com esgotados indicados, quantidade, adicionar ao carrinho, especificações (material, peso, dimensões, acabamento), descrição, cuidados, relacionados |
| `/carrinho` | Itens, alterar quantidade, remover, avisos de indisponibilidade, simulação de frete por UF, progresso até frete grátis, total |
| `/finalizar` | Etapas: identificação (entrar ou criar conta no mesmo lugar) → endereço → revisão; confirmação com número do pedido, status e prazo da reserva |
| `/entrar`, `/cadastro` | Formulários com validação; após cadastro, aviso para confirmar e-mail |
| `/confirmar-email` | Resultado da confirmação por link |
| `/recuperar-senha`, `/redefinir-senha` | Pedido de link e definição de nova senha (mensagem neutra que não revela se o e-mail existe) |
| `/minha-conta` | Resumo: dados, último pedido, sair |
| `/minha-conta/pedidos` | Histórico |
| `/minha-conta/pedidos/[numero]` | Detalhe e linha do tempo do pedido (acompanhamento) |
| `/politicas/privacidade`, `/politicas/troca-e-devolucao` | Textos-modelo |
| `/contato` | Canais de atendimento |

Também: página 404, página de erro, estados de carregamento e estados vazios (carrinho vazio, sem pedidos).

## 6. Arquitetura do frontend

```
frontend/src/
├── app/
│   ├── (loja)/...             páginas acima, layout com cabeçalho e rodapé
│   └── api/...                rotas de demonstração (ativas só em modo demonstração)
├── components/                layout, ui, produto, catálogo, carrinho, finalização, conta
├── config/brand.ts            marca provisória
└── lib/
    ├── api/contract.ts        tipos e interface `StoreApi` (contrato com o backend)
    ├── api/server.ts          acesso a dados no servidor (páginas)
    ├── api/browser.ts         chamadas do navegador para `/api/*`
    ├── demo/                  dados e lógica de demonstração
    ├── cart/                  carrinho (estado + armazenamento local)
    └── format.ts              moeda, datas, CEP
```

- **Fonte de dados:** variável `STORE_DATA_SOURCE` (`demo` padrão nesta etapa; `api` na etapa do backend). Páginas do servidor usam `lib/api/server.ts`; componentes do navegador sempre chamam `/api/*`. Em modo `api`, o Next.js reescreve `/api/*` para o ASP.NET (regra `beforeFiles`), e as rotas de demonstração deixam de ser alcançadas; elas também retornam 404 fora do modo demonstração.
- **Sessão em modo demonstração:** cookie `HttpOnly` `demo_session` emitido pelas rotas de demonstração, imitando o fluxo real (o navegador nunca lê a sessão).
- **Proteção de rotas:** páginas da área do cliente verificam a sessão no servidor e redirecionam para `/entrar?voltar=...`.
- **Pedidos duplicados:** cada tentativa de finalização gera um `Idempotency-Key` (UUID) enviado no cabeçalho; o botão fica bloqueado durante o envio. O backend usará essa chave para nunca criar dois pedidos para a mesma tentativa.
- **Validação:** formulários validam no navegador apenas para conforto; o servidor (demonstração agora, API depois) valida tudo de novo.
- **Cabeçalhos de segurança básicos** no `next.config`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`. CSP com nonce fica para a etapa do backend.

## 7. Contrato da API (rascunho que o backend implementará)

Tipos em `frontend/src/lib/api/contract.ts`. Rotas usadas pelo navegador:

| Método e rota | Uso |
|---|---|
| `POST /api/auth/register` | Cadastro (nome, e-mail, senha) |
| `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` | Sessão |
| `POST /api/auth/confirm-email` | Confirmação por token |
| `POST /api/auth/forgot-password` · `POST /api/auth/reset-password` | Recuperação |
| `POST /api/cart/quote` | Recebe `[{variantId, quantity}]` e UF opcional; devolve linhas com preço atual, disponibilidade, avisos, subtotal, frete e total |
| `POST /api/orders` | Cria pedido (cabeçalho `Idempotency-Key`); devolve número, status e `reservedUntil` |
| `GET /api/orders` · `GET /api/orders/{number}` | Histórico e detalhe |

Leituras de catálogo (categorias, produtos, regra de frete) são feitas no servidor pelas páginas.

## 8. Qualidade

- Acessibilidade: HTML semântico, rótulos em todos os campos, foco visível, contraste AA, navegação por teclado no menu e na galeria.
- Desempenho: páginas do catálogo renderizadas no servidor; `next/image` para fotos; fontes auto-hospedadas.
- SEO: título e descrição por página; dados Open Graph do produto.

## 9. Testes e verificação

- **Unitários (Vitest):** formatação de moeda/CEP; operações do carrinho (adicionar, alterar, limitar, remover, ler armazenamento corrompido); cálculo de frete; cálculo da cotação do carrinho; leitura dos parâmetros do catálogo; linha do tempo do pedido; fluxo de idempotência da demonstração.
- **Build e tipos:** `tsc --noEmit`, `eslint`, `next build` sem erros.
- **Fumaça:** script que sobe o build de produção e confere que todas as rotas respondem com sucesso.
- **Visual:** capturas de tela em largura de celular e de desktop das páginas principais.

## 10. Pendências e riscos

- Fotografias reais dos produtos (as ilustrações são provisórias).
- Textos das políticas precisam de revisão jurídica e dos dados da empresa.
- Nome, logotipo e contatos reais da marca.
- Decisão sobre pagamento manual antes do Mercado Pago (etapa de pagamentos).
- Nota fiscal eletrônica não está no escopo e será necessária para operar.
- Ao ligar a API real, o carrinho do navegador será mesclado ao carrinho da conta no login (definido na etapa do backend).
