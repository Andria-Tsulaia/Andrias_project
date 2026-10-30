import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { ApiError } from "@/api/client";
import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { useAuth } from "@/providers/auth/use-auth";
import { useConfirmOrder, useResendOrderCode } from "@/features/checkout/useCheckout";

/** კოდის ეკრანი — orderId URL-შია, ამიტომ F5-ზე არაფერი იკარგება */
const CheckoutConfirmPage = () => {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirmOrder = useConfirmOrder();
  const resendCode = useResendOrderCode();

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(STORE.resendCooldownSeconds);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBanner(null);

    if (!/^\d{6}$/.test(code)) {
      setCodeError(t.validation.code);
      document.getElementById("confirm-code")?.focus();
      return;
    }
    setCodeError(null);

    try {
      await confirmOrder.mutateAsync({ orderId, code });
      navigate(`/orders/${orderId}`, { replace: true });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setBanner(t.common.networkError);
        return;
      }
      if (error.code === "INVALID_PAYMENT_CODE" || error.status === 400) {
        setCodeError(t.confirm.wrongCode);
        return;
      }
      if (error.code === "TOO_MANY_ATTEMPTS" || error.status === 429) {
        setBanner(t.confirm.tooMany);
        setCooldown(0);
        return;
      }
      if (error.code === "ORDER_ALREADY_PAID") {
        navigate(`/orders/${orderId}`, { replace: true });
        return;
      }
      if (error.code === "INSUFFICIENT_STOCK") {
        setBanner(t.checkout.insufficientStock);
        return;
      }
      setBanner(t.common.somethingWrong);
    }
  };

  const handleResend = async () => {
    setBanner(null);
    setCodeError(null);
    try {
      await resendCode.mutateAsync(orderId);
      setCooldown(STORE.resendCooldownSeconds);
    } catch (error) {
      if (error instanceof ApiError && error.code === "RESEND_TOO_SOON") {
        const retryAfter = error.retryAfterSeconds;
        setCooldown(typeof retryAfter === "number" && retryAfter > 0 ? retryAfter : STORE.resendCooldownSeconds);
        return;
      }
      setBanner(t.common.networkError);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-md space-y-5">
        <div className="surface-card space-y-5 p-6">
          <header className="space-y-2 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </span>
            <h1 className="text-xl font-semibold text-foreground">{t.confirm.title}</h1>
            <p className="text-sm text-muted-foreground">{t.confirm.subtitle(user?.email ?? "")}</p>
          </header>

          {banner ? <Alert variant="error">{banner}</Alert> : null}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField id="confirm-code" label={t.confirm.codeLabel} error={codeError ?? undefined} required>
              <Input
                id="confirm-code"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                className="text-center text-lg tracking-[0.5em]"
                invalid={Boolean(codeError)}
                {...fieldAriaProps("confirm-code", codeError ?? undefined)}
              />
            </FormField>

            <Button type="submit" size="lg" className="w-full" loading={confirmOrder.isPending}>
              {confirmOrder.isPending ? t.confirm.submitting : t.confirm.submit}
            </Button>
          </form>

          <div className="flex flex-col items-center gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="link"
              onClick={() => void handleResend()}
              disabled={cooldown > 0 || resendCode.isPending}
            >
              {cooldown > 0 ? t.confirm.resendIn(cooldown) : t.confirm.resend}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/checkout">{t.confirm.backToCheckout}</Link>
            </Button>
          </div>
        </div>

        <Alert variant="info">{t.confirm.devHint}</Alert>
      </div>
    </div>
  );
};

export default CheckoutConfirmPage;
