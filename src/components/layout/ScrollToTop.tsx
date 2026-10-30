import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** გვერდის შეცვლისას სქროლი ზემოთ — მსგავს/სხვა გვერდზე გადასვლისას ბოლოში არ დავრჩეთ */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
