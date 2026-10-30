import { API_BASE_URL } from "@/config/store";

/**
 * ერთადერთი HTTP კლიენტი მთელი აპლიკაციისთვის.
 * ყველა endpoint აქედან გადის — ტოკენი, შეცდომის კონვერტი და 401-ის ცენტრალური დამუშავება ერთ ადგილასაა.
 */

export type ApiErrorEnvelope = {
  message?: string;
  code?: string;
  errors?: Record<string, string>;
  retryAfterSeconds?: number;
};

export class ApiError extends Error {
  status: number;
  code: string;
  errors?: Record<string, string>;
  retryAfterSeconds?: number;

  constructor(status: number, payload: ApiErrorEnvelope) {
    super(payload.message ?? "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code ?? "UNKNOWN_ERROR";
    this.errors = payload.errors;
    this.retryAfterSeconds = payload.retryAfterSeconds;
  }

  /** ველის შეცდომა nested გასაღებით: errors["card.number"] */
  fieldError(field: string): string | undefined {
    return this.errors?.[field];
  }
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** თუ false — 401-ზე არ მოხდება გლობალური logout (მაგ. შესვლის მცდელობა) */
  handleUnauthorized?: boolean;
};

type TokenReader = () => string | null;
type UnauthorizedHandler = () => void;

let readToken: TokenReader = () => null;
let onUnauthorized: UnauthorizedHandler = () => undefined;

/** AuthProvider ამას აკავშირებს — client რჩება უცვლელი (ერთი ფაილი) */
export function configureApiAuth(reader: TokenReader, handler: UnauthorizedHandler) {
  readToken = reader;
  onUnauthorized = handler;
}

function buildUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, handleUnauthorized = true } = options;
  const token = readToken();

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, { code: "NETWORK_ERROR", message: "Network request failed" });
  }

  if (response.status === 204) return undefined as T;

  const raw = await response.text();
  let payload: unknown = undefined;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = undefined;
    }
  }

  if (response.ok) return (payload ?? undefined) as T;

  const envelope = (payload ?? {}) as ApiErrorEnvelope;
  if (response.status === 401 && handleUnauthorized) onUnauthorized();

  throw new ApiError(response.status, envelope);
}

/** GET-ის query მშენებლობა — undefined/null ველები გამოტოვებულია */
export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
