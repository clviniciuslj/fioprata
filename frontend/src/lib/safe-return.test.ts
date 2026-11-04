import { describe, expect, it } from "vitest";
import { safeReturnPath } from "./safe-return";

describe("safeReturnPath", () => {
  it.each([
    ["//evil.com"],
    ["https://evil.com"],
    ["/\\evil.com"],
    ["javascript:alert(1)"],
    ["evil.com"],
    ["/%2F%2Fevil.com"],
    ["/\t/evil.com"],
  ])("recusa %s", (value) => {
    expect(safeReturnPath(value)).toBe("/minha-conta");
  });

  it("aceita caminho interno com busca", () => {
    expect(safeReturnPath("/minha-conta/pedidos?pagina=2")).toBe("/minha-conta/pedidos?pagina=2");
  });

  it("usa o padrão quando ausente", () => {
    expect(safeReturnPath(null)).toBe("/minha-conta");
    expect(safeReturnPath(undefined, "/finalizar")).toBe("/finalizar");
  });
});
