import { describe, expect, it } from "vitest";
import { catalogHref } from "./catalog-href";

describe("catalogHref", () => {
  it("omite ordenação e página padrão", () => {
    expect(catalogHref("/produtos", { sort: "novidades", page: 1 })).toBe("/produtos");
  });

  it("inclui ordenação diferente da padrão", () => {
    expect(catalogHref("/categorias/aneis", { sort: "menor-preco", page: 1 })).toBe("/categorias/aneis?sort=menor-preco");
  });

  it("inclui página a partir da segunda", () => {
    expect(catalogHref("/produtos", { sort: "maior-preco", page: 2 })).toBe("/produtos?sort=maior-preco&page=2");
  });
});
