import { Route, Router } from "preact-iso";

import { NotFound } from "./layouts/not-found";
import { HomeView } from "./modules/showcase/views/home";
import { ShowcaseView } from "./modules/showcase/views/showcase";

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