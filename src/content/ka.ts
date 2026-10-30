
import { t as ka } from "./ka-ge";
import { en } from "./en";

function getLanguage(): "ka" | "en" {
  if (typeof window === "undefined") return "ka";

  try {
    return localStorage.getItem("app_language") === "en" ? "en" : "ka";
  } catch {
    return "ka";
  }
}

function getValue(path: PropertyKey[]): unknown {
  const dictionary = getLanguage() === "en" ? en : ka;

  let value: any = dictionary;

  for (const key of path) {
    if (value == null) return undefined;
    value = value[key as keyof typeof value];
  }

  return value;
}

function createTranslationProxy(path: PropertyKey[] = []): any {
  const target = function () {};

  return new Proxy(target, {
    get(_target, property) {
      if (property === "then") return undefined;
      if (typeof property === "symbol") return undefined;

      const nextPath = [...path, property];
      const value = getValue(nextPath);

      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          return createTranslationProxy(nextPath);
        }

        return value;
      }

      const fallback = getValueFromGeorgian(nextPath);

      if (fallback !== undefined && fallback !== null) {
        if (typeof fallback === "object") {
          return createTranslationProxy(nextPath);
        }

        return fallback;
      }

      return undefined;
    },

    apply(_target, _thisArg, args) {
      const value = getValue(path);
      const fallback = getValueFromGeorgian(path);
      const fn = typeof value === "function" ? value : fallback;

      if (typeof fn === "function") {
        return fn(...args);
      }

      return fn;
    },
  });
}

function getValueFromGeorgian(path: PropertyKey[]): unknown {
  let value: any = ka;

  for (const key of path) {
    if (value == null) return undefined;
    value = value[key as keyof typeof value];
  }

  return value;
}

export const t = createTranslationProxy() as typeof ka;
