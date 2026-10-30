import { Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import Header from "./Header";
import { ScrollToTop } from "./ScrollToTop";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}