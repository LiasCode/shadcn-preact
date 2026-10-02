import { ThemeProvider } from "@registry/ui/theme";
import { LocationProvider } from "preact-iso";

import { AppRoutes } from "./routes";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="shadcn-preact-theme">
      <LocationProvider>
        <AppRoutes />
      </LocationProvider>
    </ThemeProvider>
  );
}