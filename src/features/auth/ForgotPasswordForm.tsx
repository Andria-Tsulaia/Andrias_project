import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setNetworkError(false);
      try {
        await authApi.forgotPassword({ email: values.email });
        setSent(true);
      } catch (error) {
        // არასდროს ვამხელთ, რეგისტრირებულია თუ არა ელფოსტა
        if (error instanceof ApiError && error.status === 0) {
          setNetworkError(true);
          return;
        }
        setSent(true);
      }
    },
    (invalid) => {
      const first = Object.keys(invalid)[0];
      if (first) setFocus(first as keyof ForgotPasswordValues);
    },
  );

  if (sent) {
    return (
      <div className="space-y-4">
        <Alert variant="success">{t.auth.forgot.success}</Alert>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {networkError ? <Alert variant="error">{t.common.networkError}</Alert> : null}

      <FormField id="forgot-email" label={t.auth.fields.email} error={errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...fieldAriaProps("forgot-email", errors.email?.message)}
          {...register("email")}
        />
      </FormField>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {isSubmitting ? t.auth.forgot.submitting : t.auth.forgot.submit}
      </Button>
    </form>
  );
}
