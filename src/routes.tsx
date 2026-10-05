import { lazy, Route, Router } from "preact-iso";

import { NotFound } from "./layouts/not-found";
import { HomeView } from "./modules/showcase/views/home";
const ShowcaseView = lazy(() =>
  import("./modules/showcase/views/showcase").then((module) => module.ShowcaseView),
);

// Static paths are also prerendered; keep `additionalPrerenderRoutes` in `vite.config.ts` in sync.
export function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={HomeView} />
      <Route path="/components" component={ShowcaseView} />
      <Route default component={NotFound} />
    </Router>
  );
}
