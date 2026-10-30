import { z } from "zod";

import { t } from "@/content/ka";
import { digitsOnly, isExpiryInPast, passesLuhn } from "./format";

/** ელფოსტის სწრაფი შემოწმება — ბიბლიოთეკის ვერსიაზე დამოკიდებული არ არის */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailField = z
  .string()
  .trim()
  .min(1, t.validation.emailRequired)
  .regex(EMAIL_REGEX, t.validation.emailInvalid);

export const nameField = z.string().trim().min(2, t.validation.nameMin);

const passwordField = z
  .string()
  .min(1, t.validation.passwordRequired)
  .min(8, t.validation.passwordMin)
  .regex(/[A-Za-z]/, t.validation.passwordComplex)
  .regex(/\d/, t.validation.passwordComplex);

/** შესვლა — პაროლის სირთულეს არ ვამოწმებთ (ძველი პაროლი შეიძლება ძველი პოლიტიკის იყოს) */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, t.validation.passwordRequired),
});

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, t.validation.passwordRequired),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: t.validation.passwordsMismatch,
  });

export const forgotPasswordSchema = z.object({ email: emailField });

export const profileSchema = z
  .object({
    name: nameField,
    email: emailField,
    currentPassword: z.string().min(1, t.validation.passwordRequired),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine((values) => values.newPassword === "" || values.newPassword.length >= 8, {
    path: ["newPassword"],
    message: t.validation.passwordMin,
  })
  .refine(
    (values) => values.newPassword === "" || /[A-Za-z]/.test(values.newPassword),
    { path: ["newPassword"], message: t.validation.passwordComplex },
  )
  .refine((values) => values.newPassword === "" || /\d/.test(values.newPassword), {
    path: ["newPassword"],
    message: t.validation.passwordComplex,
  })
  .refine(
    (values) =>
      values.newPassword === "" || values.newPassword === values.confirmNewPassword,
    { path: ["confirmNewPassword"], message: t.validation.passwordsMismatch },
  );

const phoneField = z
  .string()
  .trim()
  .min(1, t.validation.required)
  .refine((value) => /^[+()\d\s-]+$/.test(value) && digitsOnly(value).length >= 7, {
    message: t.validation.phone,
  })
  .refine((value) => value.length >= 9 && value.length <= 20, t.validation.phone);

export const addressSchema = z.object({
  label: z.string().trim().max(30, t.validation.labelMax),
  fullName: nameField,
  phone: phoneField,
  city: z.string().trim().min(2, t.validation.city),
  address: z.string().trim().min(5, t.validation.addressMin),
  isDefault: z.boolean(),
});

export const shippingSchema = z.object({
  fullName: nameField,
  phone: phoneField,
  city: z.string().trim().min(2, t.validation.city),
  address: z.string().trim().min(5, t.validation.addressMin),
});

export const cardSchema = z.object({
  number: z
    .string()
    .min(1, t.validation.required)
    .refine((value) => passesLuhn(value), t.validation.cardNumber),
  holder: z.string().trim().min(2, t.validation.cardHolder),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, t.validation.cardExpiry)
    .refine((value) => !isExpiryInPast(value), t.validation.cardExpired),
  cvc: z.string().regex(/^\d{3,4}$/, t.validation.cardCvc),
});

export const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, t.validation.code),
});

/** ჩექაუთის ფორმა — სერვერის შეცდომების გასაღებები ზუსტად ამ ჩადგმულ სახელებს ემთხვევა */
export const checkoutSchema = z.object({
  shipping: shippingSchema,
  card: cardSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type AddressValues = z.infer<typeof addressSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
export type CardValues = z.infer<typeof cardSchema>;
export type CodeValues = z.infer<typeof codeSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
