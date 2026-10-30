import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const supportedLngs = ["en", "ka"];
export const fallbackLng = "ka";

export const normalizeLanguage = (lng: string): string => {
  const code = lng.split("-")[0].toLowerCase();
  return supportedLngs.includes(code) ? code : fallbackLng;
};

export const getLanguageDirection = (lng: string): "ltr" | "rtl" => {
  return "ltr";
};

const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const bundledResources = Object.fromEntries(
  Object.entries(
    import.meta.glob<Record<string, string>>("../../public/locales/*.json", {
      eager: true,
      import: "default",
    }),
  )
    .filter(([filePath]) => filePath.includes("/en.json") || filePath.includes("/ka.json"))
    .map(([filePath, translation]) => {
      const code = filePath.match(/([^/]+)\.json$/)?.[1] ?? "";
      return [code, { translation }];
    }),
);

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    supportedLngs,
    resources: bundledResources,
    partialBundledLanguages: true,
    backend: { loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json` },
    detection: {
      order: ["cookie", "navigator", "htmlTag"],
      lookupCookie: "i18next",
      caches: ["cookie"],
      convertDetectedLanguage: (l) => normalizeLanguage(l) ?? fallbackLng,
    },
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

const syncDocumentLanguage = (lng: string) => {
  const code = normalizeLanguage(lng) ?? fallbackLng;
  document.documentElement.lang = code;
  document.documentElement.dir = getLanguageDirection(code);
};

i18n.on("initialized", () =>
  syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language),
);
i18n.on("languageChanged", syncDocumentLanguage);

export default i18n;