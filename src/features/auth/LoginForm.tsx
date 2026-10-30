import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { useAuth } from "@/providers/auth/use-auth";

/** შესვლა — ვალიდაცია გაგზავნისას, პირველი მცდელობის შემდეგ ცვლილებაზე */
export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/catalog";

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      try {
        await login(values);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            setFormError(t.auth.login.invalidCredentials);
            return;
          }
          if (error.errors?.email) setError("email", { message: error.errors.email });
          if (error.errors?.password) setError("password", { message: error.errors.password });
          if (!error.errors) setFormError(t.common.somethingWrong);
          return;
        }
        setFormError(t.common.networkError);
      }
    },
    (invalid) => {
      const first = Object.keys(invalid)[0];
      if (first) setFocus(first as keyof LoginValues);
    },
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <FormField id="login-email" label={t.auth.fields.email} error={errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          placeholder="nino@example.ge"
          invalid={Boolean(errors.email)}
          {...fieldAriaProps("login-email", errors.email?.message)}
          {...register("email")}
        />
      </FormField>

      <FormField id="login-password" label={t.auth.fields.password} error={errors.password?.message} required>
        <PasswordInput
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...fieldAriaProps("login-password", errors.password?.message)}
          {...register("password")}
        />
      </FormField>

      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {t.auth.login.forgot}
        </Link>
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {isSubmitting ? t.auth.login.submitting : t.auth.login.submit}
      </Button>
    </form>
  );
}
