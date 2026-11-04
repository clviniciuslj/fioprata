# Etapa 1 — Frontend da loja (registro)

Data: 2026-11-04 · Branch: `feat/etapa1-frontend`
Especificação: `docs/superpowers/specs/2026-11-04-etapa1-frontend-loja-design.md`
Plano: `docs/superpowers/plans/2026-11-04-etapa1-frontend-loja.md`

## O que foi entregue

Loja virtual completa em interface e navegação, funcionando em modo demonstração:

- **Identidade visual provisória:** marca "Sua Marca", paleta mineral fria (tons de prata, sem dourado), títulos em Italiana e textos em Jost. Um único movimento automático: um reflexo de luz que passa sobre a peça da página inicial.
- **Páginas:** início, catálogo com ordenação e paginação, categorias, produto (galeria, escolha de numeração/comprimento, quantidade, especificações), carrinho, finalização em 3 etapas, cadastro, login, confirmação de e-mail, recuperação e redefinição de senha, área do cliente, histórico e acompanhamento de pedidos com linha do tempo, políticas de privacidade e de troca, contato, 404 e erro.
- **Contrato com o backend:** `frontend/src/lib/api/contract.ts` define todos os tipos e as rotas `/api/*` que a API ASP.NET vai implementar.
- **Regras de servidor já no fluxo:** preços, estoque e frete recalculados a cada exibição; o carrinho do navegador guarda só variação e quantidade; pedido com `Idempotency-Key`; sessão em cookie `HttpOnly; SameSite=Lax; Secure`; área do cliente protegida no proxy, na página e na API; um cliente nunca vê o pedido de outro.
- **Segurança básica:** cabeçalhos `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`; sem `X-Powered-By`; redirecionamento após login aceita só caminhos internos; corpo das requisições com limite de tamanho e validação.
- **Responsivo:** conferido em 390px e 1440px, sem rolagem horizontal.

## Testes

| Verificação | Resultado |
|---|---|
| `npm test` (Vitest) | 110 testes passando em 11 arquivos |
| `npm run typecheck` | sem erros |
| `npm run lint` | sem erros nem avisos |
| `npm run build` | 52 páginas geradas |
| `npm run smoke` | 33 verificações passando (rotas, 404, cabeçalhos, proteção da conta, cotação, login, idempotência do pedido) |

Também foram feitos testes manuais automatizados no Chrome: adicionar ao carrinho, carrinho com peça esgotada e quantidade acima do estoque, e compra completa (login dentro da finalização, endereço, confirmação, carrinho esvaziado).

## Decisões tomadas durante a ausência do proprietário

Estão na seção 3 da especificação, com duas revisões feitas durante a implementação:

1. Paleta trocada de porcelana quente para tons frios de prata.
2. Bodoni Moda trocada por Italiana nos títulos.

Ambas evitam a aparência padrão de lojas de moda e estão anotadas na especificação.

## Limitações conhecidas do modo demonstração

- Login não confere senha (não existe backend). Contas e pedidos novos somem ao reiniciar o servidor.
- O estoque de demonstração não é baixado quando um pedido é criado; a reserva atômica com expiração é do backend.
- Em rotas de produto e categoria, o **primeiro** acesso a um endereço inexistente responde 200 com a página "não encontrada" e `noindex`; os seguintes respondem 404. É o comportamento do Next.js 16 com pré-renderização parcial.
- As fotos são ilustrações provisórias geradas por script.

## Pendências

- Fotografias reais, nome, logotipo e contatos da marca (`src/config/brand.ts`).
- Revisão jurídica e preenchimento dos campos `[a preencher]` das políticas.
- Painel administrativo (junto com o backend).
- Backend ASP.NET Core 10 + PostgreSQL: design das partes 2 a 5 (banco, estoque e concorrência, pedidos e segurança, infraestrutura) a apresentar antes da implementação.
- Mesclar o carrinho do navegador ao carrinho da conta no login (etapa do backend).
- Proteção CSRF com token antifalsificação e CSP com nonce (etapa do backend).
- Decisão sobre pagamento manual antes do Mercado Pago (etapa de pagamentos).
- Nota fiscal eletrônica (fora do escopo atual, necessária para operar).
