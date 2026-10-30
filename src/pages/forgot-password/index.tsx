import { Link, Navigate } from "react-router-dom";

import { t } from "@/content/ka";
import { AuthCard } from "@/features/auth/AuthCard";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { useAuth } from "@/providers/auth/use-auth";

const ForgotPasswordPage = () => {
  const { status } = useAuth();

  if (status === "authenticated") return <Navigate to="/catalog" replace />;

  return (
    <AuthCard
      title={t.auth.forgot.title}
      subtitle={t.auth.forgot.subtitle}
      footer={
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          {t.auth.forgot.backToSignIn}
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
};

export default ForgotPasswordPage;
