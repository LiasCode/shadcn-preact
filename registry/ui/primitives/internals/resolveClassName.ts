/** Returns the class name, calling it with the state when it is a function. */
export function resolveClassName<State>(
  className: string | ((state: State) => string | undefined) | undefined,
  state: State,
): string | undefined {
  return typeof className === "function" ? className(state) : className;
}
