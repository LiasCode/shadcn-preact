import { createContext } from "preact";
import { type PropsWithChildren, useContext, useEffect, useState } from "preact/compat";

type ThemeOption = "light" | "dark";

const ThemeContext = createContext<{
  theme: ThemeOption;
  setTheme: (v: ThemeOption) => void;
}>({
  setTheme: () => {},
  theme: "light",
});

export type ThemeProviderProps = PropsWithChildren;

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeOption>(getThemeFromLocalStorage());

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.remove("dark");
      setThemeFromLocalStorage("light");
    } else if (theme === "dark") {
      document.body.classList.add("dark");
      setThemeFromLocalStorage("dark");
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const c = useContext(ThemeContext);
  if (!c) throw new Error("useTheme should be inside of ThemeProvider");
  return c;
};

export function getThemeFromLocalStorage(): ThemeOption {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("--theme--") || "light") as ThemeOption;
  }
  return "light";
}

export function setThemeFromLocalStorage(t: ThemeOption) {
  return localStorage.setItem("--theme--", t);
}
