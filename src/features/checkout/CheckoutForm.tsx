import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreditCard } from "lucide-react";

import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { digitsOnly, formatCardExpiry, formatCardNumber } from "@/lib/format";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { SectionCard } from "@/shared/ui/section-card";
import { SavedAddressPicker } from "./SavedAddressPicker";
import { useConfirmOrder, useCreateOrder } from "./useCheckout";
import type { Address, Checkout } from "@/api/types";

/** ჩექაუთი — მიწოდება და ბარათი ერთ ეკრანზე; ბარათის მონაცემები არსად ინახება */
export function CheckoutForm({ checkout }: { checkout: Checkout }) {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const confirmOrder = useConfirmOrder();

  const [cardError, setCardError] = useState<string | null>(null);
  const [stockError, setStockError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    checkout.addresses.find((address) => address.isDefault)?.id ?? null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      shipping: {
        fullName: checkout.shipping.fullName ?? "",
        phone: checkout.shipping.phone ?? "",
        city: checkout.shipping.city ?? "",
        address: checkout.shipping.address ?? "",
      },
      card: { number: "", holder: "", expiry: "", cvc: "" },
    },
  });

  const shippingValues = watch("shipping");

  /** არჩეული მისამართი მნიშვნელობებით განისაზღვრება — ველის ხელით შესწორება არჩევანს ხსნის */
  const activeAddressId =
    checkout.addresses.find(
      (address) =>
        address.id === selectedAddressId &&
        address.fullName === shippingValues.fullName &&
        address.phone === shippingValues.phone &&
        address.city === shippingValues.city &&
        address.address === shippingValues.address,
    )?.id ?? null;

  const applyAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setValue("shipping.fullName", address.fullName, { shouldValidate: true });
    setValue("shipping.phone", address.phone, { shouldValidate: true });
    setValue("shipping.city", address.city, { shouldValidate: true });
    setValue("shipping.address", address.address, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(
    async (values) => {
      setCardError(null);
      setStockError(false);
      setFormError(null);

      try {
        const order = await createOrder.mutateAsync({
          shipping: values.shipping,
          card: {
            number: digitsOnly(values.card.number),
            holder: values.card.holder,
            expiry: values.card.expiry,
            cvc: values.card.cvc,
          },
        });

        // სასწავლო API აბრუნებს devCode-ს: დემო-გადახდა ერთი დაჭერით სრულდება.
        // თუ გარემო devCode-ს არ აბრუნებს, მომხმარებელი ჩვეულებრივ დადასტურების გვერდზე გადადის.
        if (order.devCode) {
          await confirmOrder.mutateAsync({ orderId: order.orderId, code: order.devCode });
          navigate(`/orders/${order.orderId}`, { replace: true });
          return;
        }

        navigate(`/checkout/confirm/${order.orderId}`);
      } catch (error) {
        if (!(error instanceof ApiError)) {
          setFormError(t.common.networkError);
          return;
        }
        if (error.code === "CARD_DECLINED" || error.status === 402) {
          setCardError(t.checkout.cardDeclined);
          return;
        }
        if (error.code === "CART_EMPTY") {
          navigate("/cart");
          return;
        }
        if (error.code === "INSUFFICIENT_STOCK") {
          setStockError(true);
          return;
        }
        if (error.status === 422) {
          const messages = error.errors ?? {};
          const keys = Object.keys(messages).filter((key) => key.includes("."));
          if (!keys.length) {
            setFormError(t.common.somethingWrong);
            return;
          }
          keys.forEach((key) => setError(key as keyof CheckoutValues, { message: messages[key] }));
          return;
        }
        if (error.status === 0) {
          setFormError(t.common.networkError);
          return;
        }
        setFormError(t.common.somethingWrong);
      }
    },
    (invalid) => {
      const first = Object.keys(invalid)[0];
      if (first === "shipping" || first === "card") {
        const nested = invalid[first as "shipping" | "card"];
        const inner = nested ? Object.keys(nested)[0] : undefined;
        if (inner) document.getElementById(`${first}-${inner}`)?.focus();
      }
    },
  );

  const numberField = register("card.number");
  const expiryField = register("card.expiry");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {formError ? <Alert variant="error">{formError}</Alert> : null}
      {stockError ? (
        <Alert
          variant="error"
          title={t.checkout.insufficientStock}
          actions={
            <Button asChild variant="outline" size="sm">
              <Link to="/cart">{t.checkout.goToCart}</Link>
            </Button>
          }
        />
      ) : null}

      <SectionCard title={t.checkout.shippingSection} bodyClassName="space-y-4">
        <SavedAddressPicker
          addresses={checkout.addresses}
          selectedId={activeAddressId}
          onSelect={applyAddress}
        />

        <FormField id="shipping-fullName" label={t.checkout.fields.fullName} error={errors.shipping?.fullName?.message} required>
          <Input
            autoComplete="name"
            invalid={Boolean(errors.shipping?.fullName)}
            {...fieldAriaProps("shipping-fullName", errors.shipping?.fullName?.message)}
            {...register("shipping.fullName")}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="shipping-phone" label={t.checkout.fields.phone} error={errors.shipping?.phone?.message} required>
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.checkout.fields.phonePlaceholder}
              invalid={Boolean(errors.shipping?.phone)}
              {...fieldAriaProps("shipping-phone", errors.shipping?.phone?.message)}
              {...register("shipping.phone")}
            />
          </FormField>

          <FormField id="shipping-city" label={t.checkout.fields.city} error={errors.shipping?.city?.message} required>
            <Input
              autoComplete="address-level2"
              invalid={Boolean(errors.shipping?.city)}
              {...fieldAriaProps("shipping-city", errors.shipping?.city?.message)}
              {...register("shipping.city")}
            />
          </FormField>
        </div>

        <FormField id="shipping-address" label={t.checkout.fields.address} error={errors.shipping?.address?.message} required>
          <Input
            autoComplete="street-address"
            placeholder={t.checkout.fields.addressPlaceholder}
            invalid={Boolean(errors.shipping?.address)}
            {...fieldAriaProps("shipping-address", errors.shipping?.address?.message)}
            {...register("shipping.address")}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title={t.checkout.cardSection}
        bodyClassName="space-y-4"
        action={<CreditCard aria-hidden="true" className="size-5 text-muted-foreground" />}
      >
        {cardError ? <Alert variant="error">{cardError}</Alert> : null}
        <p className="text-xs text-muted-foreground">{t.checkout.demoNotice}</p>

        <FormField id="card-number" label={t.checkout.fields.cardNumber} error={errors.card?.number?.message} required>
          <Input
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            invalid={Boolean(errors.card?.number)}
            {...fieldAriaProps("card-number", errors.card?.number?.message)}
            {...numberField}
            onChange={(event) => {
              const formatted = formatCardNumber(event.target.value);
              setValue("card.number", formatted, {
                shouldDirty: true,
                shouldValidate: Boolean(errors.card?.number),
              });
            }}
          />
        </FormField>

        <FormField id="card-holder" label={t.checkout.fields.cardHolder} error={errors.card?.holder?.message} required>
          <Input
            autoComplete="cc-name"
            invalid={Boolean(errors.card?.holder)}
            {...fieldAriaProps("card-holder", errors.card?.holder?.message)}
            {...register("card.holder")}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="card-expiry" label={t.checkout.fields.cardExpiry} error={errors.card?.expiry?.message} required>
            <Input
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              invalid={Boolean(errors.card?.expiry)}
              {...fieldAriaProps("card-expiry", errors.card?.expiry?.message)}
              {...expiryField}
              onChange={(event) => {
                const formatted = formatCardExpiry(event.target.value);
                setValue("card.expiry", formatted, {
                  shouldDirty: true,
                  shouldValidate: Boolean(errors.card?.expiry),
                });
              }}
            />
          </FormField>

          <FormField id="card-cvc" label={t.checkout.fields.cardCvc} error={errors.card?.cvc?.message} required>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              invalid={Boolean(errors.card?.cvc)}
              {...fieldAriaProps("card-cvc", errors.card?.cvc?.message)}
              {...register("card.cvc")}
            />
          </FormField>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? t.checkout.paying : t.checkout.pay}
        </Button>
      </SectionCard>
    </form>
  );
}
