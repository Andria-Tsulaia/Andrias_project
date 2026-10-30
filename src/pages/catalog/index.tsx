import { lazy, Suspense, useEffect, useRef } from "react";

import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Pagination } from "@/shared/ui/pagination";
import { ActiveFilterChips } from "@/features/catalog/ActiveFilterChips";
const FilterPanel = lazy(() => import("@/features/catalog/FilterPanel").then((module) => ({ default: module.FilterPanel })));
const MobileFilterSheet = lazy(() => import("@/features/catalog/MobileFilterSheet").then((module) => ({ default: module.MobileFilterSheet })));
import { ProductGrid } from "@/features/catalog/ProductGrid";
import { SearchInput } from "@/features/catalog/SearchInput";
import { SortSelect } from "@/features/catalog/SortSelect";
import { useCatalogState } from "@/features/catalog/useCatalogState";
import { useCategoryFilters, useProducts } from "@/features/catalog/useProducts";
import { countActiveFilters, toggleFilterValue } from "@/lib/url-params";

const CatalogPage = () => {
  const filtersQuery = useCategoryFilters(STORE.categorySlug);
  const defs = filtersQuery.data?.filters ?? [];

  const { state, setFilterValues, setPrice, setSort, setQuery, setPage, clearAll } = useCatalogState(defs);
  const productsQuery = useProducts(state, defs);

  const listRef = useRef<HTMLDivElement>(null);

  const products = productsQuery.data?.items ?? [];
  const total = productsQuery.data?.total ?? 0;
  const totalPages = productsQuery.data?.totalPages ?? 1;
  const limit = productsQuery.data?.limit ?? STORE.catalogPageSize;
  const activeCount = countActiveFilters(state, defs);
  const hasFilters = activeCount > 0 || state.q.trim().length > 0;
  const isInitialLoading = productsQuery.isLoading;

  // ბმული შეიძლება მოძველებული გვერდის ნომრით გაიხსნას — არასწორ გვერდზე არ ვაჩვენებთ ცარიელს
  useEffect(() => {
    if (!productsQuery.data) return;
    if (totalPages > 0 && state.page > totalPages) setPage(totalPages);
  }, [productsQuery.data, totalPages, state.page, setPage]);

  const goToPage = (page: number) => {
    setPage(page);
    const top = (listRef.current?.offsetTop ?? 0) - 88;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  };

  const panelProps = {
    defs,
    state,
    isLoading: filtersQuery.isLoading,
    isError: filtersQuery.isError,
    activeCount,
    onValueChange: setFilterValues,
    onPriceChange: setPrice,
    onClear: clearAll,
  };

  return (
    <div className="container-page py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.catalog.title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{t.catalog.subtitle}</p>
        <p
          className="min-h-5 text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {productsQuery.isSuccess ? t.catalog.productsCount(total) : "\u00a0"}
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20">
            <Suspense fallback={<div className="surface-card min-h-[520px] animate-pulse" aria-hidden="true" />}>
              <FilterPanel {...panelProps} />
            </Suspense>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4" ref={listRef}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <SearchInput value={state.q} onChange={setQuery} />
            </div>
            <div className="flex items-center gap-2">
              <Suspense fallback={<Button variant="outline" className="lg:hidden" disabled>{t.catalog.filters}</Button>}>
                <MobileFilterSheet {...panelProps} />
              </Suspense>
              <SortSelect value={state.sort} onChange={setSort} />
            </div>
          </div>

          <ActiveFilterChips
            defs={defs}
            state={state}
            onRemoveValue={(key, value) => setFilterValues(key, toggleFilterValue(state.filters[key] ?? [], value))}
            onRemovePrice={() => setPrice({ min: undefined, max: undefined })}
            onClear={clearAll}
          />

          {productsQuery.isError ? (
            <ErrorState title={t.catalog.error.title} onRetry={() => void productsQuery.refetch()} retryLabel={t.catalog.error.retry} />
          ) : products.length === 0 && !isInitialLoading ? (
            <EmptyState
              title={t.catalog.empty.title}
              hint={t.catalog.empty.hint}
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={clearAll}>
                    {t.catalog.empty.action}
                  </Button>
                ) : null
              }
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                isLoading={isInitialLoading}
              />

              {total > 0 ? (
                <div className="space-y-3 pt-2">
                  <p className="text-center text-sm text-muted-foreground">
                    {t.catalog.resultsRange((state.page - 1) * limit + 1, Math.min(state.page * limit, total), total)}
                  </p>
                  <Pagination page={state.page} totalPages={totalPages} onChange={goToPage} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
