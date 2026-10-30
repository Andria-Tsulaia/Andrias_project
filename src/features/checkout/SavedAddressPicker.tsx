import { t } from "@/content/ka";
import { cn } from "@/lib/utils";
import type { Address } from "@/api/types";

type SavedAddressPickerProps = {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
};

/** რამდენიმე შენახული მისამართისას — არჩევა ავსებს ფორმის ველებს (id სერვერზე არ იგზავნება) */
export function SavedAddressPicker({ addresses, selectedId, onSelect }: SavedAddressPickerProps) {
  if (addresses.length <= 1) return null;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-foreground">{t.checkout.savedAddresses}</legend>
      <p className="text-xs text-muted-foreground">{t.checkout.savedAddressesHint}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {addresses.map((address) => {
          const active = address.id === selectedId;
          return (
            <label
              key={address.id}
              className={cn(
                "flex cursor-pointer gap-2.5 rounded-md border p-3 text-sm transition-colors",
                active ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-accent",
              )}
            >
              <input
                type="radio"
                name="saved-address"
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
                checked={active}
                onChange={() => onSelect(address)}
              />
              <span className="min-w-0 space-y-0.5">
                <span className="block font-medium text-foreground">{address.label || address.city}</span>
                <span className="block text-muted-foreground">{address.fullName}</span>
                <span className="block text-muted-foreground">{address.phone}</span>
                <span className="block text-muted-foreground">
                  {address.city}, {address.address}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
