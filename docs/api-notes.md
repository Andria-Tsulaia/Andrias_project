# API ჩანაწერები — `shop-api-kbe6`

ბაზა: `https://shop-api-kbe6.onrender.com/api` · Swagger: <https://shop-api-kbe6.onrender.com/docs>

ყველა ქვემოთ მოცემული ფაქტი **გადამოწმებულია ცოცხალ API-ზე** (curl) და არა მხოლოდ დოკუმენტაციიდან წაკითხული.

## შეცდომის კონვერტი

```json
{ "message": "Validation failed", "code": "VALIDATION_ERROR", "errors": { "email": "Enter a valid email address" } }
```

- `code` — მანქანურად წასაკითხი მიზეზი, `message` — ინგლისური ტექსტი (ინტერფეისზე არ ჩანს).
- `errors` — **ბრტყელი** ობიექტი; ჩექაუთზე გასაღებები **ჩადგმულია**: `"card.number"`, `"shipping.phone"`.
- `retryAfterSeconds` მოდის `429 RESEND_TOO_SOON`-ზე.

| კოდი | HTTP | სად |
|---|---|---|
| `UNAUTHORIZED` | 401 | ტოკენის გარეშე/ვადაგასული |
| `INVALID_CREDENTIALS` | 401 | შესვლა |
| `VALIDATION_ERROR` | 422 | ყველა ფორმა |
| `EMAIL_TAKEN` | 409 | რეგისტრაცია / `PATCH /auth/me` |
| `INVALID_CURRENT_PASSWORD` | **400** | `PATCH /auth/me` — ⚠️ არა 401! |
| `CART_ITEM_NOT_FOUND` | 404 | `PATCH/DELETE /cart/items/:id` |
| `INSUFFICIENT_STOCK` / `OUT_OF_STOCK` | 409 | კალათა, შეკვეთა |
| `CART_EMPTY` | 409 | `POST /orders`, `GET /checkout` |
| `CARD_DECLINED` | 402 | `POST /orders` |
| `INVALID_PAYMENT_CODE` | 400 | `POST /orders/:id/confirm` |
| `TOO_MANY_ATTEMPTS` | 429 | კოდის დადასტურება |
| `RESEND_TOO_SOON` | 429 | `POST /orders/:id/resend-code` (+`retryAfterSeconds`) |
| `ORDER_ALREADY_PAID` | 409 | კოდის დადასტურება |
| `ADDRESS_LIMIT_REACHED` | 409 | `POST /addresses` (მაქს. 10) |
| `ADDRESS_NOT_FOUND` | 404 | `PATCH/DELETE /addresses/:id` |
| `PRODUCT_NOT_FOUND` | 404 | `GET /products/:slug` |

## კატალოგი

### `GET /categories` → `{ items: Category[] }`
12 კატეგორია, თითოეულს `slug`, `name` (ქართულად), `nameEn`, `productsCount: 40`.
ჩვენი slug ინახება `src/config/store.ts`-ში (`laptops`).

### `GET /categories/{slug}` → `Category` + `filters[]`
```json
{ "key": "brand", "label": "ბრენდი", "type": "checkbox", "options": [{ "value": "Lenovo", "label": "Lenovo" }] }
{ "key": "price", "label": "ფასი", "type": "range", "min": 1210, "max": 9370, "unit": "₾" }
```
laptops-ის ფილტრები: `brand`, `price` (range), `cpu`, `ram`, `storage`, `screen`.
ტიპები: `checkbox` | `radio` | `color` | `range` — პანელი ერთი ციკლით იხატება, კოდში ფილტრების სია არ არის.

### `GET /products` → `{ items, total, page, limit, totalPages, sort }`

| პარამეტრი | მნიშვნელობა | შენიშვნა |
|---|---|---|
| `category` | სავალდებულო | `laptops` |
| `page`, `limit` | 1, 12 | `limit=5` მუშაობს; ჩვენ 12-ს ვიყენებთ |
| `sort` | `newest\|oldest\|price-asc\|price-desc\|rating-desc\|popular\|title-asc` | დადასტურებულია `price-asc`/`price-desc` |
| `q` | ძებნა | `q=Air` → 5, `q=Lenovo` → 6 |
| `minPrice`, `maxPrice` | რიცხვი | **`priceMin`/`priceMax`/`price=2000-3000` არ მუშაობს** |
| ფილტრის გასაღები (`brand`, `ram`…) | მნიშვნელობები **მძიმით** | `brand=Lenovo,ASUS` → 7 (ერთი = 6, ASUS = 1) |

