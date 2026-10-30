/**
 * მაღაზიის ერთადერთი კონფიგურაციის წერტილი.
 * კატეგორიის slug აიღება მხოლოდ აქედან — კოდში სხვაგან არ იწერება.
 */

export const STORE = {
  /** ჩვენი კატეგორია (laptops = ლეპტოპები) */
  categorySlug: "laptops",
  brandName: "Cyber",
  ownerName: "ანდრია წულაია",
  /** პროდუქტების რაოდენობა გვერდზე (კატალოგი) */
  catalogPageSize: 12,
  /** პროდუქტის გვერდზე მსგავსი პროდუქტების ბადის სვეტები */
  relatedGridColumns: 4,
  /** Cart-ის qty-ის მაქსიმუმი (სერვერის წესი: 1–99) */
  maxCartQty: 99,
  /** ტაიმერი კოდის ხელახლა გაგზავნისთვის (წამი) */
  resendCooldownSeconds: 30,
  /** მისამართების ლიმიტი (სერვერის წესი) */
  maxAddresses: 10,
} as const;

export const API_BASE_URL = "https://shop-api-kbe6.onrender.com/api";
