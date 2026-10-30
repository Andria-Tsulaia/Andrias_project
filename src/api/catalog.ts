import { api, buildQuery } from "./client";
import type { Category, Paginated, Product } from "./types";

export type ProductsQuery = {
  category: string;
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  /** ფილტრების მნიშვნელობები: { brand: "Lenovo,ASUS", ram: "16gb" } */
  filters?: Record<string, string>;
};

export function buildProductsQueryString(query: ProductsQuery): string {
  const params: Record<string, string | number | undefined> = {
    category: query.category,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
    q: query.q,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  };

  // ფილტრების გასაღებები (brand, cpu, ram…) პირდაპირ გადადის — სერვერი იცნობს მხოლოდ საკუთარს
  Object.entries(query.filters ?? {}).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  return buildQuery(params);
}

export const catalogApi = {
  categories: (signal?: AbortSignal) => api.get<{ items: Category[] }>("/categories", signal),

  category: (slug: string, signal?: AbortSignal) => api.get<Category>(`/categories/${slug}`, signal),

  products: (query: ProductsQuery, signal?: AbortSignal) =>
    api.get<Paginated<Product>>(`/products${buildProductsQueryString(query)}`, signal),

  product: (slug: string, signal?: AbortSignal) =>
    api.get<Product>(`/products/${encodeURIComponent(slug)}`, signal),
};
