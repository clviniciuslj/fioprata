# Loja — frontend

Loja virtual de joias em prata 925 (Next.js 16, React 19, TypeScript, Tailwind CSS 4).

Nesta etapa a loja roda em **modo demonstração**: produtos, contas e pedidos são fictícios e ficam em memória.
Uma faixa no topo de todas as páginas avisa isso. Nenhum pagamento é simulado.

## Como rodar

Requisitos: Node.js 24.

```bash
npm install
npm run dev          # desenvolvimento em http://localhost:3000
```

Produção local:

```bash
npm run build
npm start            # http://localhost:3000
```

Conta de demonstração: `cliente@example.com`, com qualquer senha (não há backend para conferir senhas).
Ela já tem pedidos de exemplo em vários status. Também é possível criar contas novas, que somem ao reiniciar o servidor.

## Verificações

```bash
npm test             # testes unitários (Vitest)
npm run typecheck    # tipos (gera os tipos de rota do Next.js antes)
npm run lint         # ESLint
npm run build        # build de produção
npm run smoke        # sobe o build e confere rotas, segurança e fluxo de pedido (rodar depois do build)
```

## Configuração

| Variável | Valores | Para quê |
|---|---|---|
| `STORE_DATA_SOURCE` | `demo` (padrão), `api` | Fonte dos dados. `api` só funcionará na etapa do backend. |

Copie `.env.example` para `.env.local` para alterar.

## Onde mudar o quê

| O quê | Onde |
|---|---|
| Nome, slogan, contatos, razão social e CNPJ | `src/config/brand.ts` |
| Cores e fontes | `src/app/globals.css` (tokens) e `src/app/layout.tsx` (fontes) |
| Produtos, categorias e frete de demonstração | `src/lib/demo/catalog-data.ts` |
| Ilustrações provisórias | `npm run demo-art` (gera `public/demo-art/`) |
| Textos das políticas | `src/app/(loja)/politicas/` |

## Organização

```
src/
├── app/(loja)/      páginas da loja (rotas em português)
├── app/api/         rotas de demonstração; na etapa do backend, /api/* passa a ir para a API ASP.NET
├── components/      interface (ui, layout, produto, catálogo, carrinho, finalização, conta, conteúdo)
├── config/brand.ts  marca provisória
├── lib/api/         contrato com o backend (contract.ts), leitura no servidor e chamadas do navegador
├── lib/demo/        dados e regras da demonstração
├── lib/cart/        carrinho do navegador (guarda só variação e quantidade)
└── proxy.ts         redireciona a área do cliente para o login quando não há sessão
```

Regras que valem para o projeto inteiro:

- Valores em dinheiro trafegam sempre em **centavos inteiros** (campos terminados em `Cents`).
- Preço, disponibilidade e frete são **sempre calculados no servidor**; o navegador só envia ids e quantidades.
- A sessão fica num cookie `HttpOnly`, que o JavaScript da página não consegue ler.
- Cada tentativa de finalizar a compra envia um `Idempotency-Key`; repetir o envio nunca cria um segundo pedido.
