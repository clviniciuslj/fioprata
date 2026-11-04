import { describe, expect, it } from "vitest";
import { MAX_LINE_QTY, addItem, parseStoredCart, removeItem, setQuantity } from "./cart";

describe("addItem", () => {
  it("adiciona uma variação nova", () => {
    expect(addItem([], "a", 2, 5)).toEqual([{ variantId: "a", quantity: 2 }]);
  });

  it("acumula a quantidade da mesma variação", () => {
    expect(addItem([{ variantId: "a", quantity: 2 }], "a", 1, 5)).toEqual([{ variantId: "a", quantity: 3 }]);
  });

  it("limita ao disponível", () => {
    expect(addItem([{ variantId: "a", quantity: 2 }], "a", 3, 4)).toEqual([{ variantId: "a", quantity: 4 }]);
  });

  it("limita ao máximo por linha mesmo com estoque maior", () => {
    expect(addItem([], "a", 15, 50)).toEqual([{ variantId: "a", quantity: MAX_LINE_QTY }]);
  });

  it("não adiciona variação sem estoque", () => {
    expect(addItem([], "a", 1, 0)).toEqual([]);
  });
});

describe("setQuantity", () => {
  const items = [
    { variantId: "a", quantity: 2 },
    { variantId: "b", quantity: 1 },
  ];

  it("altera a quantidade", () => {
    expect(setQuantity(items, "a", 4)).toEqual([
      { variantId: "a", quantity: 4 },
      { variantId: "b", quantity: 1 },
    ]);
  });

  it("remove quando a quantidade chega a zero", () => {
    expect(setQuantity(items, "a", 0)).toEqual([{ variantId: "b", quantity: 1 }]);
  });

  it("limita ao disponível informado", () => {
    expect(setQuantity(items, "a", 8, 3)[0]).toEqual({ variantId: "a", quantity: 3 });
  });

  it("ignora variação que não está no carrinho", () => {
    expect(setQuantity(items, "z", 3)).toEqual(items);
  });
});

describe("removeItem", () => {
  it("remove a variação", () => {
    expect(removeItem([{ variantId: "a", quantity: 2 }], "a")).toEqual([]);
  });
});

describe("parseStoredCart", () => {
  it("devolve vazio para ausência de dados", () => {
    expect(parseStoredCart(null)).toEqual([]);
  });

  it("devolve vazio para JSON inválido", () => {
    expect(parseStoredCart("{x")).toEqual([]);
  });

  it("devolve vazio quando não é uma lista", () => {
    expect(parseStoredCart('{"variantId":"a","quantity":1}')).toEqual([]);
  });

  it("descarta itens malformados ou com quantidade inválida", () => {
    expect(
      parseStoredCart('[{"variantId":"a","quantity":-2},{"variantId":"b","quantity":3},{"foo":1},{"variantId":"c","quantity":1.5},null]'),
    ).toEqual([{ variantId: "b", quantity: 3 }]);
  });

  it("soma duplicatas e limita ao máximo por linha", () => {
    expect(parseStoredCart('[{"variantId":"a","quantity":7},{"variantId":"a","quantity":6}]')).toEqual([
      { variantId: "a", quantity: MAX_LINE_QTY },
    ]);
  });
});
