import type { ComponentType } from "preact";
import { lazy } from "preact-iso";

import { componentCatalog } from "@/lib/component-catalog";

import type { ComponentDocumentation } from "./views/component";

const examples = import.meta.glob<Record<string, ComponentType>>("../showcase/examples/*.tsx");
const documents = import.meta.glob<ComponentDocumentation>(
  "../../../.cache/component-docs/*.json",
  { import: "default" },
);

export const componentPages = componentCatalog.map(({ slug }) => ({
  path: `/docs/components/${slug}`,
  View: lazy(async () => {
    const loadDocument = documents[`../../../.cache/component-docs/${slug}.json`];

    if (!loadDocument) {
      throw new Error(`Missing component page: ${slug}`);
    }

    const documentation = await loadDocument();
    const first = documentation.examples[0];

    if (!first) {
      throw new Error(`Missing component examples: ${slug}`);
    }

    const loadFirst = examples[first.modulePath];

    if (!loadFirst) {
      throw new Error(`Missing example module: ${first.modulePath}`);
    }

    const [firstModule, { ComponentView }] = await Promise.all([
      loadFirst(),
      import("./views/component"),
    ]);
    const previews = documentation.examples.map((example, index) => {
      const load = examples[example.modulePath];

      if (!load) {
        throw new Error(`Missing example module: ${example.modulePath}`);
      }

      const Preview =
        index === 0
          ? firstModule[example.exportName]
          : lazy(() =>
              load().then((module) => {
                const Preview = module[example.exportName];

                if (!Preview) {
                  throw new Error(`Missing example export: ${example.id}`);
                }

                return Preview;
              }),
            );

      if (!Preview) {
        throw new Error(`Missing example export: ${example.id}`);
      }

      return { ...example, Preview };
    });

    return function ComponentPage() {
      return <ComponentView documentation={documentation} examples={previews} />;
    };
  }),
}));
