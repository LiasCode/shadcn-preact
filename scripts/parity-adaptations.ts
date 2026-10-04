import { createHash } from "node:crypto";

/** Exact, reviewed differences; neither side may drift without a new review. */
export const parityAdaptations = [
  {
    component: "chart",
    category: "props",
    member: "ChartTooltipContent",
    upstreamHash: "66811ca147202e31f1b08c3025ef4e75141190ce5bc627a142e326365af57801",
    localHash: "ab1a77d3ed1ab277fc1c206813ae350ced2fb4550ef6d7e98e1aa998f38bd1b4",
    reason: "ADR 0017: explicitly restore React's optional color prop omitted by Preact's div props.",
  },
] as const;

export function matchesAdaptation(
  local: string | undefined,
  upstream: string | undefined,
  adaptation: { localHash: string; upstreamHash: string },
): boolean {
  const hash = (value: string) => createHash("sha256").update(value).digest("hex");
  return (
    local !== undefined &&
    upstream !== undefined &&
    hash(local) === adaptation.localHash &&
    hash(upstream) === adaptation.upstreamHash
  );
}