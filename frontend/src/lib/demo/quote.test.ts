import { describe, expect, it } from "vitest";
import type { ShippingRule } from "@/lib/api/contract";
import { computeShippingCents } from "./shipping";
import { parseCartQuoteRequest, quoteCart } from "./quote";

const rule: ShippingRule = { defaultCents: 2490, byState: { SP: 1490 }, freeAboveCents: 39900 };

describe("computeShippingCents", () => {
  it("usa o valor do estado quando existe", () => {
    expect(computeShippingCents(rule, "SP", 10000)).toBe(1490);
  });

  it("usa o valor padrão para estado sem regra própria", () => {
    expect(computeShippingCents(rule, "BA", 10000)).toBe(2490);
  });

  it("é grátis a partir do valor mínimo", () => {
    expect(computeShippingCents(rule, "BA", 39900)).toBe(0);
  });

  it("é desconhecido sem estado abaixo do valor mínimo", () => {
    expect(computeShippingCents(rule, undefined, 10000)).toBeNull();
  });

  it("nunca é grátis quando a regra não tem valor mínimo", () => {
    expect(computeShippingCents({ ...rule, freeAboveCents: null }, "SP", 999999)).toBe(1490);
  });
});

// Produtos da demonstração usados abaixo:
// p01-a16 Anel Aparador Liso, Aro 16: R$ 89,00, 6 disponíveis
// p12-u   Brinco Ponto de Luz: R$ 89,00, 1 disponível
// p04-a16 Anel Martelado, Aro 16: esgotado
describe("quoteCart", () => {
  it("calcula linhas, subtotal, frete e total com preços do servidor", () => {
    const quote = quoteCart({ items: [{ variantId: "p01-a16", quantity: 2 }], state: "SP" });
    expect(quote.lines[0]).toMatchObject({ unitPriceCents: 8900, quantity: 2, lineTotalCents: 17800, issue: null });
    expect(quote.subtotalCents).toBe(17800);
    expect(quote.shippingCents).toBe(1490);
    expect(quote.totalCents).toBe(17800 + 1490);
    expect(quote.hasIssues).toBe(false);
  });

  it("informa quanto falta para o frete grátis", () => {
    const quote = quoteCart({ items: [{ variantId: "p01-a16", quantity: 2 }] });
    expect(quote.freeShippingRemainingCents).toBe(39900 - 17800);
    expect(quote.shippingCents).toBeNull();
    expect(quote.totalCents).toBe(17800);
  });

  it("descarta variações inexistentes", () => {
    const quote = quoteCart({ items: [{ variantId: "nao-existe", quantity: 1 }] });
    expect(quote.lines).toEqual([]);
    expect(quote.removedVariantIds).toEqual(["nao-existe"]);
  });

  it("marca quantidade acima do disponível", () => {
    const quote = quoteCart({ items: [{ variantId: "p12-u", quantity: 3 }] });
    expect(quote.lines[0]).toMatchObject({ issue: "insufficient", available: 1 });
    expect(quote.hasIssues).toBe(true);
  });

  it("marca peça esgotada e não soma no subtotal", () => {
    const quote = quoteCart({
      items: [
        { variantId: "p04-a16", quantity: 1 },
        { variantId: "p01-a16", quantity: 1 },
      ],
    });
    expect(quote.lines[0].issue).toBe("unavailable");
    expect(quote.subtotalCents).toBe(8900);
    expect(quote.hasIssues).toBe(true);
  });

  it("junta a mesma variação repetida antes de conferir o estoque", () => {
    const quote = quoteCart({
      items: [
        { variantId: "p12-u", quantity: 1 },
        { variantId: "p12-u", quantity: 1 },
      ],
    });
    expect(quote.lines).toHaveLength(1);
    expect(quote.lines[0]).toMatchObject({ quantity: 2, issue: "insufficient" });
    expect(quote.hasIssues).toBe(true);
  });

  it("não cobra frete de carrinho vazio", () => {
    const quote = quoteCart({ items: [], state: "SP" });
    expect(quote.shippingCents).toBeNull();
    expect(quote.totalCents).toBe(0);
  });
});

describe("parseCartQuoteRequest", () => {
  it("aceita um pedido válido", () => {
    expect(parseCartQuoteRequest({ items: [{ variantId: "p01-a16", quantity: 2 }], state: "SP" })).toEqual({
      ok: true,
      value: { items: [{ variantId: "p01-a16", quantity: 2 }], state: "SP" },
    });
  });

  it("recusa corpo que não é objeto", () => {
    expect(parseCartQuoteRequest("x").ok).toBe(false);
  });

  it("recusa quantidade fora de 1 a 10", () => {
    expect(parseCartQuoteRequest({ items: [{ variantId: "a", quantity: 0 }] }).ok).toBe(false);
    expect(parseCartQuoteRequest({ items: [{ variantId: "a", quantity: 11 }] }).ok).toBe(false);
    expect(parseCartQuoteRequest({ items: [{ variantId: "a", quantity: 1.5 }] }).ok).toBe(false);
  });

  it("recusa mais de 50 itens", () => {
    const items = Array.from({ length: 51 }, (_, i) => ({ variantId: `v${i}`, quantity: 1 }));
    expect(parseCartQuoteRequest({ items }).ok).toBe(false);
  });

  it("junta itens repetidos e recusa quando a soma passa de 10", () => {
    expect(
      parseCartQuoteRequest({
        items: [
          { variantId: "a", quantity: 2 },
          { variantId: "a", quantity: 3 },
        ],
      }),
    ).toEqual({ ok: true, value: { items: [{ variantId: "a", quantity: 5 }] } });
    expect(
      parseCartQuoteRequest({
        items: [
          { variantId: "a", quantity: 6 },
          { variantId: "a", quantity: 6 },
        ],
      }).ok,
    ).toBe(false);
  });

  it("recusa estado inválido", () => {
    expect(parseCartQuoteRequest({ items: [], state: "XX" }).ok).toBe(false);
  });
});
