import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";

const NotFoundPage = () => (
  <div className="container-page flex min-h-[60vh] items-center justify-center">
    <div className="w-full max-w-lg space-y-4">
      <p className="text-center text-5xl font-semibold text-primary">404</p>
      <EmptyState
        title={t.notFound.title}
        hint={t.notFound.text}
        icon={<Compass aria-hidden="true" className="size-6" />}
        action={
          <Button asChild>
            <Link to="/catalog">{t.notFound.cta}</Link>
          </Button>
        }
      />
    </div>
  </div>
);

export default NotFoundPage;
