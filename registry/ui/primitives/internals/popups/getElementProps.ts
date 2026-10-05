/** Render-only props belong to useRenderElement, not its native element props. */
export function getElementProps<T extends object>(props: T) {
  const result = { ...props } as Record<string, unknown>;

  for (const key of ["ref", "render", "className", "style"]) {
    delete result[key];
  }

  return result;
}
