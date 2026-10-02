import type { CSSProperties } from "preact";

/** Returns the style object, calling it with the state when it is a function. */
export function resolveStyle<State>(
  style: CSSProperties | ((state: State) => CSSProperties | undefined) | undefined,
  state: State,
): CSSProperties | undefined {
  return typeof style === "function" ? style(state) : style;
}