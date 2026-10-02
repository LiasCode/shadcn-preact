import { useRef } from "preact/hooks";

import { useCompositeListItem } from "../../internals/composite/list/useCompositeListItem";
import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useOpenChangeComplete } from "../../internals/useOpenChangeComplete";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";
import { tabsStateAttributesMapping } from "../root/stateAttributesMapping";
import type { TabsRootState } from "../root/TabsRoot";
import { useTabsRootContext } from "../root/TabsRootContext";
export interface TabsPanelState extends TabsRootState {
  hidden: boolean;
  transitionStatus: TransitionStatus;
}
export interface TabsPanelProps extends Omit<BaseUIComponentProps<"div", TabsPanelState>, "value"> {
  value: any;
  keepMounted?: boolean;
}
export function TabsPanel(componentProps: TabsPanelProps) {
  const {
    ref,
    value,
    keepMounted = false,
    id: idProp,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const root = useTabsRootContext();
  const id = useBaseUiId(idProp);
  const open = root.value === value;
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
  const elementRef = useRef<HTMLElement | null>(null);
  const { ref: listRef, index } = useCompositeListItem();
  useOpenChangeComplete({
    open,
    ref: elementRef,
    onComplete() {
      if (!open) setMounted(false);
    },
  });
  useIsoLayoutEffect(() => {
    if (mounted || keepMounted) return root.registerPanel(value, id);
    return undefined;
  }, [mounted, keepMounted, value, id, root.registerPanel]);
  const state = { ...root.state, hidden: !mounted, transitionStatus };
  const element = useRenderElement("div", componentProps, {
    state,
    ref: [ref ?? null, elementRef, listRef],
    props: [
      {
        role: "tabpanel",
        id,
        "aria-labelledby": root.tabs.find((tab) => tab.value === value)?.id,
        hidden: !mounted,
        inert: !open ? "" : undefined,
        tabIndex: open ? 0 : -1,
        "data-index": index,
      },
      elementProps,
    ],
    stateAttributesMapping: { ...tabsStateAttributesMapping, ...transitionStatusMapping },
  });
  return keepMounted || mounted ? element : null;
}
export declare namespace TabsPanel {
  type Props = TabsPanelProps;
  type State = TabsPanelState;
}