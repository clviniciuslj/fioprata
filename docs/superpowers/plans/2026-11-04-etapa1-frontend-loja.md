# Etapa 1 — Frontend da loja · Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Loja virtual completa em interface e navegação, com dados vindos de uma camada única (hoje demonstração, depois a API ASP.NET).

**Architecture:** App Next.js (App Router) em `frontend/`. Páginas do servidor leem dados por `lib/api/server.ts`; o navegador chama apenas `/api/*`, servido hoje por rotas de demonstração e, na etapa do backend, reescrito para o ASP.NET. Toda regra de preço/frete/disponibilidade é calculada do lado do servidor (demonstração agora).

**Tech Stack:** Next.js 16.4, React 19, TypeScript strict, Tailwind CSS 4, Vitest, `next/font` (Bodoni Moda + Jost).

**Spec:** `docs/superpowers/specs/2026-11-04-etapa1-frontend-loja-design.md`

## Global Constraints

- Valores monetários sempre inteiros em centavos, com sufixo `Cents` em todo nome de campo.
- Texto visível em pt-BR; identificadores de código em inglês; rotas exatamente as da seção 3.7 da spec.
- Marca somente via `frontend/src/config/brand.ts` (nome provisório "Sua Marca", slogan "Joias em prata 925").
- `STORE_DATA_SOURCE`: `demo` (padrão) ou `api`. Em `api`, funções de servidor lançam `Error("Modo API ainda não implementado")` até a etapa do backend; rotas `app/api/**` de demonstração respondem 404 fora de `demo`.
- Faixa de demonstração com o texto exato: "Ambiente de demonstração — produtos, contas e pedidos são fictícios."
- Política de senha: 10 a 128 caracteres, sem regras de composição (a mesma que o Identity usará).
- Quantidade por linha do carrinho: mínimo 1, máximo `min(10, disponível)`.
- Tokens de cor exatamente os da seção 4 da spec. Só tema claro.
- Nenhuma chamada de rede externa em tempo de execução (sem analytics, sem CDN; fontes auto-hospedadas pelo `next/font`).
- Respostas de erro das rotas `/api/*` no formato `{ title: string, errors?: Record<string, string[]> }` com status HTTP adequado.

## Review Focus

1. Carrinho salvo corrompido ou antigo no navegador (JSON inválido, quantidade negativa, variação inexistente) → o carrinho se limpa sem quebrar a página. Testes nas Tasks 5 e 7.
2. Peça esgotada entre "adicionar" e "finalizar" → carrinho mostra o aviso e bloqueia a finalização; criação do pedido recusa com 409. Testes nas Tasks 7 e 9.
3. Duplo clique ou nova tentativa em "Finalizar pedido" → um único pedido para o mesmo `Idempotency-Key`. Teste na Task 9.
4. Parâmetros de URL inválidos no catálogo (`?page=abc`, `?page=999`, `?sort=xyz`, categoria inexistente) → valores padrão, página vazia ou 404. Testes na Task 2.
5. Parâmetro `voltar` malicioso no login (`//site.com`, `https://...`) → ignorado, volta para `/minha-conta`. Teste na Task 8.

---

### Task 1: Base do projeto, identidade e formatação

**Files:**
- Create: `frontend/` (via `create-next-app`, TypeScript, Tailwind, ESLint, App Router, `src/`, alias `@/*`)
- Create: `frontend/src/config/brand.ts`, `frontend/src/lib/format.ts`, `frontend/src/lib/format.test.ts`, `frontend/vitest.config.ts`, `frontend/.env.example`
- Modify: `frontend/src/app/globals.css` (tokens `@theme`), `frontend/src/app/layout.tsx` (fontes, `lang="pt-BR"`, metadata), `frontend/next.config.ts` (cabeçalhos de segurança), `frontend/package.json` (scripts `test`, `typecheck`)