⚠️ **უცნობი პარამეტრი აბრუნებს `total: 0`-ს** (მაგ. `search=Air`). ამიტომ მხოლოდ ნაცნობ გასაღებს ვგზავნით —
mapping ერთ ადგილასაა: `src/lib/url-params.ts` + `src/api/catalog.ts`.
⚠️ ფილტრის მნიშვნელობები **რეგისტრზე მგრძნობიარეა** (`ASUS`, არა `Asus`).

### `GET /products/{slug}`
დამატებით: `images[]` (3–5), `specs{}` (გასაღებები ქართულად, კატეგორიაზე დამოკიდებული),
`attributes{}` (ფილტრის მნიშვნელობები), `category{slug,name}`, `related[]` (8 პროდუქტი იმავე ფორმით).

## ავტორიზაცია

```
POST /auth/register { name, email, password } → 201 { user: {id,name,email,createdAt}, accessToken }
POST /auth/login    { email, password }       → 200 { user, accessToken }
GET  /auth/me                                  → 200 { user }            (Bearer)
PATCH /auth/me      { currentPassword, ...შეცვლილი } → 200 { user }
```
`currentPassword` **სავალდებულოა ყველა ცვლილებაზე** (სახელის ცვლილებაზეც). ელფოსტის შეცვლის შემდეგ ტოკენი ვალიდური რჩება.

## კალათა (სერვერზე ინახება, ტოკენი სავალდებულოა)

```
GET    /cart                → { items[], totalQty, subtotal, currency }
POST   /cart/items          { productId, qty } → 200/201 (იგივე პროდუქტი → რაოდენობა ემატება)
PATCH  /cart/items/:id      { qty }             → items[].id (არა productId!)
DELETE /cart/items/:id      → 204
```
პოზიცია: `{ id, productId, qty, product { id, slug, title, brand, image, price, oldPrice, currency, stock, inStock }, lineTotal }`.
⚠️ **ორი სხვადასხვა id:** `POST`-ში — `productId`, `PATCH/DELETE`-ში — `items[].id`.

## მისამართები

```
GET    /addresses             → { items: Address[] } (ნაგულისხმევი პირველი)
POST   /addresses             { label?, fullName, phone, city, address, isDefault? } → 201 { address }
PATCH  /addresses/:id         → { address }   (პასუხში მხოლოდ ერთი → სია თავიდან იტვირთება)
DELETE /addresses/:id         → 204
```
პირველი დამატებული ავტომატურად ნაგულისხმევია; `isDefault: true` ძველს ხსნის; ნაგულისხმევზე `false` → 422;
ნაგულისხმევის წაშლა → ნაგულისხმევი ხდება ყველაზე ძველი დარჩენილი.

## ჩექაუთი და შეკვეთა

```
GET  /checkout → { items, totalQty, subtotal, shippingFee, total, currency, freeShippingFrom, shipping{fullName,phone,city,address}, addresses[] }
POST /orders   { shipping{...}, card{number,holder,expiry,cvc} }
     → 201 { orderId, status: "pending_payment", total, currency, message, expiresInMinutes: 10, devCode }
POST /orders/:id/confirm { code } → 200 { order }   (status: "paid", payment{brand,last4})
POST /orders/:id/resend-code      → 200 | 429 { code: "RESEND_TOO_SOON", retryAfterSeconds }
GET  /orders                      → { items: Order[] }
GET  /orders/:id                  → { order }
```
დადასტურებული ქცევა: წარმატებული გადახდის შემდეგ **კალათა ცარიელია**; `devCode` მოდის პასუხში (სასწავლო რეჟიმი).
სატესტო ბარათები: `4242…4242` წარმატება · `4000 0000 0000 0002` → 402 · `4242 4242 4242 4241` → 422.

## CORS

`OPTIONS` preflight → `204`, `access-control-allow-origin` იმეორებს request-ის origin-ს →
ბრაუზერიდან პირდაპირ მუშაობს (დამატებითი პროქსი არ საჭიროა).
