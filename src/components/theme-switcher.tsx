
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("app_theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("app_theme", theme);
    } catch {
      console.warn("Theme preference could not be saved.");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      title={
        theme === "light"
          ? "Dark mode"
          : "Light mode"
      }
    >
      {theme === "light" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
