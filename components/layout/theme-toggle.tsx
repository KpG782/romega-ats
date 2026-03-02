"use client";

import { SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <SunMoon className="h-4 w-4" />
    </Button>
  );
}

