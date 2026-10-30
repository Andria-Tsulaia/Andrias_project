import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Spinner } from "@/shared/ui/spinner";
import { useAuth } from "@/providers/auth/use-auth";
import { t } from "@/content/ka";

/** დაცული მარშრუტი — ავტორიზაციის გარეშე გადადის /login-ზე და იმახსოვრებს სამიზნეს */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Spinner label={t.common.loading} />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <Outlet />;
}
