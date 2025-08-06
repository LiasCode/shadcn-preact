import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { ExternalLink } from "lucide-preact";
import { LocationProvider, Route, Router } from "preact-iso";
import { AppRoutes } from "./routes/AppRoutes";
import HomePage from "./routes/Home";

export function App() {
  return (
    <LocationProvider>
      <Router>
        <Route
          component={HomePage}
          path={AppRoutes.HOME}
        />

        <Route
          default
          component={() => (
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background">
              <Alert
                variant="destructive"
                className="max-w-[500px] border-red-500"
              >
                <AlertTitle className="font-bold text-red-500">404 error, Not found</AlertTitle>
                <AlertDescription className="text-red-400">This resource doesn't exists</AlertDescription>
              </Alert>

              <a href={AppRoutes.HOME}>
                <Button variant="secondary">
                  Go home <ExternalLink />
                </Button>
              </a>
            </div>
          )}
        />
      </Router>
    </LocationProvider>
  );
}
