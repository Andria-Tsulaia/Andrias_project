import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { AddressList } from "@/features/profile/AddressList";
import { ProfileForm } from "@/features/profile/ProfileForm";
import { useAuth } from "@/providers/auth/use-auth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container-page space-y-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.profile.title}</h1>
        {user ? <p className="text-sm text-muted-foreground">{user.email}</p> : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProfileForm />
        </div>

        <div className="space-y-6">
          <AddressList />

          <section className="surface-card flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                <ClipboardList aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.orders.title}</p>
                <p className="text-xs text-muted-foreground">{t.profile.ordersSection}</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/orders">{t.nav.orders}</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
