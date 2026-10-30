import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { catalogApi } from "@/api/catalog";
import { STORE } from "@/config/store";
import { toApiQuery, type CatalogUrlState } from "@/lib/url-params";
import type { FilterDef } from "@/api/types";

/** ფილტრები სერვერიდან — ერთხელ გვერდის ჩატვირთვაზე */
export function useCategoryFilters(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: ({ signal }) => catalogApi.category(slug, signal),
    staleTime: 10 * 60_000,
  });
}

/** პროდუქტები — ყოველ ცვლილებაზე; ძველი შედეგები ჩანს, სანამ ახალი მოვა */
export function useProducts(state: CatalogUrlState, defs: FilterDef[]) {
  const { filters, minPrice, maxPrice } = toApiQuery(state, defs);

  return useQuery({
    queryKey: [
      "products",
      STORE.categorySlug,
      { page: state.page, sort: state.sort, q: state.q, filters, minPrice, maxPrice },
    ],
    queryFn: ({ signal }) =>
      catalogApi.products(
        {
          category: STORE.categorySlug,
          page: state.page,
          limit: STORE.catalogPageSize,
          sort: state.sort,
          q: state.q.trim() || undefined,
          minPrice,
          maxPrice,
          filters,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000, // <--- აი ეს დავამატეთ, რომ მყისიერად გამოიტანოს მონაცემები ქეშიდან და LCP მოიხსნას
  });
}