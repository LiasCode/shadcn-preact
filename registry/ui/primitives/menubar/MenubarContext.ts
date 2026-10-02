import { createContext } from "preact";
export interface MenubarMenu {
  element: HTMLElement;
  open: boolean;
  change(open: boolean, event: Event): void;
}
export interface MenubarContextValue {
  modal: boolean;
  disabled: boolean;
  element: HTMLElement | null;
  menus: Map<string, MenubarMenu>;
  highlighted: string | null;
  setHighlighted(id: string): void;
  register(id: string, menu: MenubarMenu): () => void;
  switchTo(id: string, event: Event): void;
}
export const MenubarContext = createContext<MenubarContextValue | null>(null);
export function getMenubarMenus(menus: Map<string, MenubarMenu>) {
  return [...menus].sort((a, b) => (a[1].element.compareDocumentPosition(b[1].element) & 4 ? -1 : 1));
}