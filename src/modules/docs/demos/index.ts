import type { ComponentType } from "preact";

import type { ComponentSlug } from "../catalog";
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

/** One demo per catalog entry; the type makes a missing demo a build error. */
export const demos: Record<ComponentSlug, ComponentType> = {
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  "aspect-ratio": AspectRatioDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  breadcrumb: BreadcrumbDemo,
  button: ButtonDemo,
  "button-group": ButtonGroupDemo,
  calendar: CalendarDemo,
  card: CardDemo,
  combobox: ComboboxDemo,
  "context-menu": ContextMenuDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  "dropdown-menu": DropdownMenuDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  "hover-card": HoverCardDemo,
  input: InputDemo,
  "input-group": InputGroupDemo,
  kbd: KbdDemo,
  label: LabelDemo,
  menubar: MenubarDemo,
  "native-select": NativeSelectDemo,
  "navigation-menu": NavigationMenuDemo,
  pagination: PaginationDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  sheet: SheetDemo,
  skeleton: SkeletonDemo,
  spinner: SpinnerDemo,
  table: TableDemo,
  tabs: TabsDemo,
  textarea: TextareaDemo,
  toggle: ToggleDemo,
  tooltip: TooltipDemo,
};