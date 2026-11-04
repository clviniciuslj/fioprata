import type { Customer, OrderDetail } from "@/lib/api/contract";
import { seedOrders } from "./seed-orders";

/**
 * Estado da demonstração, só em memória: some ao reiniciar o servidor.
 * Fica em `globalThis` para sobreviver ao recarregamento de módulos em desenvolvimento.
 */

import { DEMO_CUSTOMER_EMAIL } from "./constants";

export { DEMO_CUSTOMER_EMAIL, DEMO_SESSION_COOKIE } from "./constants";

export interface DemoOrder extends OrderDetail {
  customerId: string;
}

export interface DemoStore {
  customers: Map<string, Customer>;
  sessions: Map<string, string>;
  emailTokens: Map<string, string>;
  resetTokens: Map<string, string>;
  orders: Map<string, DemoOrder>;
  /** chave de idempotência (por cliente) → número do pedido */
  idempotency: Map<string, string>;
  orderSeq: number;
}

function createStore(): DemoStore {
  const demoCustomer: Customer = { id: "c-demo", name: "Cliente Exemplo", email: DEMO_CUSTOMER_EMAIL, emailConfirmed: true };
  return {
    customers: new Map([[demoCustomer.id, demoCustomer]]),
    sessions: new Map(),
    emailTokens: new Map(),
    resetTokens: new Map(),
    orders: new Map(seedOrders.map((o) => [o.number, o])),
    idempotency: new Map(),
    orderSeq: 104820,
  };
}

const globalForDemo = globalThis as typeof globalThis & { __demoStore?: DemoStore };

export const demoStore: DemoStore = (globalForDemo.__demoStore ??= createStore());
