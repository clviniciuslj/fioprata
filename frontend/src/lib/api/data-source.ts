export type DataSource = "demo" | "api";

/** Lida no servidor. `demo` é o padrão até a API ASP.NET existir. */
export function dataSource(): DataSource {
  return process.env.STORE_DATA_SOURCE === "api" ? "api" : "demo";
}

export const API_MODE_NOT_IMPLEMENTED = "Modo API ainda não implementado";
