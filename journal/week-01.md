# კვირა 1 — FE-001 (ავტორიზაციის ეკრანები) + საფუძველი

## გაკეთდა

- გუნდის ინფრასტრუქტურა: `docs/`, `journal/`, ADR-ების სტრუქტურა, Trello-სთვის მზა backlog.
- ADR 0001 (სტეკი), ADR 0006 (ტოკენები + ტექსტი), ADR 0008 (FE-001-ის API-ზე დაკავშირება).
- დიზაინ-სისტემა: HSL ტოკენები, ქართული შრიფტი `Noto Sans Georgian`, `Cyber` ბრენდის პალიტრა.
- `src/shared/ui/`: Button, Input, PasswordInput, FormField, Alert, Badge, Spinner, EmptyState, ErrorState,
  SectionCard, ConfirmDialog, Pagination, Stepper, PriceTag, RatingStars — ყველა მდგომარეობით.
- FE-001: `/login`, `/register`, `/forgot-password` — ვალიდაცია ტიკეტის წესებით.

## ხელოვნური გადაწყვეტილებები

- FE-001 მხოლოდ მარკაპი უნდა ყოფილიყო, მაგრამ შემდეგი ტიკეტები ტოკენს საჭიროებს → დავაკავშირეთ რეალურ API-ზე (ADR 0008).
- `submit` ღილაკს არ ვთიშავთ არავალიდურ ფორმაზე — ტიკეტის მოთხოვნა.

## ღია კითხვები

- ფასის range-ის პარამეტრის სახელი (`minPrice`/`maxPrice`) — გადამოწმდა curl-ით (ADR 0002-ის mapping).
