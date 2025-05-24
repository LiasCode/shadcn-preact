import { useMemo, type PropsWithChildren } from "preact/compat";

export type ShowProps = PropsWithChildren<{ when: boolean }>;

export function Show(props: ShowProps) {
  const show_children = useMemo(() => Boolean(props.when) === true, [props.when]);
  return show_children ? props.children : null;
}
