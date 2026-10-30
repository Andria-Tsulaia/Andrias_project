import type { FilterDef } from "@/api/types";

/**
 * URL ↔ API პარამეტრების ერთადერთი mapping.
 * ფილტრები useState-ში არ ინახება — ჭეშმარიტების წყარო URL-ია.
 */

export const DEFAULT_SORT = "newest";
export const SORT_OPTIONS = [
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
  "rating-desc",
  "popular",
  "title-asc",
] as const;

/** range ტიპის ფილტრის გასაღები → API-ის პარამეტრები */
const RANGE_PARAMS: Record<string, { min: string; max: string }> = {
  price: { min: "minPrice", max: "maxPrice" },
};

export type CatalogUrlState = {
  /** { brand: ["Lenovo","ASUS"], ram: ["16gb"] } */
  filters: Record<string, string[]>;
  price: { min?: number; max?: number };
  sort: string;
  q: string;
  page: number;
};

export function readCatalogState(search: URLSearchParams, defs: FilterDef[]): CatalogUrlState {
  const filters: Record<string, string[]> = {};
  let price: { min?: number; max?: number } = {};

  defs.forEach((def) => {
    if (def.type === "range") {
      const params = RANGE_PARAMS[def.key] ?? { min: `${def.key}Min`, max: `${def.key}Max` };
      const min = Number(search.get(params.min));
      const max = Number(search.get(params.max));
      if (Number.isFinite(min) && search.get(params.min)) price = { ...price, min };
      if (Number.isFinite(max) && search.get(params.max)) price = { ...price, max };
      return;
    }

    const raw = search.get(def.key);
    const values = raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];
    if (values.length) filters[def.key] = values;
  });

  const page = Number(search.get("page"));
  const sort = search.get("sort");

  return {
    filters,
    price,
    sort: sort && (SORT_OPTIONS as readonly string[]).includes(sort) ? sort : DEFAULT_SORT,
    q: search.get("q") ?? "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function writeCatalogState(state: CatalogUrlState): URLSearchParams {
  const search = new URLSearchParams();

  Object.entries(state.filters).forEach(([key, values]) => {
    if (values.length) search.set(key, values.join(","));
  });

  if (state.price.min !== undefined) search.set(RANGE_PARAMS.price.min, String(state.price.min));
  if (state.price.max !== undefined) search.set(RANGE_PARAMS.price.max, String(state.price.max));

  if (state.sort && state.sort !== DEFAULT_SORT) search.set("sort", state.sort);
  if (state.q.trim()) search.set("q", state.q.trim());
  if (state.page > 1) search.set("page", String(state.page));

  return search;
}

/** URL-ის state → API-ის query (მხოლოდ სერვერისთვის ცნობადი გასაღებები) */
export function toApiQuery(state: CatalogUrlState, defs: FilterDef[]): {
  filters: Record<string, string>;
  minPrice?: number;
  maxPrice?: number;
} {
  const filters: Record<string, string> = {};
  defs.forEach((def) => {
    if (def.type === "range") return;
    const values = state.filters[def.key];
    if (values?.length) filters[def.key] = values.join(",");
  });

  return { filters, minPrice: state.price.min, maxPrice: state.price.max };
}

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function countActiveFilters(state: CatalogUrlState, defs: FilterDef[]): number {
  const selected = defs.reduce((total, def) => {
    if (def.type === "range") return total;
    return total + (state.filters[def.key]?.length ?? 0);
  }, 0);
  const rangeActive =
    (state.price.min !== undefined ? 1 : 0) + (state.price.max !== undefined ? 1 : 0);
  return selected + rangeActive;
}
