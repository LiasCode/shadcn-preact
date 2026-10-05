export function mergeObjects<A extends object | undefined, B extends object | undefined>(
  a: A,
  b: B,
): (A & B) | A | B {
  if (a && !b) {
    return a;
  }

  if (!a && b) {
    return b;
  }

  if (a || b) {
    return { ...a, ...b } as A & B;
  }

  return undefined as A & B;
}
