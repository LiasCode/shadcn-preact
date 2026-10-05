import { isValidElement, type Ref, type VNode } from "preact";

/**
 * Extracts the `ref` of an element. Preact keeps the ref of a DOM element on the vnode and passes the ref of a
 * function component as a prop, so both places are read.
 */
export function getReactElementRef(element: unknown): Ref<any> | null {
  if (!isValidElement(element)) {
    return null;
  }

  const vnode = element as VNode<{ ref?: Ref<any> }>;
  return vnode.props?.ref ?? vnode.ref ?? null;
}
