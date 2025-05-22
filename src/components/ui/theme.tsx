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

export type ThemeProviderProps = PropsWithChildren & {
  default_theme?: ThemeOption;
};

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeOption>(() => getThemeFromLocalStorage(props.default_theme));

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

export function getThemeFromLocalStorage(default_theme?: ThemeOption): ThemeOption {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("--theme--") || default_theme || "light") as ThemeOption;
  }
  return default_theme || "light";
}

export function setThemeFromLocalStorage(t: ThemeOption) {
  return localStorage.setItem("--theme--", t);
}
