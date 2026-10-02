import { useRef, useState } from "preact/hooks";

import { getElementProps } from "../internals/popups/getElementProps";
import type { BaseUIComponentProps } from "../internals/types";
import { useListNavigation } from "../internals/useListNavigation";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { MenubarContext, getMenubarMenus, type MenubarMenu } from "./MenubarContext";
export interface MenubarState {
  orientation: "horizontal" | "vertical";
  modal: boolean;
  hasSubmenuOpen: boolean;
}
export interface MenubarProps extends BaseUIComponentProps<"div", MenubarState> {
  orientation?: "horizontal" | "vertical";
  modal?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
}
export function Menubar({
  orientation = "horizontal",
  modal = true,
  disabled = false,
  loopFocus = true,
  ...props
}: MenubarProps) {
  const menus = useRef(new Map<string, MenubarMenu>());
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [version, setVersion] = useState(0);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const register = useStableCallback((id: string, menu: MenubarMenu) => {
    menus.current.set(id, menu);
    setVersion((n) => n + 1);
    return () => {
      menus.current.delete(id);
      setVersion((n) => n + 1);
    };
  });
  const switchTo = useStableCallback((id: string, event: Event) => {
    for (const [key, menu] of menus.current) {
      if (menu.open && key !== id) menu.change(false, event);
    }
    menus.current.get(id)?.change(true, event);
  });
  const { navigate } = useListNavigation(() => getMenubarMenus(menus.current).map(([, m]) => m.element), {
    orientation,
    loopFocus,
  });
  const hasSubmenuOpen = [...menus.current.values()].some((m) => m.open);
  void version;
  const node = useRenderElement("div", props, {
    state: { orientation, modal, hasSubmenuOpen },
    ref: [props.ref ?? null, setElement],
    props: [
      {
        role: "menubar",
        "aria-orientation": orientation,
        onKeyDown(event: KeyboardEvent) {
          if (disabled) return;
          if (navigate(event) && hasSubmenuOpen) {
            const id = [...menus.current].find(([, m]) => m.element === element?.ownerDocument.activeElement)?.[0];
            if (id) switchTo(id, event);
          }
        },
      },
      getElementProps(props),
    ],
  });
  return (
    <MenubarContext.Provider
      value={{ modal, disabled, element, menus: menus.current, highlighted, setHighlighted, register, switchTo }}
    >
      {node}
    </MenubarContext.Provider>
  );
}
export namespace Menubar {
  export type Props = MenubarProps;
  export type State = MenubarState;
}