import type { VirtualElement } from "@floating-ui/react-dom";
import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { getElementProps } from "../internals/popups/getElementProps";
import { popupStateMapping } from "../internals/popups/OverlayContext";
import type { BaseUIComponentProps } from "../internals/types";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { Menu } from "../menu";
import { useMenuContext } from "../menu/parts";
export {
  Portal,
  Popup,
  Group,
  GroupLabel,
  Item,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  SubmenuRoot,
  SubmenuTrigger,
  Separator,
} from "../menu/parts";
const Context = createContext<{
  anchor: VirtualElement | null;
  setAnchor(anchor: VirtualElement): void;
}>({
  anchor: null,
  setAnchor() {},
});

export function Root(props: Omit<Menu.Root.Props, "modal">) {
  const [anchor, setAnchor] = useState<VirtualElement | null>(null);
  return (
    <Context.Provider value={{ anchor, setAnchor }}>
      <Menu.Root {...props} modal={true} />
    </Context.Provider>
  );
}

export namespace Root {
  export type Props = Omit<Menu.Root.Props, "modal">;

  export type ChangeEventDetails = Menu.Root.ChangeEventDetails;
}

export function Positioner(props: Menu.Positioner.Props) {
  const context = useContext(Context),
    menu = useMenuContext();
  return (
    <Menu.Positioner
      {...props}
      anchor={props.anchor ?? (menu.parent ? undefined : context.anchor)}
    />
  );
}

export namespace Positioner {
  export type Props = Menu.Positioner.Props;
}

export function Trigger(props: BaseUIComponentProps<"div", { open: boolean }>) {
  const context = useContext(Context),
    menu = useMenuContext(),
    ctx = menu.overlay;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const point = useRef({ x: 0, y: 0 });
  const element = useRef<HTMLElement | null>(null);
  const cancel = useStableCallback(() => clearTimeout(timer.current));
  useEffect(() => cancel, [cancel]);

  const show = (event: MouseEvent | PointerEvent | KeyboardEvent) => {
    cancel();

    if (ctx.disabled) {
      return;
    }

    event.preventDefault();

    event.stopPropagation();
    const rect = element.current?.getBoundingClientRect();
    const x = "clientX" in event ? event.clientX : (rect?.left ?? 0),
      y = "clientY" in event ? event.clientY : (rect?.bottom ?? 0);
    context.setAnchor({
      contextElement: element.current ?? undefined,
      getBoundingClientRect: () => ({
        x,
        y,
        left: x,
        right: x,
        top: y,
        bottom: y,
        width: 0,
        height: 0,
        toJSON() {
          return { x, y };
        },
      }),
    });

    ctx.change(true, event, "trigger-press", element.current ?? undefined);
  };

  return useRenderElement("div", props, {
    state: { open: ctx.open },
    ref: [props.ref ?? null, element, ctx.setReference],
    stateAttributesMapping: popupStateMapping,
    props: [
      {
        "aria-haspopup": "menu",
        "aria-expanded": ctx.open,
        "aria-controls": ctx.mounted ? ctx.popupId : undefined,
        onContextMenu: show,
        onKeyDown(event: KeyboardEvent) {
          if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) {
            show(event);
          }
        },
        onPointerDown(event: PointerEvent) {
          if (event.pointerType !== "touch") {
            return;
          }

          point.current = { x: event.clientX, y: event.clientY };
          timer.current = setTimeout(() => show(event), 700);
        },
        onPointerMove(event: PointerEvent) {
          if (Math.hypot(event.clientX - point.current.x, event.clientY - point.current.y) > 10) {
            cancel();
          }
        },
        onPointerUp: cancel,
        onPointerCancel: cancel,
      },
      getElementProps(props),
    ],
  });
}

export namespace Trigger {
  export type Props = Parameters<typeof Trigger>[0];
}
