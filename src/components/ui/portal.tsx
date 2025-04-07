import { type PropsWithChildren, createPortal } from "preact/compat";
import { Show } from "./show";

type PortalProps = PropsWithChildren & {
  show: boolean;
};

export const Portal = ({ show, ...props }: PortalProps) => {
  if (typeof window !== "undefined") {
    return createPortal(<Show when={show}>{props.children}</Show>, document.body);
  }
  return null;
};
