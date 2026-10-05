import { h } from "preact";
import { renderToString } from "preact-render-to-string";

import { showcase } from "../src/modules/showcase/demos/index.ts";

// Server rendering measures the complete demos, not browser interaction latency.
// Use the same Bun version and machine when comparing snapshots.
const samples = 5;
const components = showcase.map(({ slug, Demo }) => {
  const render = () => renderToString(h(Demo, {}));

  render();
  const durations = [];
  let html = "";

  for (let index = 0; index < samples; index++) {
    const start = performance.now();
    html = render();
    durations.push(performance.now() - start);
  }

  durations.sort((a, b) => a - b);
  return {
    slug,
    medianMs: Number(durations[Math.floor(samples / 2)].toFixed(2)),
    maxMs: Number(durations.at(-1).toFixed(2)),
    htmlBytes: Buffer.byteLength(html),
  };
});
console.log(JSON.stringify({ runtime: `Bun ${Bun.version}`, samples, components }, null, 2));
