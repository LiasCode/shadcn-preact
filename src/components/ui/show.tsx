import type { PropsWithChildren } from "preact/compat";

export type ShowProps = PropsWithChildren<{ when: boolean }>;

export function Show(props: ShowProps) {
  if (props.when) {
    return props.children;
  }
  return null;
}
