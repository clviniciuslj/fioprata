import { describe, expect, it } from "vitest";
import { parseCatalogParams } from "./catalog-params";

describe("parseCatalogParams", () => {
  it("usa novidades e página 1 por padrão", () => {
    expect(parseCatalogParams({})).toEqual({ sort: "novidades", page: 1 });
  });

  it("aceita ordenação válida", () => {
    expect(parseCatalogParams({ sort: "menor-preco" }).sort).toBe("menor-preco");
  });

  it("ignora ordenação desconhecida", () => {
    expect(parseCatalogParams({ sort: "xyz" }).sort).toBe("novidades");
  });

  it("ignora página não numérica", () => {
    expect(parseCatalogParams({ page: "abc" }).page).toBe(1);
  });

  it("ignora página negativa ou zero", () => {
    expect(parseCatalogParams({ page: "-3" }).page).toBe(1);
    expect(parseCatalogParams({ page: "0" }).page).toBe(1);
  });

  it("ignora página fracionária", () => {
    expect(parseCatalogParams({ page: "2.5" }).page).toBe(1);
  });

  it("usa o primeiro valor quando o parâmetro se repete", () => {
    expect(parseCatalogParams({ page: ["2", "5"] }).page).toBe(2);
  });
});
