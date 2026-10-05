import { lazy, Route, Router } from "preact-iso";

import { NotFound } from "./layouts/not-found";
import { componentPages } from "./modules/docs/component-pages";
import { ComponentsView } from "./modules/docs/views/components";
import { IntroductionView } from "./modules/docs/views/introduction";
import { HomeView } from "./modules/showcase/views/home";
const InstallationView = lazy(() =>
  import("./modules/docs/views/installation").then((module) => module.InstallationView),
);

const ShowcaseView = lazy(() =>
  import("./modules/showcase/views/showcase").then((module) => module.ShowcaseView),
);

// Static paths are also prerendered; keep `additionalPrerenderRoutes` in `vite.config.ts` in sync.
export function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={HomeView} />
      <Route path="/docs" component={IntroductionView} />
      <Route path="/docs/installation" component={InstallationView} />
      <Route path="/docs/components" component={ComponentsView} />
      {componentPages.map(({ path, View }) => (
        <Route key={path} path={path} component={View} />
      ))}
      <Route path="/components" component={ShowcaseView} />
      <Route default component={NotFound} />
    </Router>
  );
}
