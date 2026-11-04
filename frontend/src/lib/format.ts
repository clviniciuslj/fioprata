const TIME_ZONE = "America/Sao_Paulo";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const longDate = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeOnly = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

/** Valores monetários trafegam sempre em centavos inteiros. */
export function formatBRL(cents: number): string {
  return currency.format(cents / 100);
}

export function formatPostalCode(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function formatDate(iso: string): string {
  return longDate.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeOnly.format(new Date(iso));
}
