import { t } from "@/content/ka";

type SpecsTableProps = {
  specs: Record<string, string>;
};

/** მახასიათებლების ცხრილი — გასაღებები სერვერიდან, ერთი ციკლი (hardcode არ არის) */
export function SpecsTable({ specs }: SpecsTableProps) {
  const entries = Object.entries(specs);
  if (!entries.length) return null;

  return (
    <div className="surface-card overflow-hidden">
      <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground md:px-6">
        {t.product.specs}
      </h2>
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">{t.product.specs}</caption>
        <tbody>
          {entries.map(([key, value], index) => (
            <tr key={key} className={index % 2 === 1 ? "bg-muted/50" : undefined}>
              <th scope="row" className="w-2/5 break-words px-4 py-2.5 text-left align-top font-medium text-muted-foreground">
                {key}
              </th>
              <td className="break-words px-4 py-2.5 align-top text-foreground">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
