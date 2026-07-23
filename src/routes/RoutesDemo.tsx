import type { ComponentChild } from "preact";

import { AlertDemo } from "@/components/demo/alert-demo";
import { AlertDialogDemo } from "@/components/demo/alert-dialog-demo";
import { AspectRatioDemo } from "@/components/demo/aspect-ratio-demo";
import { AvatarDemo } from "@/components/demo/avatar-demo";
import { BadgeDemo } from "@/components/demo/badge-demo";
import { BreadcrumbDemo } from "@/components/demo/breadcrumb-demo";
import { ButtonDemo } from "@/components/demo/button-demo";
import { ButtonGroupDemo } from "@/components/demo/button-group-demo";
import { CalendarDemo } from "@/components/demo/calendar-demo";
import { CardDemo } from "@/components/demo/card-demo";
import { ComboboxDemo } from "@/components/demo/combobox-demo";
import { ContextMenuDemo } from "@/components/demo/context-menu-demo";
import { DialogDemo } from "@/components/demo/dialog-demo";
import { DrawerDemo } from "@/components/demo/drawer-demo";
import { DropdownMenuDemo } from "@/components/demo/dropdown-menu-demo";
import { EmptyDemo } from "@/components/demo/empty-demo";
import { FieldDemo } from "@/components/demo/field-demo";
import { HoverCardDemo } from "@/components/demo/hover-card-demo";
import { InputDemo } from "@/components/demo/input-demo";
import { InputGroupDemo } from "@/components/demo/input-group-demo";
import { KbdDemo } from "@/components/demo/kbd-demo";
import { LabelDemo } from "@/components/demo/label-demo";
import { MenubarDemo } from "@/components/demo/menubar-demo";
import { NativeSelectDemo } from "@/components/demo/native-select-demo";
import { NavigationMenuDemo } from "@/components/demo/navigation-menu-demo";
import { PaginationDemo } from "@/components/demo/pagination-demo";
import { PopoverDemo } from "@/components/demo/popover-demo";
import { ProgressDemo } from "@/components/demo/progress-demo";
import { SelectDemo } from "@/components/demo/select-demo";
import { SeparatorDemo } from "@/components/demo/separator-demo";
import { SheetDemo } from "@/components/demo/sheet-demo";
import { SkeletonDemo } from "@/components/demo/skeleton-demo";
import { SpinnerDemo } from "@/components/demo/spinner-demo";
import { TableDemo } from "@/components/demo/table-demo";
import { TabsDemo } from "@/components/demo/tabs-demo";
import { TextareaDemo } from "@/components/demo/textarea-demo";
import { ToggleDemo } from "@/components/demo/toggle-demo";
import { TooltipDemo } from "@/components/demo/tooltip-demo";

export const RoutesDemoObj: Record<string, ComponentChild> = {
  alert: <AlertDemo />,
  "alert-dialog": <AlertDialogDemo />,
  avatar: <AvatarDemo />,
  "aspect-ratio": <AspectRatioDemo />,
  badge: <BadgeDemo />,
  breadcrumb: <BreadcrumbDemo />,
  button: <ButtonDemo />,
  "button-group": <ButtonGroupDemo />,
  calendar: <CalendarDemo />,
  card: <CardDemo />,
  // "chart": <ChartDemo />,
  combobox: <ComboboxDemo />,
  "context-menu": <ContextMenuDemo />,
  dialog: <DialogDemo />,
  "dropdown-menu": <DropdownMenuDemo />,
  drawer: <DrawerDemo />,
  empty: <EmptyDemo />,
  field: <FieldDemo />,
  "hover-card": <HoverCardDemo />,
  input: <InputDemo />,
  "input-group": <InputGroupDemo />,
  kbd: <KbdDemo />,
  label: <LabelDemo />,
  menubar: <MenubarDemo />,
  "native-select": <NativeSelectDemo />,
  "navigation-menu": <NavigationMenuDemo />,
  pagination: <PaginationDemo />,
  popover: <PopoverDemo />,
  progress: <ProgressDemo />,
  separator: <SeparatorDemo />,
  sheet: <SheetDemo />,
  select: <SelectDemo />,
  skeleton: <SkeletonDemo />,
  spinner: <SpinnerDemo />,
  table: <TableDemo />,
  tabs: <TabsDemo />,
  textarea: <TextareaDemo />,
  toggle: <ToggleDemo />,
  tooltip: <TooltipDemo />,
};