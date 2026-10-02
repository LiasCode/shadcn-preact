import { Route, Router } from "preact-iso";

import { NotFound } from "./layouts/not-found";
import { ComponentView } from "./modules/docs/views/component";
import { ComponentsIndexView } from "./modules/docs/views/components-index";
import { HomeView } from "./modules/docs/views/home";
import { ViteInstallationView } from "./modules/docs/views/vite-installation";

// Static paths are also prerendered; keep `additionalPrerenderRoutes` in `vite.config.ts` in sync.
export function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={HomeView} />
      <Route path="/docs" component={HomeView} />
      <Route path="/docs/components" component={ComponentsIndexView} />
      <Route path="/docs/installation/vite" component={ViteInstallationView} />
      <Route path="/docs/components/:slug" component={ComponentView} />
      <Route default component={NotFound} />
    </Router>
  );
}