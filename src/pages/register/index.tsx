import { Link, Navigate } from "react-router-dom";

import { t } from "@/content/ka";
import { AuthCard } from "@/features/auth/AuthCard";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { useAuth } from "@/providers/auth/use-auth";

const RegisterPage = () => {
  const { status } = useAuth();

  if (status === "authenticated") return <Navigate to="/catalog" replace />;

  return (
    <AuthCard
      title={t.auth.register.title}
      subtitle={t.auth.register.subtitle}
      footer={
        <>
          {t.auth.register.hasAccount}{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t.auth.register.signIn}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
