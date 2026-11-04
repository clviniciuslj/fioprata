# Etapa 1 — decisões técnicas registradas durante a implementação

Copiado do registro de execução do plano. Cada linha diz o que foi decidido, por quê e o custo se a decisão estiver errada.

## Decisões

- **Tarefa 1:** create-next-app 16.4.5 não tem --no-turbopack — flag removida; Turbopack é o padrão do Next 16 — custo se errado: nenhum.
- **Tarefa 1:** @types/node ^20 do modelo conflitava com Vitest 5 — atualizado para ^24 (mesma versão do Node instalado) — custo se errado: nenhum.
- **Tarefa 1:** paleta trocada de porcelana quente (#F6F5F2) para mineral fria (paper #FBFBFC, mist #EDEFF1, line #DADDE1, ink #23272C, muted #6A7079, sheen #A9B0B8) e Bodoni Moda trocada por Italiana — fundo creme + serifa de alto contraste é o padrão genérico nº 1 segundo a skill de design, e prata pede tons frios; classes viram bg-paper/bg-mist/text-ink etc. (spec atualizada) — custo se errado: trocar tokens em globals.css e a fonte em layout.tsx.
- **Tarefa 1:** Cache Components vem ligado no Next 16.4 — mantido (será padrão obrigatório na próxima versão maior); leituras de cookie/searchParams ficarão dentro de <Suspense> — custo se errado: desligar a flag e remover Suspense extras.
- **Tarefa 2:** imagens por produto (/demo-art/<slug>.svg e <slug>-detalhe.svg, geradas por script na Task 3) em vez de 2 ilustrações por tipo — evita grade com imagens repetidas — custo se errado: nenhum (só arquivos de demonstração).
- **Tarefa 2:** acrescentados listProductSlugs (para generateStaticParams) e findVariant (para a cotação da Task 7), ambos com teste — custo se errado: nenhum.
- **Tarefa 3:** cabeçalho mostra sempre "Minha conta" (sem ler cookie no layout) em vez de alternar "Entrar"/"Minha conta" — mantém o cabeçalho no shell estático do Cache Components; quem não está logado é levado ao login pela própria /minha-conta — custo se errado: um componente com Suspense no cabeçalho.
- **Tarefa 3:** script typecheck passou a rodar `next typegen` antes do tsc — tipos de rota em .next/types ficavam defasados — custo se errado: nenhum.
- **Tarefa 3:** rodapé sem a frase sobre pagamentos protegidos — pagamento não existe nesta etapa — custo se errado: nenhum.
- **Tarefa 4:** Category ganhou `image: ProductImage | null` no contrato — a página inicial mostra uma foto por categoria — custo se errado: campo extra para o backend preencher.
- **Tarefa 4:** com Cache Components + Partial Prefetching, o 1º acesso a um slug desconhecido (/categorias/x) recebe 200 com a página "não encontrada" e meta noindex; acessos seguintes recebem 404 (cache). dynamicParams=false não é suportado. Smoke test vai verificar conteúdo/noindex no 1º acesso e 404 no 2º — custo se errado: soft-404 no primeiro acesso (mitigado pelo noindex).
- **Tarefa 4:** capturas de tela via script CDP no scratchpad (Chrome headless com emulação de dispositivo) — Chrome ignora --window-size abaixo de ~500px e X-Frame-Options bloqueia iframe — custo se errado: nenhum.
- **Tarefa 5:** carrinho como store de módulo + useSyncExternalStore (lib/cart/use-cart.ts) em vez de Context/Provider (cart-context.tsx) — estado vive no localStorage (externo ao React), sem divergência de hidratação e sem provider no layout; mesma interface useCart() — custo se errado: trocar por provider.
- **Tarefa 7:** extraído lib/local-store.ts (createStoredValue + useHydrated) reaproveitado pelo carrinho e pela UF de entrega (use-shipping-state.ts), que o carrinho grava e a finalização lê — custo se errado: nenhum.
- **Tarefa 7:** parseCartQuoteRequest/parseCartItems (validação do corpo) com testes — exigido pela Review Focus 1 — custo se errado: nenhum.
- **Tarefa 7:** frete grátis quando subtotal ≥ mínimo mesmo sem UF; carrinho vazio não tem frete; linha "insufficient" soma no subtotal com a quantidade pedida (finalização bloqueada de qualquer forma) — custo se errado: texto de resumo diferente.
- **Tarefa 8:** formulários leem `voltar`/`token` de window.location no momento do uso (currentSearchParam) em vez de useSearchParams — evita Suspense e mantém os formulários no HTML estático (Cache Components) — custo se errado: nenhum funcional.
- **Tarefa 8:** cabeçalho não alterna "Entrar"/"Minha conta" (ver Task 3) — /minha-conta leva ao login quando não há sessão.
- **Tarefa 8:** cadastro revela "e-mail já cadastrado" (UX); login e recuperação de senha usam mensagens neutras. A recuperação em modo demo devolve o link só quando o e-mail existe (campo demo* documentado no contrato) — custo se errado: enumeração de contas no cadastro; o backend pode trocar por resposta neutra + e-mail.
- **Tarefa 8:** resetPassword encerra todas as sessões do cliente — prática de segurança — custo se errado: nenhum.
- **Tarefa 9:** rota GET /api/orders/[number] movida para a Task 10 (depende de getOrderFor, que pertence à área do cliente) — custo se errado: nenhum.
- **Tarefa 9:** createDemoOrder ganhou parâmetro opcional `now` para testes determinísticos do prazo de reserva — custo se errado: nenhum.
- **Tarefa 9:** texto da revisão não promete "instruções de pagamento após a confirmação" (pagamento ainda não existe); diz que a reserva é por tempo limitado e o pedido fica aguardando pagamento — custo se errado: ajuste de texto na etapa de pagamentos.
- **Tarefa 9:** estoque de demonstração não é baixado ao criar pedido (sem banco); reserva real é do backend — custo se errado: demo permite pedir a mesma última unidade duas vezes.
- **Tarefa 9:** chave de idempotência gerada no 1º clique (useRef), mantida em falha de rede (status 0) e descartada em recusa definitiva (4xx) — custo se errado: nenhum.
- **Tarefa 10:** proxy.ts (antigo middleware) faz verificação otimista — sem cookie demo_session, /minha-conta/* responde 307 para /entrar?voltar=...; a verificação real continua na página (requireCustomer) e na API — custo se errado: nenhum (camada extra).
- **Tarefa 10:** NavLinks envolve usePathname em <Suspense> com fallback sem destaque — o build falhava em rota dinâmica sem generateStaticParams (/minha-conta/pedidos/[number]) — custo se errado: nenhum.
- **Tarefa 10:** número do pedido em Jost (algarismos da Italiana deixam o "4" parecido com fração) — custo se errado: nenhum.
- **Tarefa 10:** pedido inexistente/alheio na página dá a tela "não encontrada" dentro do Suspense (status 200, página privada noindex); a API responde 404 — custo se errado: status HTTP da página privada.
- **Tarefa 11:** app/not-found.tsx (raiz) repete a moldura da loja para endereços sem rota; (loja)/not-found.tsx para notFound() dentro das páginas — ambos usam NotFoundContent — custo se errado: nenhum.
- **Tarefa 11:** error.tsx usa a prop `retry` (API do Next 16.4; não existe mais `reset`) — custo se errado: nenhum.
- **Tarefa 12:** smoke verifica 1º acesso a slug inexistente pelo conteúdo + noindex e o 2º pelo status 404 (ver Ruling da Task 4); inclui também login, área do cliente e idempotência de pedido — custo se errado: nenhum.
- **Tarefa 12:** checagem "404 a partir do 2º acesso" era instável (o Next grava o 404 em cache em segundo plano; sob a carga do smoke o 2º acesso às vezes chega antes) — passou a aguardar até 5 s pelo 404; 3 execuções seguidas 33/33 — custo se errado: nenhum; se o 404 nunca vier, continua falhando.
- **Revisão final:** fora do escopo e não avaliado — pagamentos, backend, painel administrativo, CSP com nonce e token CSRF (spec: etapas seguintes) — custo se errado: nenhum nesta etapa.

## Correção da revisão final

- itens repetidos da mesma variação burlavam a conferência de estoque (pedido com 2 unidades da última peça) — testes "junta a mesma variação repetida…", "junta itens repetidos e recusa quando a soma passa de 10", "recusa com 409 quando a mesma última unidade aparece em linhas repetidas" RED→GREEN, suite 113/113, smoke 33/33.

## Pontos menores adiados

- modo demonstração é o padrão quando STORE_DATA_SOURCE não está definido; publicar este frontend antes do backend exporia login sem senha (com faixa de aviso).
- mapas em memória da demonstração (contas, sessões, pedidos) não têm limite — muitas requisições automatizadas aumentam o uso de memória do servidor de demonstração.
- no carrinho, linha com quantidade acima do estoque entra no subtotal e pode exibir "frete grátis" enquanto a finalização está bloqueada.
- repetir a mesma Idempotency-Key com outro conteúdo devolve o pedido original em vez de recusar.
- readJson lê o corpo inteiro antes de checar o tamanho quando não há Content-Length.
