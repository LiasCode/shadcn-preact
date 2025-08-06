import { type HTMLAttributes, createPortal, forwardRef, useLayoutEffect, useState } from "preact/compat";

export type PortalProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: Element | DocumentFragment | null;
};

export const Portal = forwardRef<HTMLDivElement, PortalProps>((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;

  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => setMounted(true), []);

  const container = containerProp || (mounted && globalThis?.document?.body);

  return container
    ? createPortal(
        <div
          {...portalProps}
          ref={forwardedRef}
        />,
        container
      )
    : null;

  // if (typeof window !== "undefined") {
  //   return createPortal(<Show when={show}>{props.children}</Show>, document.body);
  // }
  // return null;
});
