# ADR 0001 — ტექნოლოგიური სტეკი

**სტატუსი:** მიღებულია · **თარიღი:** კვირა 1

## კონტექსტი

ტიკეტი ითხოვს: ფორმები სერვერის ვალიდაციის შეცდომების მიბმით, სერვერული მდგომარეობის ქეშირება,
URL-ის მართვა, დიზაინ-სისტემის ტოკენები.

## გადაწყვეტილება

- **React 19 + Vite + TypeScript** — სწრაფი dev-ციკლი, ტიპები API-ის კონტრაქტისთვის.
- **React Router (createBrowserRouter)** — URL ჭეშმარიტების წყაროა (იხ. ADR 0002).
- **TanStack Query** — ქეში, `isFetching`, `AbortController`-ის `signal`, მუტაციები `setQueryData`-ით.
- **React Hook Form + Zod** — `dirtyFields` (ADR-ის მოთხოვნა FE-004-ში), `setError` სერვერის შეცდომებისთვის.
- **Tailwind + shadcn/ui primitive + HSL design tokens** — სტილიზაცია ტოკენებით (ADR 0006).

## შედეგები

- ერთი HTTP კლიენტი (`src/api/client.ts`) და ერთი mapping URL → API (`src/lib/url-params.ts`).
- ახალი ბიბლიოთეკის დამატება მოითხოვს ADR-ს (მაგ. გალერეისთვის ცალკე ბიბლიოთეკა არ დაგვჭირდა).
