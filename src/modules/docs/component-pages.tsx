import type { ComponentType } from "preact";
import { lazy } from "preact-iso";

import { componentCatalog } from "@/lib/component-catalog";

import type { ComponentDocumentation } from "./views/component";

const demos = import.meta.glob<Record<string, ComponentType>>("../showcase/demos/*-demo.tsx");
const documents = import.meta.glob<ComponentDocumentation>(
  "../../../.cache/component-docs/*.json",
  { import: "default" },
);

export const componentPages = componentCatalog.map(({ slug }) => ({
  path: `/docs/components/${slug}`,
  View: lazy(async () => {
    const loadDemo = demos[`../showcase/demos/${slug}-demo.tsx`];
    const loadDocument = documents[`../../../.cache/component-docs/${slug}.json`];

    if (!loadDemo || !loadDocument) {
      throw new Error(`Missing component page: ${slug}`);
    }

    const [demo, documentation, { ComponentView }] = await Promise.all([
      loadDemo(),
      loadDocument(),
      import("./views/component"),
    ]);
    const Demo = Object.entries(demo).find(([name]) => name.endsWith("Demo"))?.[1];

    if (!Demo) {
      throw new Error(`Missing demo export: ${slug}`);
    }

    return function ComponentPage() {
      return <ComponentView documentation={documentation} Demo={Demo} />;
    };
  }),
}));
