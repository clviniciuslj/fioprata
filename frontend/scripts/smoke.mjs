// Teste de fumaça: sobe o build de produção (`npm run build` antes) e confere as rotas principais.
// Uso: npm run smoke
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));

const port = await new Promise((resolve) => {
  const srv = createServer().listen(0, () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});
const base = `http://localhost:${port}`;
const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  cwd: root,
  env: { ...process.env, STORE_DATA_SOURCE: "demo" },
  stdio: "ignore",
});

const failures = [];
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++;
  else failures.push(`${name}${detail ? ` (${detail})` : ""}`);
}

async function get(path, init = {}) {
  return fetch(base + path, { redirect: "manual", ...init });
}

try {
  let up = false;
  for (let i = 0; i < 100 && !up; i++) {
    try {
      up = (await fetch(base)).ok;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  if (!up) throw new Error("o servidor não subiu");

  const publicRoutes = [
    "/",
    "/produtos",
    "/produtos?sort=menor-preco&page=2",
    "/produtos?page=abc&sort=xyz",
    "/categorias/aneis",
    "/produtos/anel-trancado",
    "/carrinho",
    "/finalizar",
    "/entrar",
    "/cadastro",
    "/recuperar-senha",
    "/redefinir-senha",
    "/confirmar-email",
    "/politicas/privacidade",
    "/politicas/troca-e-devolucao",
    "/contato",
  ];
  for (const path of publicRoutes) {
    const res = await get(path);
    check(`GET ${path} → 200`, res.status === 200, `recebeu ${res.status}`);
  }

  const home = await get("/");
  const homeHtml = await home.text();
  check("faixa de demonstração presente", homeHtml.includes("Ambiente de demonstração"));
  check("X-Frame-Options: DENY", home.headers.get("x-frame-options") === "DENY");
  check("X-Content-Type-Options: nosniff", home.headers.get("x-content-type-options") === "nosniff");
  check("sem cabeçalho X-Powered-By", !home.headers.has("x-powered-by"));

  for (const path of ["/produtos/inexistente", "/categorias/inexistente"]) {
    const first = await get(path);
    const html = await first.text();
    check(`${path}: página "não encontrada" com noindex`, html.includes("Página não encontrada") && html.includes("noindex"));
    const second = await get(path);
    check(`${path}: 404 a partir do 2º acesso`, second.status === 404, `recebeu ${second.status}`);
  }
  const unknown = await get("/nao-existe");
  check("rota inexistente → 404", unknown.status === 404, `recebeu ${unknown.status}`);

  const account = await get("/minha-conta");
  check(
    "/minha-conta sem sessão → login",
    account.status === 307 && (account.headers.get("location") ?? "").includes("/entrar?voltar=%2Fminha-conta"),
    `${account.status} ${account.headers.get("location")}`,
  );

  const json = (body) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const quoteOk = await get("/api/cart/quote", json({ items: [{ variantId: "p01-a16", quantity: 1 }], state: "SP" }));
  check("cotação válida → 200", quoteOk.status === 200, `recebeu ${quoteOk.status}`);
  const quoteBad = await get("/api/cart/quote", json({ items: [{ variantId: "p01-a16", quantity: 99 }] }));
  check("cotação inválida → 400", quoteBad.status === 400, `recebeu ${quoteBad.status}`);

  const login = await get("/api/auth/login", json({ email: "cliente@example.com", password: "qualquer-senha" }));
  const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
  check("login demo → 200 com cookie HttpOnly", login.status === 200 && /httponly/i.test(login.headers.get("set-cookie") ?? ""));

  const withSession = await get("/minha-conta", { headers: { cookie } });
  check("/minha-conta com sessão → 200", withSession.status === 200, `recebeu ${withSession.status}`);

  const order = {
    items: [{ variantId: "p01-a16", quantity: 1 }],
    address: { recipient: "Teste", postalCode: "01310100", street: "Rua", number: "1", district: "Centro", city: "São Paulo", state: "SP" },
  };
  const orderInit = (key) => ({ ...json(order), headers: { "Content-Type": "application/json", cookie, "Idempotency-Key": key } });
  const key = `smoke-${Date.now()}`;
  const first = await (await get("/api/orders", orderInit(key))).json();
  const second = await (await get("/api/orders", orderInit(key))).json();
  check("pedido criado aguardando pagamento", first.status === "awaiting_payment", JSON.stringify(first));
  check("mesma Idempotency-Key → mesmo pedido", first.number && first.number === second.number, `${first.number} / ${second.number}`);
  const noSession = await get("/api/orders", { ...json(order), headers: { "Content-Type": "application/json", "Idempotency-Key": `${key}-x` } });
  check("pedido sem sessão → 401", noSession.status === 401, `recebeu ${noSession.status}`);
} catch (error) {
  failures.push(`erro inesperado: ${error.message}`);
} finally {
  server.kill();
}

console.log(`\nFumaça: ${passed} verificações passaram, ${failures.length} falharam.`);
for (const f of failures) console.log(`  FALHOU: ${f}`);
process.exit(failures.length === 0 ? 0 : 1);
