import { describe, expect, it } from "vitest";
import {
  findVariant,
  getCategory,
  getProduct,
  listCategories,
  listNewArrivals,
  listProducts,
  listProductSlugs,
  listRelated,
} from "./catalog";

describe("listProducts", () => {
  it("filtra pela categoria", () => {
    const page = listProducts({ category: "aneis", sort: "novidades", page: 1 });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((p) => p.categorySlug === "aneis")).toBe(true);
  });

  it("ordena por menor preço", () => {
    const { items } = listProducts({ sort: "menor-preco", page: 1 });
    const prices = items.map((p) => p.fromPriceCents);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("ordena por maior preço", () => {
    const { items } = listProducts({ sort: "maior-preco", page: 1 });
    const prices = items.map((p) => p.fromPriceCents);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it("pagina de 12 em 12", () => {
    const first = listProducts({ sort: "novidades", page: 1 });
    const second = listProducts({ sort: "novidades", page: 2 });
    expect(first.pageSize).toBe(12);
    expect(first.items).toHaveLength(12);
    expect(second.items.length).toBe(first.totalItems - 12);
    const firstIds = new Set(first.items.map((p) => p.id));
    expect(second.items.some((p) => firstIds.has(p.id))).toBe(false);
  });

  it("devolve página vazia além da última, mantendo o total de páginas", () => {
    const page = listProducts({ sort: "novidades", page: 999 });
    expect(page.items).toEqual([]);
    expect(page.totalPages).toBe(Math.ceil(page.totalItems / 12));
  });

  it("categoria inexistente não traz produtos", () => {
    const page = listProducts({ category: "inexistente", sort: "novidades", page: 1 });
    expect(page.items).toEqual([]);
    expect(page.totalPages).toBe(0);
  });
});

describe("getProduct", () => {
  it("devolve null para slug inexistente", () => {
    expect(getProduct("inexistente")).toBeNull();
  });

  it("marca como esgotado quando todas as variações estão zeradas", () => {
    const soldOut = listProducts({ sort: "novidades", page: 1 }).items
      .concat(listProducts({ sort: "novidades", page: 2 }).items)
      .find((p) => p.soldOut);
    expect(soldOut).toBeDefined();
    const detail = getProduct(soldOut!.slug)!;
    expect(detail.variants.every((v) => v.available === 0)).toBe(true);
  });

  it("calcula o menor preço e a faixa de preço a partir das variações", () => {
    const all = listProducts({ sort: "novidades", page: 1 }).items
      .concat(listProducts({ sort: "novidades", page: 2 }).items);
    for (const summary of all) {
      const detail = getProduct(summary.slug)!;
      const prices = detail.variants.map((v) => v.priceCents);
      expect(summary.fromPriceCents).toBe(Math.min(...prices));
      expect(summary.hasPriceRange).toBe(new Set(prices).size > 1);
    }
  });
});

describe("categorias", () => {
  it("lista as cinco categorias", () => {
    expect(listCategories().map((c) => c.slug)).toEqual([
      "aneis",
      "colares",
      "brincos",
      "pulseiras",
      "pingentes",
    ]);
  });

  it("devolve null para categoria inexistente", () => {
    expect(getCategory("relogios")).toBeNull();
  });
});

describe("novidades e relacionados", () => {
  it("lista novidades limitadas ao pedido", () => {
    expect(listNewArrivals(4)).toHaveLength(4);
  });

  it("relacionados não incluem o próprio produto e priorizam a mesma categoria", () => {
    const product = getProduct(listProducts({ category: "aneis", sort: "novidades", page: 1 }).items[0].slug)!;
    const related = listRelated(product.slug, 4);
    expect(related).toHaveLength(4);
    expect(related.some((p) => p.id === product.id)).toBe(false);
    expect(related[0].categorySlug).toBe("aneis");
  });
});

describe("listProductSlugs", () => {
  it("lista o slug de todos os produtos, sem repetição", () => {
    const slugs = listProductSlugs();
    const total = listProducts({ sort: "novidades", page: 1 }).totalItems;
    expect(slugs).toHaveLength(total);
    expect(new Set(slugs).size).toBe(total);
  });
});

describe("findVariant", () => {
  it("encontra produto e variação pelo id da variação", () => {
    const product = getProduct(listProducts({ sort: "novidades", page: 1 }).items[0].slug)!;
    const found = findVariant(product.variants[0].id);
    expect(found?.product.id).toBe(product.id);
    expect(found?.variant.id).toBe(product.variants[0].id);
  });

  it("devolve null para variação inexistente", () => {
    expect(findVariant("nao-existe")).toBeNull();
  });
});
