import type { ComponentType } from "preact";

import { componentCatalog } from "@/lib/component-catalog";

import { AccordionDemo } from "./accordion-demo";
import { AlertDemo } from "./alert-demo";
import { AlertDialogDemo } from "./alert-dialog-demo";
import { AspectRatioDemo } from "./aspect-ratio-demo";
import { AttachmentDemo } from "./attachment-demo";
import { AvatarDemo } from "./avatar-demo";
import { BadgeDemo } from "./badge-demo";
import { BreadcrumbDemo } from "./breadcrumb-demo";
import { BubbleDemo } from "./bubble-demo";
import { ButtonDemo } from "./button-demo";
import { ButtonGroupDemo } from "./button-group-demo";
import { CalendarDemo } from "./calendar-demo";
import { CardDemo } from "./card-demo";
import { CarouselDemo } from "./carousel-demo";
import { ChartDemo } from "./chart-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { CollapsibleDemo } from "./collapsible-demo";
import { ComboboxDemo } from "./combobox-demo";
import { CommandDemo } from "./command-demo";
import { ContextMenuDemo } from "./context-menu-demo";
import { DialogDemo } from "./dialog-demo";
import { DrawerDemo } from "./drawer-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { EmptyDemo } from "./empty-demo";
import { FieldDemo } from "./field-demo";
import { HoverCardDemo } from "./hover-card-demo";
import { InputDemo } from "./input-demo";
import { InputGroupDemo } from "./input-group-demo";
import { InputOtpDemo } from "./input-otp-demo";
import { ItemDemo } from "./item-demo";
import { KbdDemo } from "./kbd-demo";
import { LabelDemo } from "./label-demo";
import { MarkerDemo } from "./marker-demo";
import { MenubarDemo } from "./menubar-demo";
import { MessageDemo } from "./message-demo";
import { MessageScrollerDemo } from "./message-scroller-demo";
import { NativeSelectDemo } from "./native-select-demo";
import { NavigationMenuDemo } from "./navigation-menu-demo";
import { PaginationDemo } from "./pagination-demo";
import { PopoverDemo } from "./popover-demo";
import { ProgressDemo } from "./progress-demo";
import { QuestionnaireDemo } from "./questionnaire-demo";
import { RadioGroupDemo } from "./radio-group-demo";
import { ResizableDemo } from "./resizable-demo";
import { ScrollAreaDemo } from "./scroll-area-demo";
import { SelectDemo } from "./select-demo";
import { SeparatorDemo } from "./separator-demo";
import { SheetDemo } from "./sheet-demo";
import { SidebarDemo } from "./sidebar-demo";
import { SkeletonDemo } from "./skeleton-demo";
import { SliderDemo } from "./slider-demo";
import { SonnerDemo } from "./sonner-demo";
import { SpinnerDemo } from "./spinner-demo";
import { SwitchDemo } from "./switch-demo";
import { TableDemo } from "./table-demo";
import { TabsDemo } from "./tabs-demo";
import { TextareaDemo } from "./textarea-demo";
import { ToastDemo } from "./toast-demo";
import { ToggleDemo } from "./toggle-demo";
import { ToggleGroupDemo } from "./toggle-group-demo";
import { TooltipDemo } from "./tooltip-demo";

export type ShowcaseEntry = {
  /** The registry file name, also used as the section anchor. */
  slug: string;
  name: string;
  Demo: ComponentType;
};

const demos = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  "aspect-ratio": AspectRatioDemo,
  attachment: AttachmentDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  breadcrumb: BreadcrumbDemo,
  bubble: BubbleDemo,
  button: ButtonDemo,
  "button-group": ButtonGroupDemo,
  calendar: CalendarDemo,
  card: CardDemo,
  carousel: CarouselDemo,
  chart: ChartDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  combobox: ComboboxDemo,
  command: CommandDemo,
  "context-menu": ContextMenuDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  "dropdown-menu": DropdownMenuDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  "hover-card": HoverCardDemo,
  input: InputDemo,
  "input-group": InputGroupDemo,
  "input-otp": InputOtpDemo,
  item: ItemDemo,
  kbd: KbdDemo,
  label: LabelDemo,
  marker: MarkerDemo,
  menubar: MenubarDemo,
  message: MessageDemo,
  "message-scroller": MessageScrollerDemo,
  "native-select": NativeSelectDemo,
  "navigation-menu": NavigationMenuDemo,
  pagination: PaginationDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  questionnaire: QuestionnaireDemo,
  "radio-group": RadioGroupDemo,
  resizable: ResizableDemo,
  "scroll-area": ScrollAreaDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  sheet: SheetDemo,
  sidebar: SidebarDemo,
  skeleton: SkeletonDemo,
  slider: SliderDemo,
  sonner: SonnerDemo,
  spinner: SpinnerDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  textarea: TextareaDemo,
  toast: ToastDemo,
  toggle: ToggleDemo,
  "toggle-group": ToggleGroupDemo,
  tooltip: TooltipDemo,
} satisfies Record<(typeof componentCatalog)[number]["slug"], ComponentType>;

/** Every registry component shown in the showcase, in alphabetical order. */
export const showcase: readonly ShowcaseEntry[] = componentCatalog.map(({ slug, name }) => ({
  slug,
  name,
  Demo: demos[slug],
}));
