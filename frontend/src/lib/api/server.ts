import "server-only";
import type {
  CatalogQuery,
  Category,
  Page,
  ProductDetail,
  ProductSummary,
  ShippingRule,
} from "./contract";
import { API_MODE_NOT_IMPLEMENTED, dataSource } from "./data-source";
import * as demo from "@/lib/demo/catalog";
import { demoShippingRule } from "@/lib/demo/catalog-data";

/**
 * Acesso a dados usado pelas páginas renderizadas no servidor.
 * Na etapa do backend, o ramo `api` passa a chamar a API ASP.NET.
 */

function demoOnly<T>(read: () => T): Promise<T> {
  if (dataSource() !== "demo") {
    return Promise.reject(new Error(API_MODE_NOT_IMPLEMENTED));
  }
  return Promise.resolve(read());
}

export function listCategories(): Promise<Category[]> {
  return demoOnly(() => demo.listCategories());
}

export function getCategory(slug: string): Promise<Category | null> {
  return demoOnly(() => demo.getCategory(slug));
}

export function listProducts(query: CatalogQuery): Promise<Page<ProductSummary>> {
  return demoOnly(() => demo.listProducts(query));
}

export function listNewArrivals(limit: number): Promise<ProductSummary[]> {
  return demoOnly(() => demo.listNewArrivals(limit));
}

export function getProduct(slug: string): Promise<ProductDetail | null> {
  return demoOnly(() => demo.getProduct(slug));
}

export function listRelated(slug: string, limit: number): Promise<ProductSummary[]> {
  return demoOnly(() => demo.listRelated(slug, limit));
}

export function listProductSlugs(): Promise<string[]> {
  return demoOnly(() => demo.listProductSlugs());
}

export function getShippingRule(): Promise<ShippingRule> {
  return demoOnly(() => demoShippingRule);
}
