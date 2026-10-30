import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { useAuth } from "@/providers/auth/use-auth";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      try {
        await registerUser(values);
        navigate("/catalog", { replace: true });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.code === "EMAIL_TAKEN" || error.status === 409) {
            setError("email", { message: t.auth.register.emailTaken });
            return;
          }
          const messages = error.errors ?? {};
          (Object.keys(messages) as (keyof RegisterValues)[]).forEach((field) => {
            const message = messages[field as string];
            if (message && field in values) setError(field, { message });
          });
          if (!Object.keys(messages).length) setFormError(t.common.somethingWrong);
          return;
        }
        setFormError(t.common.networkError);
      }
    },
    (invalid) => {
      const first = Object.keys(invalid)[0];
      if (first) setFocus(first as keyof RegisterValues);
    },
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <FormField id="register-name" label={t.auth.fields.name} error={errors.name?.message} required>
        <Input
          autoComplete="name"
          invalid={Boolean(errors.name)}
          {...fieldAriaProps("register-name", errors.name?.message)}
          {...register("name")}
        />
      </FormField>

      <FormField id="register-email" label={t.auth.fields.email} error={errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...fieldAriaProps("register-email", errors.email?.message)}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="register-password"
        label={t.auth.fields.password}
        hint={t.profile.newPasswordHint}
        error={errors.password?.message}
        required
      >
        <PasswordInput
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          {...fieldAriaProps("register-password", errors.password?.message, t.profile.newPasswordHint)}
          {...register("password")}
        />
      </FormField>

      <FormField
        id="register-confirm"
        label={t.auth.fields.confirmPassword}
        error={errors.confirmPassword?.message}
        required
      >
        <PasswordInput
          autoComplete="new-password"
          invalid={Boolean(errors.confirmPassword)}
          {...fieldAriaProps("register-confirm", errors.confirmPassword?.message)}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {isSubmitting ? t.auth.register.submitting : t.auth.register.submit}
      </Button>
    </form>
  );
}
