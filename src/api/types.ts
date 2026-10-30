/** API-ის ტიპები — ველები გადამოწმებულია ცოცხალ პასუხებზე (იხ. docs/api-notes.md). */

export type Currency = "GEL";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterType = "checkbox" | "radio" | "color" | "range";

export type FilterDef = {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
  unit?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description?: string;
  image?: string;
  productsCount: number;
  filters?: FilterDef[];
};

export type CategoryRef = {
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number | null;
  currency: Currency;
  rating: number;
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  warrantyMonths: number;
  image: string;
  images?: string[];
  specs?: Record<string, string>;
  attributes?: Record<string, string>;
  category?: CategoryRef;
  related?: Product[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort?: string;
};

export type CartProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  oldPrice: number | null;
  currency: Currency;
  stock: number;
  inStock: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  qty: number;
  product: CartProduct;
  lineTotal: number;
};

export type Cart = {
  items: CartItem[];
  totalQty: number;
  subtotal: number;
  currency: Currency;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type Address = {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
  createdAt?: string;
};

export type ShippingDetails = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
};

export type Checkout = {
  items: CartItem[];
  totalQty: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: Currency;
  freeShippingFrom: number;
  shipping: ShippingDetails;
  addresses: Address[];
};

export type PaymentCard = {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: Currency;
  shipping: ShippingDetails;
  payment?: { brand: string; last4: string };
  createdAt: string;
  paidAt?: string | null;
};

export type CreateOrderResponse = {
  orderId: string;
  status: string;
  total: number;
  currency: Currency;
  message?: string;
  expiresInMinutes?: number;
  devCode?: string;
};
