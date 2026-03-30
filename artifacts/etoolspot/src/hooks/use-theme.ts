import { useState, useEffect } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("etoolspot_theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("etoolspot_theme") as Theme) || "dark";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

export function initTheme() {
  const saved = (localStorage.getItem("etoolspot_theme") as Theme) || "dark";
  document.documentElement.classList.toggle("dark", saved === "dark");
}
