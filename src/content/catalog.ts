import raw from "../../content/catalog.json";
import type { Catalog } from "./types";
import { validateCatalog } from "./validate";
export const catalog = raw as Catalog;
export function catalogErrors(development: boolean): string[] {
  return validateCatalog(catalog, !development);
}
