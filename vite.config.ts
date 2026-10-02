import { resolve } from "node:path";

import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

import { componentRoutes } from "./src/modules/docs/catalog";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404", "/docs", "/docs/installation/vite", "/docs/components", ...componentRoutes],
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
      "@registry": resolve(resolve(__dirname), "./registry/"),
      "@": resolve(resolve(__dirname), "./src/"),
    },
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  },
});