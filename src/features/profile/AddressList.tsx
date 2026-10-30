import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";

import { t } from "@/content/ka";
import { STORE } from "@/config/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { SectionCard } from "@/shared/ui/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressFormDialog } from "./AddressFormDialog";
import { useAddresses, useRemoveAddress, useUpdateAddress } from "./useAddresses";
import type { Address } from "@/api/types";

/** მიწოდების მისამართები — დამატება, რედაქტირება, წაშლა და ნაგულისხმევის არჩევა */
export function AddressList() {
  const addressesQuery = useAddresses();
  const removeAddress = useRemoveAddress();
  const updateAddress = useUpdateAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>(undefined);

  const items = addressesQuery.data ?? [];
  const limitReached = items.length >= STORE.maxAddresses;

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setDialogOpen(true);
  };

  return (
    <SectionCard
      title={t.addresses.title}
      description={t.addresses.hint}
      action={
        <Button onClick={openCreate} disabled={limitReached} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          {t.addresses.add}
        </Button>
      }
    >
      {addressesQuery.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : addressesQuery.isError ? (
        <ErrorState
          title={t.addresses.errorTitle}
          onRetry={() => void addressesQuery.refetch()}
          retryLabel={t.addresses.retry}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={t.addresses.empty}
          icon={<MapPin aria-hidden="true" className="size-6" />}
          action={
            <Button variant="outline" onClick={openCreate}>
              {t.addresses.add}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {limitReached ? <p className="text-sm text-muted-foreground">{t.addresses.limitReached}</p> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((address) => (
              <article key={address.id} className="flex flex-col gap-3 rounded-lg border border-border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="truncate">{address.label || address.city}</span>
                      {address.isDefault ? <Badge variant="success">{t.addresses.defaultBadge}</Badge> : null}
                    </p>
                    <p className="text-sm text-foreground">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.address}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEdit(address)}>
                    <Pencil aria-hidden="true" className="size-4" />
                    {t.addresses.edit}
                  </Button>

                  {!address.isDefault ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateAddress.mutate({ id: address.id, values: { isDefault: true } })}
                    >
                      <Star aria-hidden="true" className="size-4" />
                      {t.addresses.makeDefault}
                    </Button>
                  ) : null}

                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="sm" aria-label={t.addresses.delete}>
                        <Trash2 aria-hidden="true" className="size-4 text-destructive" />
                      </Button>
                    }
                    title={t.addresses.deleteConfirmTitle(address.label || address.city)}
                    description={t.addresses.deleteConfirmText}
                    confirmLabel={t.addresses.delete}
                    onConfirm={() => removeAddress.mutate(address.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <AddressFormDialog open={dialogOpen} onOpenChange={setDialogOpen} address={editing} />
    </SectionCard>
  );
}
