import { hydrate, prerender as ssr } from "preact-iso";
import { App } from "./App";
import "./index.css";

if (typeof window !== "undefined") {
  const $root = document.querySelector("#app");

  if (!$root) {
    throw new Error("#app dom element must exists");
  }

  hydrate(<App />, $root);
}

export async function prerender(data: any) {
  return await ssr(<App {...data} />);
}
