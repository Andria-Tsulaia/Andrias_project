
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const [language, setLanguage] = useState<"ka" | "en">(() => {
    return localStorage.getItem("app_language") === "en" ? "en" : "ka";
  });

  const changeLanguage = (nextLanguage: "ka" | "en") => {
    localStorage.setItem("app_language", nextLanguage);
    setLanguage(nextLanguage);
    window.location.reload();
  };

  return (
    <Select
      value={language}
      onValueChange={(value) => changeLanguage(value as "ka" | "en")}
    >
      <SelectTrigger className={cn("min-w-[140px]", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ka">ქართული</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};
