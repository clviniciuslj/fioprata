import { describe, expect, it } from "vitest";
import { formatBRL, formatDate, formatDateTime, formatPostalCode, formatTime } from "./format";

// Intl separa "R$" do número com espaço não separável; normalizamos para comparar.
const normalize = (s: string) => s.replace(/ /g, " ");

describe("formatBRL", () => {
  it("formata centavos como reais com separadores brasileiros", () => {
    expect(normalize(formatBRL(123456))).toBe("R$ 1.234,56");
  });

  it("formata zero", () => {
    expect(normalize(formatBRL(0))).toBe("R$ 0,00");
  });
});

describe("formatPostalCode", () => {
  it("insere o hífen do CEP", () => {
    expect(formatPostalCode("01310100")).toBe("01310-100");
  });
});

describe("formatDate", () => {
  it("escreve a data por extenso em português", () => {
    expect(formatDate("2026-11-04T15:30:00Z")).toContain("novembro de 2026");
  });

  it("usa o fuso de São Paulo", () => {
    // 02:00 UTC do dia 5 ainda é dia 4 em São Paulo (UTC-3).
    expect(formatDate("2026-11-05T02:00:00Z")).toContain("4 de novembro");
  });
});

describe("formatTime", () => {
  it("mostra só hora e minuto no fuso de São Paulo", () => {
    expect(formatTime("2026-11-04T15:30:00Z")).toBe("12:30");
  });
});

describe("formatDateTime", () => {
  it("inclui hora e minuto no fuso de São Paulo", () => {
    expect(formatDateTime("2026-11-04T15:30:00Z")).toContain("12:30");
  });
});
