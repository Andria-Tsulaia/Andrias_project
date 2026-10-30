import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { addressSchema, type AddressValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateAddress, useUpdateAddress } from "./useAddresses";
import type { Address } from "@/api/types";

type AddressFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** გადაცემისას — რედაქტირება, წინააღმდეგ შემთხვევაში — დამატება */
  address?: Address;
};

const EMPTY: AddressValues = {
  label: "",
  fullName: "",
  phone: "",
  city: "",
  address: "",
  isDefault: false,
};

/** მისამართის დამატება/რედაქტირება — 422 შეცდომები შესაბამის ველებზე მიება */
export function AddressFormDialog({ open, onOpenChange, address }: AddressFormDialogProps) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    reset(
      address
        ? {
            label: address.label ?? "",
            fullName: address.fullName,
            phone: address.phone,
            city: address.city,
            address: address.address,
            isDefault: address.isDefault,
          }
        : EMPTY,
    );
  }, [open, address, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      if (address) {
        await updateAddress.mutateAsync({ id: address.id, values });
      } else {
        await createAddress.mutateAsync(values);
      }
      toast.success(t.addresses.saved);
      onOpenChange(false);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setFormError(t.common.networkError);
        return;
      }
      if (error.code === "ADDRESS_LIMIT_REACHED") {
        setFormError(t.addresses.limitReached);
        return;
      }
      if (error.code === "ADDRESS_NOT_FOUND" || error.status === 404) {
        setFormError(t.addresses.errorTitle);
        return;
      }
      const messages = error.errors ?? {};
      const fields = Object.keys(messages);
      if (fields.length) {
        fields.forEach((field) => {
          if (field in EMPTY) setError(field as keyof AddressValues, { message: messages[field] });
        });
        return;
      }
      setFormError(t.common.somethingWrong);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? t.addresses.formTitleEdit : t.addresses.formTitleAdd}</DialogTitle>
          <DialogDescription>{t.addresses.hint}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError ? <Alert variant="error">{formError}</Alert> : null}

          <FormField id="address-label" label={`${t.addresses.fields.label} (${t.common.optional})`} error={errors.label?.message}>
            <Input
              placeholder={t.addresses.fields.labelPlaceholder}
              invalid={Boolean(errors.label)}
              {...fieldAriaProps("address-label", errors.label?.message)}
              {...register("label")}
            />
          </FormField>

          <FormField id="address-full-name" label={t.addresses.fields.fullName} error={errors.fullName?.message} required>
            <Input
              autoComplete="name"
              invalid={Boolean(errors.fullName)}
              {...fieldAriaProps("address-full-name", errors.fullName?.message)}
              {...register("fullName")}
            />
          </FormField>

          <FormField id="address-phone" label={t.addresses.fields.phone} error={errors.phone?.message} required>
            <Input
              type="tel"
              autoComplete="tel"
              placeholder={t.checkout.fields.phonePlaceholder}
              invalid={Boolean(errors.phone)}
              {...fieldAriaProps("address-phone", errors.phone?.message)}
              {...register("phone")}
            />
          </FormField>

          <FormField id="address-city" label={t.addresses.fields.city} error={errors.city?.message} required>
            <Input
              autoComplete="address-level2"
              invalid={Boolean(errors.city)}
              {...fieldAriaProps("address-city", errors.city?.message)}
              {...register("city")}
            />
          </FormField>

          <FormField id="address-line" label={t.addresses.fields.address} error={errors.address?.message} required>
            <Input
              autoComplete="street-address"
              placeholder={t.checkout.fields.addressPlaceholder}
              invalid={Boolean(errors.address)}
              {...fieldAriaProps("address-line", errors.address?.message)}
              {...register("address")}
            />
          </FormField>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" className="size-4 cursor-pointer accent-primary" {...register("isDefault")} />
            {t.addresses.fields.isDefault}
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? t.common.saving : t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
