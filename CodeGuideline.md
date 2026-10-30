# Code Guideline

## Project Structure Overview

```
project-root/
  ├── docs/                  # API ჩანაწერები, ADR-ები, Trello-ის backlog
  ├── journal/               # კვირის ჩანაწერები (სასწავლო პროცესი)
  ├── public/
  │   └── locales/           # public/locales/{code}.json (i18n ინფრასტრუქტურა; ინტერფეისი ქართულია)
  ├── src/
  │   ├── api/               # HTTP კლიენტი, ტიპები და endpoint-ები
  │   ├── components/        # ui/ (shadcn primitive) + layout/ (Header, Footer, Layout…)
  │   ├── config/            # store.ts — კატეგორია, პაგინაცია, ლიმიტები
  │   ├── content/           # ka.ts — ყველა ქართული ტექსტი
  │   ├── features/          # auth, catalog, product, cart, checkout, profile
  │   ├── hooks/             # ზოგადი hook-ები (use-mobile)
  │   ├── lib/               # format, url-params, validation (zod), utils
  │   ├── pages/             # route-level გვერდები (თითო საქაღალდეში index.tsx)
  │   ├── providers/         # auth (token + user), cart (react-query)
  │   ├── shared/ui/         # მრავალჯერადი კომპონენტები დიზაინ-სისტემიდან
  │   ├── App.tsx            # პროვაიდერები (Query → Auth → Router)
  │   ├── router.tsx         # მარშრუტები, Layout და ProtectedRoute
  │   ├── main.tsx           # entry point
  │   └── index.css          # დიზაინ-ტოკენები (HSL ცვლადები)
  ├── tailwind.config.ts     # ტოკენების mapping
  └── ...
```

## Directory Responsibilities

- **api/**: `client.ts` — ერთადერთი HTTP კლიენტი (auth header, `ApiError`, `AbortSignal`, 401-ის ცენტრალური
  დამუშავება). დანარჩენი ფაილები მხოლოდ endpoint-ების აღწერაა. ახალი მოთხოვნა აქ ემატება, კომპონენტში `fetch` არ იწერება.
- **config/store.ts**: კატეგორიის slug, გვერდის ზომა, ლიმიტები (მაგ. მისამართები, resend-ის ტაიმერი) — ერთი ადგილი.
- **content/ka.ts**: ინტერფეისის ყველა ტექსტი და ვალიდაციის შეტყობინება ქართულად. კომპონენტში literal ტექსტი არ იწერება.
- **shared/ui/**: მხოლოდ მრავალჯერადი კომპონენტები (Button, Input, PasswordInput, FormField, Alert, Badge, Stepper,
  Pagination, EmptyState, ErrorState, SectionCard, ConfirmDialog, PriceTag, RatingStars) — ყოველ მათგანს აქვს
  default/hover/focus/disabled/error მდგომარეობა.
- **components/ui/**: shadcn primitive-ები (აუცილებლობისას). **components/layout/**: ჩარჩო და დაცული მარშრუტი.
- **features/**: დომენური ლოგიკა კატეგორიებად (კატალოგის ფილტრები, კალათის ხაზი, ჩექაუთის ფორმა…).
- **lib/url-params.ts**: URL ↔ API პარამეტრების **ერთადერთი** mapping (ფილტრები `useState`-ში არ ინახება).
- **lib/validation.ts**: Zod სქემები React Hook Form-ისთვის; სერვერის შეცდომების გასაღებები იგივე სახელებს იყენებს
  (`card.number`, `shipping.phone`).
- **providers/**: `auth` (token + user + 401-ის რეაქცია) და `cart` (react-query `['cart']` — ერთი წყარო ბეჯისთვის,
  კალათის გვერდისთვის და ჩექაუთისთვის).
- **pages/**: თითო გვერდი საკუთარ საქაღალდეში `index.tsx`-ით; გვერდისთვის სპეციფიკური კომპონენტი — იმავე საქაღალდეში.

## How to Add New Code

### 1. ახალი გვერდი

1. `src/pages/<route>/index.tsx`
2. მარშრუტი დაემატოს `src/router.tsx`-ში **catch-all `*`-მდე**; დაცული გვერდი — `ProtectedRoute`-ის შვილებში.
3. გვერდისთვის სპეციფიკური კომპონენტები — `src/features/<domain>/`-ში.

### 2. ახალი კომპონენტი

- თუ სადმე სხვაგანაც გამოჩნდება (ან „შესაძლოა“) → `src/shared/ui/`.
- თუ მხოლოდ ერთ გვერდს/დომენს ეკუთვნის → `src/features/<domain>/`.
- ფერი/ზომა მხოლოდ ტოკენებიდან (`src/index.css`, `tailwind.config.ts`); `bg-white`/`text-black` აკრძალულია.

### 3. ახალი API მოთხოვნა

1. ტიპი → `src/api/types.ts` (ველები ცოცხალი პასუხიდან!)
2. ფუნქცია → შესაბამის `src/api/<domain>.ts` ფაილში (`api.get/post/patch/delete`)
3. მოხმარება — TanStack Query-ით; შეცდომები `ApiError`-დან `code`-ით მუშავდება.

### 4. ახალი ტექსტი

ჯერ `src/content/ka.ts`. თარიღი/ფასი — `src/lib/format.ts`-ით (მაგ. `formatPrice` → „2 650 ₾“).

## Coding Best Practices

- **ერთი მოდული — ერთი პასუხისმგებლობა**: მცირე ფაილები (< 150 მწკრივი სასურველია).
- **მდგომარეობა URL-ში**, სადაც გაზიარებადი უნდა იყოს (კატალოგი); სერვერული მდგომარეობა — TanStack Query-ში.
- **ჯამები არ ითვლება ფრონტზე** — სერვერის `lineTotal`/`subtotal`/`total`.
- **ბარათის მონაცემები** არასდროს: storage, URL, store, console, log.
- **შეცდომები ველზე**, არა ზოგად ბანერში (გარდა ბიზნეს-შეცდომებისა: `CARD_DECLINED`, `TOO_MANY_ATTEMPTS`).
- **წვდომადობა**: ყველა ინტერაქტიულ ელემენტს `aria-label`/`alt`; ფოკუსის ხილული ring; კლავიატურით ნავიგაცია.
- **ტესტირება ხელით**: 360 / 768 / 1440, კონსოლის სისუფთავე, F5 და „უკან“ ყოველ ფლოუზე.

**Important:** ახალი მოდულის ან გვერდის დამატება/წაშლა მოითხოვს ამ დოკუმენტის განახლებას.
