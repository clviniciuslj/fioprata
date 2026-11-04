import { describe, expect, it } from "vitest";
import type { Address } from "@/lib/api/contract";
import { validateAddress, validateEmail, validateName, validatePassword } from "./validation";

describe("validatePassword", () => {
  it("recusa menos de 10 caracteres", () => {
    expect(validatePassword("123456789")).not.toBeNull();
  });

  it("aceita 10 caracteres sem exigir símbolos ou maiúsculas", () => {
    expect(validatePassword("1234567890")).toBeNull();
  });

  it("recusa mais de 128 caracteres", () => {
    expect(validatePassword("a".repeat(129))).not.toBeNull();
  });
});

describe("validateEmail", () => {
  it("exige o e-mail", () => {
    expect(validateEmail("   ")).not.toBeNull();
  });

  it("recusa formato inválido", () => {
    expect(validateEmail("maria@")).not.toBeNull();
    expect(validateEmail("maria exemplo@x.com")).not.toBeNull();
  });

  it("aceita e-mail válido com espaços nas pontas", () => {
    expect(validateEmail("  maria@example.com ")).toBeNull();
  });
});

describe("validateName", () => {
  it("exige pelo menos 2 caracteres", () => {
    expect(validateName(" a ")).not.toBeNull();
  });

  it("aceita nome comum", () => {
    expect(validateName("Maria Silva")).toBeNull();
  });
});

describe("validateAddress", () => {
  const valid: Address = {
    recipient: "Maria Silva",
    postalCode: "01310100",
    street: "Avenida Paulista",
    number: "1000",
    district: "Bela Vista",
    city: "São Paulo",
    state: "SP",
  };

  it("aceita endereço completo", () => {
    expect(validateAddress(valid)).toEqual({});
  });

  it("aponta CEP com menos de 8 dígitos", () => {
    expect(validateAddress({ ...valid, postalCode: "0131010" })).toHaveProperty("postalCode");
  });

  it("aponta campos obrigatórios vazios", () => {
    const errors = validateAddress({ ...valid, street: " ", number: "", district: "", city: "" });
    expect(Object.keys(errors).sort()).toEqual(["city", "district", "number", "street"]);
  });

  it("aponta estado inválido", () => {
    expect(validateAddress({ ...valid, state: "XX" as Address["state"] })).toHaveProperty("state");
  });
});
