# კვირა 2 — FE-002 (API კლიენტი) + FE-003 (კატალოგი)

## გაკეთდა

- `src/api/client.ts` — ერთი HTTP კლიენტი: `Authorization`, `AbortSignal`, `ApiError {status, code, errors}`,
  `401`-ის ცენტრალური დამუშავება (logout + `/login`).
- `src/api/types.ts` — ტიპები ცოცხალი პასუხების მიხედვით (`specs`, `images`, `attributes`, `related`).
- `src/config/store.ts` — `CATEGORY_SLUG = "laptops"` ერთ ადგილას.
- FE-003: ფილტრები **სერვერიდან**, სორტი, ძებნა (debounce 400ms), პაგინაცია — ყველა მდგომარეობა URL-ში (ADR 0002).
- მდგომარეობები: skeleton ბადე, error + retry, empty + clear, `isFetching` → ბადე ოდნავ გამჭვირვალე.

## აღმოჩენები API-ზე

- `search=` / `priceMin=` / `price=2000-3000` **არ** მუშაობს — უცნობი პარამეტრი აბრუნებს `total: 0`-ს.
  სწორია: `minPrice`/`maxPrice`, `q`. დეტალები: `docs/api-notes.md`.
- ერთ ფილტრში რამდენიმე მნიშვნელობა მძიმით გადადის: `brand=Lenovo,ASUS`.

## შემდეგ

- FE-007 (პროდუქტის გვერდი) — `related` იმავე ბარათს იყენებს.
