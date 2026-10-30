import { Link, Navigate } from "react-router-dom";

import { t } from "@/content/ka";
import { AuthCard } from "@/features/auth/AuthCard";
import { LoginForm } from "@/features/auth/LoginForm";
import { useAuth } from "@/providers/auth/use-auth";

const LoginPage = () => {
  const { status } = useAuth();

  if (status === "authenticated") return <Navigate to="/catalog" replace />;

  return (
    <AuthCard
      title={t.auth.login.title}
      subtitle={t.auth.login.subtitle}
      footer={
        <>
          {t.auth.login.noAccount}{" "}
          <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            {t.auth.login.createAccount}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
