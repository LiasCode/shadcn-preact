import { afterEach } from "bun:test";

// Gives every test a browser-like DOM (happy-dom) and a clean document (ADR 0011).
import { GlobalRegistrator } from "@happy-dom/global-registrator";

import { cleanup } from "./utils";

GlobalRegistrator.register({ url: "http://localhost/" });

afterEach(() => {
  cleanup();
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
  }
});