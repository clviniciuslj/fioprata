/**
 * Contrato entre a loja e o backend. Os mesmos tipos valem para os dados de
 * demonstração e, na etapa do backend, para a API ASP.NET Core.
 * Valores monetários são sempre centavos inteiros (sufixo `Cents`).
 */

export const UF_LIST = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
  "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
] as const;

export type UF = (typeof UF_LIST)[number];

export function isUF(value: unknown): value is UF {
  return typeof value === "string" && (UF_LIST as readonly string[]).includes(value);
}

// Catálogo

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  /** Ex.: "Aro 16", "45 cm". `null` quando o produto tem uma única versão. */
  label: string | null;
  priceCents: number;
  available: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  fromPriceCents: number;
  hasPriceRange: boolean;
  images: ProductImage[];
  isNew: boolean;
  soldOut: boolean;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  care: string;
  specs: ProductSpec[];
  /** Nome da escolha de variação, ex.: "Numeração", "Comprimento". */
  variantLabel: string | null;
  variants: ProductVariant[];
}

export type CatalogSort = "novidades" | "menor-preco" | "maior-preco";

export interface CatalogQuery {
  category?: string;
  sort: CatalogSort;
  page: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ShippingRule {
  defaultCents: number;
  byState: Partial<Record<UF, number>>;
  freeAboveCents: number | null;
}

// Carrinho

export interface CartItemInput {
  variantId: string;
  quantity: number;
}

export interface CartQuoteRequest {
  items: CartItemInput[];
  state?: UF;
}

export type CartLineIssue = "unavailable" | "insufficient";

export interface CartQuoteLine {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string | null;
  image: ProductImage | null;
  unitPriceCents: number;
  quantity: number;
  available: number;
  lineTotalCents: number;
  issue: CartLineIssue | null;
}

export interface CartQuote {
  lines: CartQuoteLine[];
  /** Variações que não existem mais; o carrinho do navegador deve descartá-las. */
  removedVariantIds: string[];
  subtotalCents: number;
  /** `null` enquanto a UF de entrega não for informada. */
  shippingCents: number | null;
  freeShippingRemainingCents: number | null;
  totalCents: number;
  hasIssues: boolean;
}

// Conta

export interface Customer {
  id: string;
  name: string;
  email: string;
  emailConfirmed: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  customer: Customer;
  /** Só existe em modo demonstração: o link que iria por e-mail. */
  demoConfirmationPath?: string;
}

export interface ForgotPasswordResponse {
  /** Só existe em modo demonstração: o link que iria por e-mail, quando o e-mail existe. */
  demoResetPath?: string;
}

// Pedidos

export interface Address {
  recipient: string;
  /** 8 dígitos, sem hífen. */
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: UF;
}

export type OrderStatus =
  | "awaiting_payment"
  | "payment_approved"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "expired";

export interface OrderLine {
  productName: string;
  variantLabel: string | null;
  sku: string;
  image: ProductImage | null;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface OrderSummary {
  number: string;
  createdAt: string;
  status: OrderStatus;
  totalCents: number;
  itemCount: number;
}

export interface OrderDetail extends OrderSummary {
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  address: Address;
  /** Até quando o estoque fica reservado enquanto o pagamento não chega. */
  reservedUntil: string | null;
  history: OrderEvent[];
  trackingCode: string | null;
}

export interface CreateOrderRequest {
  items: CartItemInput[];
  address: Address;
}

export interface CreateOrderResponse {
  number: string;
  status: OrderStatus;
  totalCents: number;
  reservedUntil: string | null;
}

// Erros

/** Formato de erro de todas as rotas `/api/*` (compatível com ProblemDetails). */
export interface ApiError {
  title: string;
  errors?: Record<string, string[]>;
}
