import { t } from "@/content/ka";
import { SORT_OPTIONS } from "@/lib/url-params";

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

/** დალაგება — მნიშვნელობები ტიკეტში ჩამოთვლილი ვარიანტებია */
export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="whitespace-nowrap text-muted-foreground">{t.catalog.sort}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-input bg-card px-2 text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t.catalog.sortOptions[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
