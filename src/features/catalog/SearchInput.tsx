import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { t } from "@/content/ka";
import { Input } from "@/shared/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** debounce მილიწამებში (300–500) */
  delay?: number;
};

/** ძებნა debounce-ით — მოთხოვნა იგზავნება მხოლოდ აკრეფის შეჩერების შემდეგ */
export function SearchInput({ value, onChange, delay = 400 }: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // URL-ის ცვლილება („უკან“, გასუფთავება) ველსაც ასინქრონებს
  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (local === value) return;
    const timer = window.setTimeout(() => onChange(local), delay);
    return () => window.clearTimeout(timer);
  }, [local, value, onChange, delay]);

  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        placeholder={t.catalog.searchPlaceholder}
        aria-label={t.catalog.search}
        type="search"
        className="pl-9 pr-9"
      />
      {local ? (
        <button
          type="button"
          aria-label={t.catalog.clearAll}
          onClick={() => setLocal("")}
          className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
