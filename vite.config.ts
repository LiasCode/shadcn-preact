import { resolve } from "node:path";

import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

import { componentDocsPlugin } from "./scripts/component-docs.ts";
import { componentCatalog } from "./src/lib/component-catalog.ts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    componentDocsPlugin(),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: [
          "/404",
          "/docs",
          "/docs/installation",
          "/docs/components",
          "/components",
          ...componentCatalog.map(({ slug }) => `/docs/components/${slug}`),
        ],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@registry": resolve(resolve(import.meta.dirname), "./registry/"),
      "@": resolve(resolve(import.meta.dirname), "./src/"),
    },
  },
});
