import type { ComponentType } from "preact";

import { AlertDemo } from "./alert-demo";
import { AlertDialogDemo } from "./alert-dialog-demo";
import { AspectRatioDemo } from "./aspect-ratio-demo";
import { AvatarDemo } from "./avatar-demo";
import { BadgeDemo } from "./badge-demo";
import { BreadcrumbDemo } from "./breadcrumb-demo";
import { ButtonDemo } from "./button-demo";
import { ButtonGroupDemo } from "./button-group-demo";
import { CalendarDemo } from "./calendar-demo";
import { CardDemo } from "./card-demo";
import { ChartDemo } from "./chart-demo";
import { ComboboxDemo } from "./combobox-demo";
import { ContextMenuDemo } from "./context-menu-demo";
import { DialogDemo } from "./dialog-demo";
import { DrawerDemo } from "./drawer-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { EmptyDemo } from "./empty-demo";
import { FieldDemo } from "./field-demo";
import { HoverCardDemo } from "./hover-card-demo";
import { InputDemo } from "./input-demo";
import { InputGroupDemo } from "./input-group-demo";
import { KbdDemo } from "./kbd-demo";
import { LabelDemo } from "./label-demo";
import { MenubarDemo } from "./menubar-demo";
import { NativeSelectDemo } from "./native-select-demo";
import { NavigationMenuDemo } from "./navigation-menu-demo";
import { PaginationDemo } from "./pagination-demo";
import { PopoverDemo } from "./popover-demo";
import { ProgressDemo } from "./progress-demo";
import { SelectDemo } from "./select-demo";
import { SeparatorDemo } from "./separator-demo";
import { SheetDemo } from "./sheet-demo";
import { SkeletonDemo } from "./skeleton-demo";
import { SpinnerDemo } from "./spinner-demo";
import { TableDemo } from "./table-demo";
import { TabsDemo } from "./tabs-demo";
import { TextareaDemo } from "./textarea-demo";
import { ToggleDemo } from "./toggle-demo";
import { TooltipDemo } from "./tooltip-demo";

export type ShowcaseEntry = {
  /** The registry file name, also used as the section anchor. */
  slug: string;
  name: string;
  Demo: ComponentType;
};

/** Every registry component shown in the showcase, in alphabetical order. */
export const showcase: readonly ShowcaseEntry[] = [
  { slug: "alert", name: "Alert", Demo: AlertDemo },
  { slug: "alert-dialog", name: "Alert Dialog", Demo: AlertDialogDemo },
  { slug: "aspect-ratio", name: "Aspect Ratio", Demo: AspectRatioDemo },
  { slug: "avatar", name: "Avatar", Demo: AvatarDemo },
  { slug: "badge", name: "Badge", Demo: BadgeDemo },
  { slug: "breadcrumb", name: "Breadcrumb", Demo: BreadcrumbDemo },
  { slug: "button", name: "Button", Demo: ButtonDemo },
  { slug: "button-group", name: "Button Group", Demo: ButtonGroupDemo },
  { slug: "calendar", name: "Calendar", Demo: CalendarDemo },
  { slug: "card", name: "Card", Demo: CardDemo },
  { slug: "chart", name: "Chart", Demo: ChartDemo },
  { slug: "combobox", name: "Combobox", Demo: ComboboxDemo },
  { slug: "context-menu", name: "Context Menu", Demo: ContextMenuDemo },
  { slug: "dialog", name: "Dialog", Demo: DialogDemo },
  { slug: "drawer", name: "Drawer", Demo: DrawerDemo },
  { slug: "dropdown-menu", name: "Dropdown Menu", Demo: DropdownMenuDemo },
  { slug: "empty", name: "Empty", Demo: EmptyDemo },
  { slug: "field", name: "Field", Demo: FieldDemo },
  { slug: "hover-card", name: "Hover Card", Demo: HoverCardDemo },
  { slug: "input", name: "Input", Demo: InputDemo },
  { slug: "input-group", name: "Input Group", Demo: InputGroupDemo },
  { slug: "kbd", name: "Kbd", Demo: KbdDemo },
  { slug: "label", name: "Label", Demo: LabelDemo },
  { slug: "menubar", name: "Menubar", Demo: MenubarDemo },
  { slug: "native-select", name: "Native Select", Demo: NativeSelectDemo },
  { slug: "navigation-menu", name: "Navigation Menu", Demo: NavigationMenuDemo },
  { slug: "pagination", name: "Pagination", Demo: PaginationDemo },
  { slug: "popover", name: "Popover", Demo: PopoverDemo },
  { slug: "progress", name: "Progress", Demo: ProgressDemo },
  { slug: "select", name: "Select", Demo: SelectDemo },
  { slug: "separator", name: "Separator", Demo: SeparatorDemo },
  { slug: "sheet", name: "Sheet", Demo: SheetDemo },
  { slug: "skeleton", name: "Skeleton", Demo: SkeletonDemo },
  { slug: "spinner", name: "Spinner", Demo: SpinnerDemo },
  { slug: "table", name: "Table", Demo: TableDemo },
  { slug: "tabs", name: "Tabs", Demo: TabsDemo },
  { slug: "textarea", name: "Textarea", Demo: TextareaDemo },
  { slug: "toggle", name: "Toggle", Demo: ToggleDemo },
  { slug: "tooltip", name: "Tooltip", Demo: TooltipDemo },
];