**Interfaces:**
- Produces: `brand: { name, tagline, description, contact: { email, whatsapp, whatsappDisplay, instagram, hours }, legal: { companyName, cnpj, address } }`; `formatBRL(cents: number): string`; `formatPostalCode(digits: string): string`; `formatDate(iso: string): string`; `formatDateTime(iso: string): string`; classes Tailwind `bg-bg text-ink border-line bg-mist text-muted` etc. e `font-display`/`font-sans`.

- [ ] **Step 1:** Gerar o app com `npx create-next-app@16.4.5 frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`; instalar `vitest` como devDependency.
- [ ] **Step 2: Teste que falha** `format.test.ts`: `formatBRL(123456)` normalizado (NBSP→espaço) é `"R$ 1.234,56"`; `formatBRL(0)` → `"R$ 0,00"`; `formatPostalCode("01310100")` → `"01310-100"`; `formatDate("2026-11-04T15:30:00Z")` contém `"novembro de 2026"`.
- [ ] **Step 3:** Rodar `npm test` → FAIL (módulo inexistente).
- [ ] **Step 4:** Implementar `format.ts` com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` e `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" })`.
- [ ] **Step 5:** Tokens da spec em `globals.css`, fontes em `layout.tsx`, `brand.ts` com contatos `contato@example.com` e campos jurídicos `[a preencher]`; cabeçalhos `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- [ ] **Step 6:** `npm test`, `npm run typecheck`, `npm run build` → todos passam.
- [ ] **Step 7:** Commit `feat(frontend): base do projeto, identidade e formatação`.

### Task 2: Contrato da API, catálogo de demonstração e parâmetros do catálogo

**Files:**
- Create: `frontend/src/lib/api/contract.ts`, `frontend/src/lib/api/data-source.ts`, `frontend/src/lib/api/server.ts`, `frontend/src/lib/demo/catalog-data.ts`, `frontend/src/lib/demo/catalog.ts`, `frontend/src/lib/demo/catalog.test.ts`, `frontend/src/lib/catalog-params.ts`, `frontend/src/lib/catalog-params.test.ts`

**Interfaces:**
- Produces (contract.ts): `UF` (27 siglas, `UF_LIST`), `Category { slug, name, description }`, `ProductImage { src, alt }`, `ProductSpec { label, value }`, `ProductVariant { id, sku, label: string | null, priceCents, available }`, `ProductSummary { id, slug, name, categorySlug, fromPriceCents, hasPriceRange, images: ProductImage[], isNew, soldOut }`, `ProductDetail extends ProductSummary { description, care, specs: ProductSpec[], variantLabel: string | null, variants: ProductVariant[] }`, `CatalogSort = "novidades" | "menor-preco" | "maior-preco"`, `CatalogQuery { category?: string, sort: CatalogSort, page: number }`, `Page<T> { items, page, pageSize, totalItems, totalPages }`, `ShippingRule { defaultCents, byState: Partial<Record<UF, number>>, freeAboveCents: number | null }`, `ApiError { title, errors? }`; mais os tipos de carrinho, conta e pedido usados nas Tasks 7–10 (`CartItemInput`, `CartQuoteRequest`, `CartQuoteLine`, `CartQuote`, `Customer`, `Address`, `OrderStatus`, `OrderLine`, `OrderEvent`, `OrderSummary`, `OrderDetail`, `CreateOrderRequest`, `CreateOrderResponse`).
- Produces (server.ts, `import "server-only"`): `listCategories()`, `getCategory(slug)`, `listProducts(q: CatalogQuery): Promise<Page<ProductSummary>>`, `listNewArrivals(limit)`, `getProduct(slug): Promise<ProductDetail | null>`, `listRelated(slug, limit)`, `getShippingRule()`; Tasks 8 e 10 acrescentam `getCurrentCustomer()`, `listOrders()`, `getOrder(number)`.
- Produces: `dataSource(): "demo" | "api"`; `parseCatalogParams(sp: Record<string, string | string[] | undefined>): CatalogQuery`; `CATALOG_PAGE_SIZE = 12`.

- [ ] **Step 1: Testes que falham** — `catalog.test.ts`: filtrar por `aneis` só traz anéis; `menor-preco` ordena por `fromPriceCents` crescente; `page: 2` com 12 por página traz os itens 13+; `page: 999` traz `items: []` e `totalPages` correto; `getProduct("inexistente")` é `null`; produto com todas as variações `available: 0` tem `soldOut: true`. `catalog-params.test.ts`: `{}` → `{ sort: "novidades", page: 1 }`; `{ page: "abc" }` → page 1; `{ page: "-3" }` → page 1; `{ sort: "xyz" }` → `"novidades"`; `{ page: ["2","5"] }` → page 2.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Dados: 5 categorias (`aneis` Anéis, `colares` Colares, `brincos` Brincos, `pulseiras` Pulseiras, `pingentes` Pingentes), ~18 produtos com especificações (Material "Prata 925", peso, dimensões, acabamento), anéis com variações "Aro 12…22", colares com "40 cm / 45 cm / 50 cm", alguns esgotados e alguns com 1 unidade; regra de frete demo `{ defaultCents: 2490, byState: { SP: 1490, RJ: 1890, MG: 1890 }, freeAboveCents: 39900 }`. Imagens apontam para `/demo-art/<tipo>-<n>.svg` (Task 3).
- [ ] **Step 4:** Implementar funções puras em `demo/catalog.ts` e a seleção por `dataSource()` em `server.ts`.
- [ ] **Step 5:** `npm test` e `npm run typecheck` → PASS.
- [ ] **Step 6:** Commit `feat(frontend): contrato da API e catálogo de demonstração`.

### Task 3: Ilustrações provisórias, primitivas de interface e layout da loja

**Files:**
- Create: `frontend/public/demo-art/*.svg` (anel, colar, brinco, pulseira, pingente; 2 variações de enquadramento cada)
- Create: `frontend/src/components/ui/{button.tsx,field.tsx,price.tsx,container.tsx}`, `frontend/src/components/layout/{demo-banner.tsx,announcement-bar.tsx,site-header.tsx,mobile-menu.tsx,site-footer.tsx}`, `frontend/src/app/(loja)/layout.tsx`
- Move: `frontend/src/app/page.tsx` → `frontend/src/app/(loja)/page.tsx`

**Interfaces:**
- Consumes: `brand`, `listCategories()`, `getShippingRule()`, `dataSource()`, `formatBRL`.
- Produces: `<Button variant="primary" | "secondary" | "ghost" size="md" | "lg" asChild?>` (também `ButtonLink` com `href`); `<Field label error hint>` envolvendo `Input`/`Select`; `<Price cents fromPrice?>`; `<Container>`; o cabeçalho lê a contagem do carrinho via `useCart()` (Task 5) — nesta task usa um marcador `0` substituído na Task 5.

- [ ] **Step 1:** Desenhar SVGs originais em traço fino com gradiente prateado sobre fundo `mist`.
- [ ] **Step 2:** Implementar primitivas e layout: faixa de demonstração só quando `dataSource() === "demo"`; barra de anúncio "Frete grátis acima de R$ 399,00" derivada de `freeAboveCents`; cabeçalho com marca centralizada, categorias e links de conta/carrinho; menu em gaveta no celular (foco preso, `Esc` fecha); rodapé com políticas, contato, razão social/CNPJ.
- [ ] **Step 3:** `npm run typecheck`, `npm run lint`, `npm run build` → PASS.
- [ ] **Step 4:** Commit `feat(frontend): layout da loja e ilustrações provisórias`.

### Task 4: Página inicial, catálogo e categorias

**Files:**
- Create: `frontend/src/components/product/{product-card.tsx,product-grid.tsx,product-image.tsx}`, `frontend/src/components/catalog/{catalog-toolbar.tsx,pagination.tsx,catalog-view.tsx}`
- Create/Modify: `frontend/src/app/(loja)/page.tsx`, `frontend/src/app/(loja)/produtos/page.tsx`, `frontend/src/app/(loja)/categorias/[slug]/page.tsx`

**Interfaces:**
- Consumes: `listProducts`, `listNewArrivals`, `listCategories`, `getCategory`, `parseCatalogParams`, `<Price>`.
- Produces: `<ProductCard product: ProductSummary>` (segunda imagem no hover, selo "Esgotado"/"Novo"); `<CatalogView query: CatalogQuery basePath: string>` usado pelas duas rotas de listagem.

- [ ] **Step 1:** Página inicial com destaque editorial, categorias, novidades (8), bloco "Prata 925" com cuidados e garantias de compra.
- [ ] **Step 2:** `/produtos` e `/categorias/[slug]` com `CatalogView`; categoria inexistente → `notFound()`; ordenação e páginas por links (`?sort=&page=`), sem JavaScript obrigatório.
- [ ] **Step 3:** `npm run build` → PASS; abrir `/produtos?page=999` mostra estado vazio com link para a primeira página.
- [ ] **Step 4:** Commit `feat(frontend): página inicial e catálogo`.

### Task 5: Núcleo do carrinho

**Files:**
- Create: `frontend/src/lib/cart/cart.ts`, `frontend/src/lib/cart/cart.test.ts`, `frontend/src/lib/cart/cart-context.tsx`
- Modify: `frontend/src/app/(loja)/layout.tsx` (provider), `frontend/src/components/layout/site-header.tsx` (contagem real)

**Interfaces:**
- Produces: `CartItem = CartItemInput`; `MAX_LINE_QTY = 10`; `CART_STORAGE_KEY = "store.cart.v1"`; `addItem(items, variantId, qty, maxAvailable): CartItem[]`; `setQuantity(items, variantId, qty, maxAvailable?): CartItem[]` (qty ≤ 0 remove); `removeItem(items, variantId): CartItem[]`; `parseStoredCart(raw: string | null): CartItem[]`; `useCart(): { items, count, ready, add, setQty, remove, clear, replace }`.

- [ ] **Step 1: Testes que falham** — somar a mesma variação acumula; limita a `min(10, maxAvailable)`; `setQuantity(..., 0)` remove; `parseStoredCart("{x")` → `[]`; `parseStoredCart('[{"variantId":"a","quantity":-2},{"variantId":"b","quantity":3},{"foo":1}]')` → `[{ variantId: "b", quantity: 3 }]`; duplicatas no armazenamento são somadas e limitadas a 10.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar funções puras e o contexto (lê o `localStorage` só no cliente, `ready` evita divergência de hidratação; sincroniza entre abas pelo evento `storage`; `try/catch` em toda leitura e escrita).
- [ ] **Step 4:** `npm test`, `npm run typecheck` → PASS.
- [ ] **Step 5:** Commit `feat(frontend): carrinho no navegador`.

### Task 6: Página do produto

**Files:**
- Create: `frontend/src/app/(loja)/produtos/[slug]/page.tsx`, `frontend/src/components/product/{product-gallery.tsx,purchase-panel.tsx,product-specs.tsx}`

**Interfaces:**
- Consumes: `getProduct`, `listRelated`, `useCart().add`, `<ProductGrid>`, `<Price>`.
- Produces: `generateMetadata` com título, descrição e Open Graph do produto.

- [ ] **Step 1:** Galeria com miniaturas acessíveis por teclado; painel de compra com seleção de variação (esgotadas desabilitadas e marcadas), quantidade limitada ao disponível, aviso "Última unidade" quando `available === 1`, botão "Adicionar ao carrinho" com confirmação discreta; especificações, descrição, cuidados e relacionados.
- [ ] **Step 2:** `npm run build` → PASS; slug inexistente → 404.
- [ ] **Step 3:** Commit `feat(frontend): página do produto`.

### Task 7: Cotação do carrinho (demonstração) e página do carrinho

**Files:**
- Create: `frontend/src/lib/demo/shipping.ts`, `frontend/src/lib/demo/quote.ts`, `frontend/src/lib/demo/quote.test.ts`, `frontend/src/lib/demo/guard.ts`, `frontend/src/app/api/cart/quote/route.ts`, `frontend/src/lib/api/browser.ts`, `frontend/src/app/(loja)/carrinho/page.tsx`, `frontend/src/components/cart/{cart-view.tsx,cart-line.tsx,cart-summary.tsx}`

**Interfaces:**
- Produces: `computeShippingCents(rule: ShippingRule, state: UF | undefined, subtotalCents: number): number | null` (null sem UF; 0 quando `subtotal ≥ freeAboveCents`); `quoteCart(req: CartQuoteRequest): CartQuote` com `CartQuote { lines: CartQuoteLine[], removedVariantIds: string[], subtotalCents, shippingCents: number | null, freeShippingRemainingCents: number | null, totalCents, hasIssues }` e `CartQuoteLine { variantId, productSlug, productName, variantLabel, image, unitPriceCents, quantity, available, lineTotalCents, issue: "unavailable" | "insufficient" | null }`; `demoOnly(): Response | null` (404 fora do modo demo); `browserApi.quoteCart(req): Promise<Result<CartQuote>>` com `Result<T> = { ok: true, data: T } | { ok: false, status: number, error: ApiError }`.

- [ ] **Step 1: Testes que falham** — frete SP R$ 14,90 (`1490`); UF sem regra usa `2490`; subtotal `39900` → frete `0`; sem UF → `null`; variação inexistente vai para `removedVariantIds`; quantidade 3 com `available: 1` → `issue: "insufficient"` e `hasIssues: true`; `available: 0` → `"unavailable"` e a linha não soma no subtotal; `freeShippingRemainingCents` = `39900 - subtotal` quando abaixo.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar `shipping.ts`, `quote.ts`, rota `POST /api/cart/quote` (valida corpo: até 50 itens, quantidade inteira 1–10, UF válida; senão 400) e `browserApi.quoteCart`.
- [ ] **Step 4:** Página do carrinho: busca a cotação a cada mudança, remove do armazenamento os `removedVariantIds`, mostra avisos por linha, seletor de UF para o frete, progresso até o frete grátis, botão "Finalizar compra" desabilitado com `hasIssues`; estado vazio.
- [ ] **Step 5:** `npm test`, `npm run build` → PASS.
- [ ] **Step 6:** Commit `feat(frontend): carrinho com cotação no servidor`.

### Task 8: Contas (demonstração) e páginas de autenticação

**Files:**
- Create: `frontend/src/lib/validation.ts`, `frontend/src/lib/validation.test.ts`, `frontend/src/lib/safe-return.ts`, `frontend/src/lib/safe-return.test.ts`, `frontend/src/lib/demo/store.ts`, `frontend/src/lib/demo/accounts.ts`, `frontend/src/lib/demo/accounts.test.ts`
- Create: `frontend/src/app/api/auth/{register,login,logout,me,confirm-email,forgot-password,reset-password}/route.ts`
- Create: `frontend/src/app/(loja)/{entrar,cadastro,confirmar-email,recuperar-senha,redefinir-senha}/page.tsx`, `frontend/src/components/auth/{login-form.tsx,register-form.tsx,forgot-form.tsx,reset-form.tsx}`
- Modify: `frontend/src/lib/api/browser.ts`, `frontend/src/lib/api/server.ts` (`getCurrentCustomer`)

**Interfaces:**
- Produces: `validateEmail(v): string | null`, `validatePassword(v): string | null` (10–128), `validateName(v): string | null` (2–100), `validateAddress(a: Address): Record<string, string>`; `safeReturnPath(v: string | null | undefined, fallback = "/minha-conta"): string`; `DEMO_SESSION_COOKIE = "demo_session"`; `demoStore` (usuários, sessões, tokens, pedidos, chaves de idempotência em `globalThis`); `registerCustomer`, `authenticate`, `createSession`, `customerFromSession`, `confirmEmail`, `requestPasswordReset`, `resetPassword`; `browserApi.{register, login, logout, me, confirmEmail, forgotPassword, resetPassword}`; `getCurrentCustomer(): Promise<Customer | null>`.

- [ ] **Step 1: Testes que falham** — `safeReturnPath("//evil.com")`, `("https://evil.com")`, `("/\\evil.com")`, `("javascript:alert(1)")` → `"/minha-conta"`; `("/minha-conta/pedidos")` mantém; `validatePassword("123456789")` erro, `("1234567890")` ok; e-mail duplicado no cadastro (sem diferenciar maiúsculas) → erro; `authenticate` com e-mail desconhecido → `null`; `requestPasswordReset` de e-mail desconhecido não lança e não cria token.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar; cliente demo semeado `cliente@example.com` ("Cliente Exemplo", e-mail confirmado). Cookie de sessão `HttpOnly; SameSite=Lax; Path=/` (+ `Secure` em produção). Respostas de recuperação sempre neutras.
- [ ] **Step 4:** Páginas e formulários: erros por campo, `voltar` respeitado via `safeReturnPath`; após cadastro, aviso de confirmação com link de demonstração para `/confirmar-email?token=...`; cabeçalho passa a mostrar "Entrar" ou "Minha conta".
- [ ] **Step 5:** `npm test`, `npm run build` → PASS.
- [ ] **Step 6:** Commit `feat(frontend): cadastro, login e recuperação de senha`.

### Task 9: Pedidos (demonstração) e finalização

**Files:**
- Create: `frontend/src/lib/demo/orders.ts`, `frontend/src/lib/demo/orders.test.ts`, `frontend/src/app/api/orders/route.ts`, `frontend/src/app/api/orders/[number]/route.ts`, `frontend/src/app/(loja)/finalizar/page.tsx`, `frontend/src/components/checkout/{checkout-flow.tsx,identify-step.tsx,address-step.tsx,review-step.tsx,order-confirmation.tsx}`
- Modify: `frontend/src/lib/api/browser.ts` (`createOrder`)

**Interfaces:**
- Consumes: `quoteCart`, `validateAddress`, `customerFromSession`, `demoStore`.
- Produces: `createDemoOrder(customerId, req: CreateOrderRequest, idempotencyKey: string): { ok: true, order: OrderDetail } | { ok: false, status: 400 | 409, error: ApiError }`; `CreateOrderResponse { number, status, totalCents, reservedUntil }`; números no formato `"P-" + 6 dígitos`; `RESERVATION_MINUTES = 30` (demonstração); `browserApi.createOrder(req, idempotencyKey)`.

- [ ] **Step 1: Testes que falham** — mesma chave duas vezes → mesmo `number` e só um pedido no histórico; chave diferente → novo pedido; item `insufficient` → 409 sem criar pedido; endereço com CEP de 7 dígitos → 400 com `errors.postalCode`; pedido criado tem `status: "awaiting_payment"`, `reservedUntil` = criação + 30 min e preços copiados da cotação.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar; `POST /api/orders` exige sessão (401) e `Idempotency-Key` (400).
- [ ] **Step 4:** Fluxo `/finalizar`: identificação (entrar/criar conta na mesma tela), endereço (CEP com máscara, UF em lista), revisão (itens, frete e total vindos da cotação, aviso "Forma de pagamento será informada após a confirmação — o pedido fica aguardando pagamento"); botão bloqueado durante o envio, chave gerada uma vez por tentativa; confirmação com número, status e "Reservamos suas peças até HH:MM"; carrinho limpo após sucesso; carrinho vazio redireciona para `/carrinho`.
- [ ] **Step 5:** `npm test`, `npm run build` → PASS.
- [ ] **Step 6:** Commit `feat(frontend): finalização de pedido`.

### Task 10: Área do cliente, histórico e acompanhamento

**Files:**
- Create: `frontend/src/lib/order-status.ts`, `frontend/src/lib/order-status.test.ts`, `frontend/src/app/(loja)/minha-conta/{layout.tsx,page.tsx}`, `frontend/src/app/(loja)/minha-conta/pedidos/page.tsx`, `frontend/src/app/(loja)/minha-conta/pedidos/[number]/page.tsx`, `frontend/src/components/account/{account-nav.tsx,order-timeline.tsx,order-status-badge.tsx,logout-button.tsx}`
- Modify: `frontend/src/lib/api/server.ts` (`listOrders`, `getOrder`), `frontend/src/lib/demo/store.ts` (pedidos semeados do cliente demo: um em cada status principal)

**Interfaces:**
- Produces: `ORDER_STATUS_LABEL: Record<OrderStatus, string>` (`awaiting_payment` "Aguardando pagamento", `payment_approved` "Pagamento aprovado", `preparing` "Em preparação", `shipped` "Enviado", `delivered` "Entregue", `cancelled` "Cancelado", `expired` "Expirado"); `buildTimeline(order: Pick<OrderDetail, "status" | "history">): { status: OrderStatus, label: string, state: "done" | "current" | "upcoming", at: string | null }[]`.

- [ ] **Step 1: Testes que falham** — `shipped` → os 3 primeiros `done`, `shipped` `current`, `delivered` `upcoming`; `cancelled` após pagamento → passos alcançados `done` + passo final `cancelled` `current`, sem passos futuros; `expired` → `awaiting_payment` `done` + `expired` `current`; datas vêm do `history`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar; layout de `/minha-conta` verifica `getCurrentCustomer()` no servidor e redireciona para `/entrar?voltar=<rota>`; pedido de outro cliente ou inexistente → 404.
- [ ] **Step 4:** `npm test`, `npm run build` → PASS.
- [ ] **Step 5:** Commit `feat(frontend): área do cliente e acompanhamento de pedidos`.

### Task 11: Políticas, contato e páginas de sistema

**Files:**
- Create: `frontend/src/app/(loja)/politicas/{privacidade,troca-e-devolucao}/page.tsx`, `frontend/src/app/(loja)/contato/page.tsx`, `frontend/src/app/(loja)/not-found.tsx`, `frontend/src/app/(loja)/error.tsx`, `frontend/src/app/(loja)/loading.tsx`, `frontend/src/components/content/prose.tsx`

- [ ] **Step 1:** Políticas-modelo (LGPD: dados coletados, finalidade, base legal, direitos do titular, encarregado `[a preencher]`; troca e devolução: arrependimento em 7 dias corridos do recebimento conforme art. 49 do CDC, defeito conforme art. 26, prazos e condições comerciais `[a preencher]`), aviso de revisão jurídica; contato com os canais de `brand.contact`; 404, erro com "Tentar novamente" e carregamento discreto.
- [ ] **Step 2:** `npm run build` → PASS.
- [ ] **Step 3:** Commit `feat(frontend): políticas, contato e páginas de sistema`.

### Task 12: Verificação final e documentação

**Files:**
- Create: `frontend/scripts/smoke.mjs`, `frontend/README.md`, `docs/etapas/etapa-1-frontend.md`
- Modify: `frontend/package.json` (script `smoke`)

- [ ] **Step 1:** `smoke.mjs` sobe `next start` numa porta livre e confere status 200 em todas as rotas públicas, 404 em `/produtos/inexistente` e `/categorias/inexistente`, 307/redirecionamento de `/minha-conta` sem sessão, `POST /api/cart/quote` válido 200 e inválido 400.
- [ ] **Step 2:** `npm test && npm run typecheck && npm run lint && npm run build && npm run smoke` → tudo passa.
- [ ] **Step 3:** Capturas de tela (390px e 1440px) de início, catálogo, produto, carrinho e finalização; corrigir problemas visuais encontrados.
- [ ] **Step 4:** Documentar o que foi feito, como rodar, decisões, pendências; commit `docs: registro da etapa 1`.
