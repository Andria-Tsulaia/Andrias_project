import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { t } from "@/content/ka";
import { profileSchema, type ProfileValues } from "@/lib/validation";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { fieldAriaProps, FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { SectionCard } from "@/shared/ui/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfile, useMe } from "./useProfile";

const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

/** პროფილი — იგზავნება მხოლოდ შეცვლილი ველები + სავალდებულო მიმდინარე პაროლი */
export function ProfileForm() {
  const meQuery = useMe();
  const updateProfile = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", ...EMPTY_PASSWORDS },
  });

  useEffect(() => {
    if (!meQuery.data) return;
    reset({ name: meQuery.data.name, email: meQuery.data.email, ...EMPTY_PASSWORDS });
  }, [meQuery.data, reset]);

  const requestedEmail = watch("email");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    if (!meQuery.data) return;

    const changed: { name?: string; email?: string; newPassword?: string } = {};
    if (values.name !== meQuery.data.name) changed.name = values.name;
    if (values.email !== meQuery.data.email) changed.email = values.email;
    if (values.newPassword) changed.newPassword = values.newPassword;

    if (Object.keys(changed).length === 0) {
      setFormError(t.profile.nothingToChange);
      return;
    }

    try {
      await updateProfile.mutateAsync({ currentPassword: values.currentPassword, ...changed });
      reset({ name: values.name, email: values.email, ...EMPTY_PASSWORDS });
      toast.success(t.profile.saved);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setFormError(t.common.networkError);
        return;
      }

      // ⚠️ არასწორი მიმდინარე პაროლი 400-ია (არა 401) — 401-ს ცენტრალურად ამუშავებს API კლიენტი
      if (error.code === "INVALID_CURRENT_PASSWORD" || error.status === 400) {
        setError("currentPassword", { message: t.profile.wrongCurrentPassword });
        return;
      }
      if (error.code === "EMAIL_TAKEN" || error.status === 409) {
        setError("email", { message: t.profile.emailTaken });
        return;
      }
      if (error.status === 422) {
        const messages = error.errors ?? {};
        const fields = Object.keys(messages);
        if (!fields.length || fields.includes("_")) {
          setFormError(t.profile.nothingToChange);
          return;
        }
        fields.forEach((field) => {
          if (field === "name" || field === "email" || field === "newPassword") {
            setError(field, { message: messages[field] });
          }
          if (field === "currentPassword") {
            setError("currentPassword", { message: messages[field] });
          }
        });
        return;
      }
      setFormError(t.common.somethingWrong);
    }
  });

  if (meQuery.isLoading) {
    return (
      <SectionCard title={t.profile.formSection}>
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </SectionCard>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <SectionCard title={t.profile.formSection}>
        <Alert
          variant="error"
          actions={
            <Button variant="outline" size="sm" onClick={() => void meQuery.refetch()}>
              {t.profile.loadError.retry}
            </Button>
          }
        >
          {t.profile.loadError.title}
        </Alert>
      </SectionCard>
    );
  }

  const emailChanged = requestedEmail !== meQuery.data.email;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <SectionCard title={t.profile.formSection} bodyClassName="space-y-4">
        <FormField id="profile-name" label={t.profile.name} error={errors.name?.message} required>
          <Input
            autoComplete="name"
            invalid={Boolean(errors.name)}
            {...fieldAriaProps("profile-name", errors.name?.message)}
            {...register("name")}
          />
        </FormField>

        <FormField id="profile-email" label={t.profile.email} error={errors.email?.message} required>
          <Input
            type="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...fieldAriaProps("profile-email", errors.email?.message)}
            {...register("email")}
          />
        </FormField>
      </SectionCard>

      <SectionCard title={t.profile.securitySection} bodyClassName="space-y-4">
        <FormField
          id="profile-current-password"
          label={t.profile.currentPassword}
          hint={emailChanged ? t.profile.currentPasswordHint : undefined}
          error={errors.currentPassword?.message}
          required
        >
          <PasswordInput
            autoComplete="current-password"
            invalid={Boolean(errors.currentPassword)}
            {...fieldAriaProps("profile-current-password", errors.currentPassword?.message)}
            {...register("currentPassword")}
          />
        </FormField>

        <FormField
          id="profile-new-password"
          label={t.profile.newPassword}
          hint={t.profile.newPasswordHint}
          error={errors.newPassword?.message}
        >
          <PasswordInput
            autoComplete="new-password"
            invalid={Boolean(errors.newPassword)}
            {...fieldAriaProps("profile-new-password", errors.newPassword?.message, t.profile.newPasswordHint)}
            {...register("newPassword")}
          />
        </FormField>

        <FormField
          id="profile-confirm-password"
          label={t.profile.confirmNewPassword}
          error={errors.confirmNewPassword?.message}
        >
          <PasswordInput
            autoComplete="new-password"
            invalid={Boolean(errors.confirmNewPassword)}
            {...fieldAriaProps("profile-confirm-password", errors.confirmNewPassword?.message)}
            {...register("confirmNewPassword")}
          />
        </FormField>
      </SectionCard>

      <div className="space-y-3">
        {formError ? <Alert variant="warning">{formError}</Alert> : null}

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            {isSubmitting ? t.profile.saving : t.profile.save}
          </Button>
          {!isDirty ? <span className="text-sm text-muted-foreground">{t.profile.nothingToChange}</span> : null}
        </div>
      </div>
    </form>
  );
}
