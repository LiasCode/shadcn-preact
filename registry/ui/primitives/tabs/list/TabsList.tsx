import { useRef, useState } from "preact/hooks";

import { CompositeRoot } from "../../internals/composite/root/CompositeRoot";
import type { BaseUIComponentProps } from "../../internals/types";
import { tabsStateAttributesMapping } from "../root/stateAttributesMapping";
import type { TabsRootState } from "../root/TabsRoot";
import { useTabsRootContext } from "../root/TabsRootContext";
import { TabsListContext } from "./TabsListContext";

export interface TabsListProps extends BaseUIComponentProps<"div", TabsRootState> {
  activateOnFocus?: boolean;
  loopFocus?: boolean;
}

const disabledIndices: number[] = [];

export function TabsList(componentProps: TabsListProps) {
  const {
    ref,
    activateOnFocus = false,
    loopFocus = true,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const root = useTabsRootContext();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const element = useRef<HTMLElement | null>(null);
  return (
    <TabsListContext.Provider
      value={{ activateOnFocus, highlightedIndex, setHighlightedIndex, element }}
    >
      <CompositeRoot
        render={componentProps.render}
        className={componentProps.className}
        style={componentProps.style}
        state={root.state}
        refs={[ref ?? null, element]}
        props={[
          {
            role: "tablist",
            "aria-orientation": root.state.orientation === "vertical" ? "vertical" : undefined,
          },
          elementProps,
        ]}
        orientation={root.state.orientation}
        loopFocus={loopFocus}
        enableHomeAndEndKeys
        highlightedIndex={highlightedIndex}
        onHighlightedIndexChange={setHighlightedIndex}
        disabledIndices={disabledIndices}
        stateAttributesMapping={tabsStateAttributesMapping}
      />
    </TabsListContext.Provider>
  );
}

export declare namespace TabsList {
  type Props = TabsListProps;

  type State = TabsRootState;
}
