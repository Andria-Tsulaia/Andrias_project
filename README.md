# Cyber — ლეპტოპების ონლაინ მაღაზია (storefront)

**გუნდი:** ანდრია წულაია · **კატეგორია:** `laptops` (ლეპტოპები) · **ინტერფეისი:** ქართული

Frontend-only React აპლიკაცია, რომელიც მუშაობს მოწოდებულ მაღაზიის API-ზე:
`https://shop-api-kbe6.onrender.com/api` · Swagger: <https://shop-api-kbe6.onrender.com/docs>

## გუნდი და როლები

| წევრი | როლი |
|---|---|
| ანდრია წულაია | Team Lead · Frontend Engineer (არქიტექტურა, API კლიენტი, კატალოგი, ჩექაუთი) |
| _შეავსე წევრი_ | _შეავსე როლი_ |
| _შეავსე წევრი_ | _შეავსე როლი_ |

> ცხრილის დარჩენილი მწკრივები გუნდის წევრებმა უნდა შეავსონ რეპოში.

## გაშვება

```bash
pnpm install
pnpm dev          # http://localhost:8080
pnpm check        # eslint + tsc --noEmit
pnpm run build    # პროდაქშენ ბილდი (dist/)
```

გარემოს ცვლადები არ საჭიროებს — API-ის მისამართი `src/config/store.ts`-შია.

## რა არის გაკეთებული (ტიკეტების მიხედვით)

| ტიკეტი | რას აკეთებს | სად |
|---|---|---|
| **FE-001** | ავტორიზაციის ეკრანები: `/login`, `/register`, `/forgot-password` — ვალიდაცია გაგზავნისას, შეცდომები ველის ქვეშ, focus პირველ არავალიდურ ველზე, პაროლის ჩვენება/დამალვა, ნეიტრალური პაროლის აღდგენის პასუხი | `src/features/auth`, `src/pages/login\|register\|forgot-password` |
| **FE-002** | API კლიენტი (ერთი ფაილი), ტიპები, საერთო UI კომპონენტები, URL ↔ API პარამეტრების mapping | `src/api`, `src/shared/ui`, `src/lib` |
| **FE-003** | კატალოგი: ფილტრები **სერვერიდან**, სორტი, ძებნა (debounce), პაგინაცია — ყველაფერი URL-ში | `src/pages/catalog`, `src/features/catalog` |
| **FE-004** | პროფილის რედაქტირება (dirty-only PATCH + მიმდინარე პაროლი) და მიწოდების მისამართები | `src/features/profile`, `src/pages/profile` |
| **FE-005** | კალათა: დამატება, რაოდენობა, წაშლა — სერვერზე ინახება, ერთი წყარო | `src/features/cart`, `src/pages/cart` |
| **FE-006** | ჩექაუთი: მიწოდება + ბარათი → კოდი ელფოსტაზე → შეკვეთა | `src/features/checkout`, `src/pages/checkout*` |
| **FE-007** | პროდუქტის გვერდი: გალერეა, specs, მარაგი, მსგავსი პროდუქტები | `src/features/product`, `src/pages/product` |

## მარშრუტები

| როუტი | დაცვა | აღწერა |
|---|---|---|
| `/` | — | გადამისამართება `/catalog`-ზე |
| `/catalog` | — | ფილტრები, სორტი, ძებნა, პაგინაცია (მდგომარეობა URL-ში) |
| `/product/:slug` | — | ერთი პროდუქტის გვერდი |
| `/login`, `/register`, `/forgot-password` | — | ავტორიზაცია |
| `/cart` | 🔒 | კალათა (`GET /cart`) |
| `/checkout` | 🔒 | მიწოდება + ბარათი (`GET /checkout`, `POST /orders`) |
| `/checkout/confirm/:orderId` | 🔒 | 6-ციფრიანი კოდის დადასტურება |
| `/orders`, `/orders/:orderId` | 🔒 | შეკვეთების ისტორია და დეტალები |
| `/profile` | 🔒 | პროფილი + მისამართები |

## სტრუქტურა

```
src/
  api/         client.ts (ერთი HTTP კლიენტი), types.ts, auth|catalog|cart|addresses|orders.ts
  config/      store.ts — კატეგორიის slug, პაგინაცია, ლიმიტები (ერთი ადგილი)
  content/     ka.ts — ყველა ქართული ტექსტი და ვალიდაციის შეტყობინება
  components/  ui/ (shadcn primitive), layout/ (Header, Footer, Layout, ProtectedRoute)
  features/    auth, catalog, product, cart, checkout, profile
  providers/   auth (token + user), cart (react-query ['cart'])
  shared/ui/   Button, Input, PasswordInput, FormField, Alert, Badge, Stepper, Pagination…
  lib/         format.ts, url-params.ts, validation.ts (zod)
  pages/       route-level გვერდები
```

## დოკუმენტაცია

- [`docs/api-notes.md`](docs/api-notes.md) — API-ის გადამოწმებული კონტრაქტი (პარამეტრები, შეცდომები, ხარვეზები)
- [`docs/backlog.md`](docs/backlog.md) — Trello-სთვის მზა ბარათები
- [`docs/adr/`](docs/adr) — არქიტექტურული გადაწყვეტილებები
- [`journal/`](journal) — კვირის ჩანაწერები

## ხელით შესამოწმებელი ფლოუ (დემოსთვის)

1. რეგისტრაცია → კატალოგი → ფილტრი „Lenovo“ → F5 (ფილტრი რჩება)
2. პროდუქტი → გალერეა → რაოდენობა 2 → „კალათაში დამატება“ (ბეჯი იზრდება)
3. კალათა → `+`/`−` → F5 (კალათა იგივეა)
4. ჩექაუთი → ბარათი `4242 4242 4242 4242`, ვადა `12/29`, CVC `123`
5. DevTools → Network → `POST /orders` → პასუხის `devCode` ხელით შეიყვანე (აპლიკაცია ავტომატურად არ ავსებს)
6. დადასტურება → შეკვეთის გვერდი, კალათის ბეჯი → 0
7. პროფილი → სახელის შეცვლა (მიმდინარე პაროლით) → ჰედერში მაშინვე ახლდება

სატესტო ბარათები: `4242 4242 4242 4242` (წარმატება), `4000 0000 0000 0002` (ბანკი უარყოფს),
`4242 4242 4242 4241` (არავალიდური ნომერი — 422).

## ცნობილი შეზღუდვები

- GitHub რეპო, collaborator-ების მოწვევა და Trello დაფა გუნდის მიერ ხელით იქმნება (კოდიდან არ იმართება).
- ავტორიზაცია მუშაობს რეალურ API-ზე (FE-002-ის შემდეგ); FE-001-ის ტიკეტში მხოლოდ UI იყო მოთხოვნილი — იხ. ADR 0008.
- ტოკენი ინახება `localStorage`-ში (იხ. ADR 0007) — XSS-ის რისკის კომპრომისი სასწავლო კონტექსტში.
#   A n d r i a s _ P r o j e c t  
 