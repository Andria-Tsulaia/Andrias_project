import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  DEFAULT_SORT,
  readCatalogState,
  writeCatalogState,
  type CatalogUrlState,
} from "@/lib/url-params";
import type { FilterDef } from "@/api/types";

/**
 * კატალოგის მდგომარეობა URL-ში — useState არ გამოიყენება.
 * ბმული გასაზიარებელია, F5 და „უკან“ ფილტრებს ინახავს.
 */
export function useCatalogState(defs: FilterDef[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => readCatalogState(searchParams, defs), [searchParams, defs]);

  const applyState = useCallback(
    (next: CatalogUrlState) => {
      setSearchParams(writeCatalogState(next), { replace: false });
    },
    [setSearchParams],
  );

  /** ნებისმიერი ფილტრი/სორტი/ძებნა → გვერდი 1 */
  const update = useCallback(
    (patch: Partial<CatalogUrlState>, options: { resetPage?: boolean } = { resetPage: true }) => {
      const next: CatalogUrlState = {
        ...state,
        ...patch,
        page: options.resetPage === false ? patch.page ?? state.page : 1,
      };
      applyState(next);
    },
    [applyState, state],
  );

  const setFilterValues = useCallback(
    (key: string, values: string[]) => {
      const filters = { ...state.filters };
      if (values.length) filters[key] = values;
      else delete filters[key];
      update({ filters });
    },
    [state.filters, update],
  );

  const setPrice = useCallback((price: { min?: number; max?: number }) => update({ price }), [update]);

  const setSort = useCallback((sort: string) => update({ sort }), [update]);

  const setQuery = useCallback((q: string) => update({ q }), [update]);

  const setPage = useCallback(
    (page: number) => update({ page }, { resetPage: false }),
    [update],
  );

  const clearAll = useCallback(
    () => applyState({ filters: {}, price: {}, sort: DEFAULT_SORT, q: "", page: 1 }),
    [applyState],
  );

  return { state, setFilterValues, setPrice, setSort, setQuery, setPage, clearAll };
}
