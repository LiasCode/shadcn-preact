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
import type { ComponentType } from "preact";

export type ComponentDoc = {
  slug: string;
  name: string;
  description: string;
  category: "Overlays" | "Forms" | "Display" | "Navigation" | "Feedback" | "Layout";
  demo: ComponentType;
  exports: string[];
  dependencies?: string[];
  usage: string;
};

const componentExports: Record<string, string[]> = {
  "alert-dialog": [
    "AlertDialog",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogHeader",
    "AlertDialogFooter",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogAction",
    "AlertDialogCancel",
  ],
  "button-group": ["ButtonGroup", "ButtonGroupSeparator"],
  "context-menu": ["ContextMenu", "ContextMenuTrigger", "ContextMenuContent", "ContextMenuItem"],
  "dropdown-menu": ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem"],
  "hover-card": ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
  "input-group": ["InputGroup", "InputGroupInput", "InputGroupAddon", "InputGroupButton"],
  "native-select": ["NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"],
  "navigation-menu": ["NavigationMenu", "NavigationMenuList", "NavigationMenuItem", "NavigationMenuTrigger"],
};

function usageFor(slug: string, name: string, exports: string[]) {
  const primary = exports[0] ?? name.replaceAll(" ", "");
  const file = slug;

  if (exports.length === 1) {
    return `import { ${primary} } from "@/components/ui/${file}"

export function Example() {
  return <${primary}>${name}</${primary}>
}`;
  }

  return `import {
  ${exports.slice(0, Math.min(exports.length, 5)).join(",\n  ")}
} from "@/components/ui/${file}"

export function Example() {
  return (
    <${primary}>
      {/* compose the parts you need */}
    </${primary}>
  )
}`;
}

const docs = [
  ["alert", "Alert", "Displays a callout for user attention.", "Feedback", AlertDemo],
  [
    "alert-dialog",
    "Alert Dialog",
    "A modal confirmation dialog for destructive or important actions.",
    "Overlays",
    AlertDialogDemo,
  ],
  [
    "aspect-ratio",
    "Aspect Ratio",
    "Keeps media and custom content within a consistent ratio.",
    "Layout",
    AspectRatioDemo,
  ],
  ["avatar", "Avatar", "An image element with fallback content for representing a user.", "Display", AvatarDemo],
  ["badge", "Badge", "A compact label for status, metadata, or counts.", "Display", BadgeDemo],
  ["breadcrumb", "Breadcrumb", "Shows the path to the current page in a hierarchy.", "Navigation", BreadcrumbDemo],
  ["button", "Button", "Displays a button or link styled as a button.", "Forms", ButtonDemo],
  ["button-group", "Button Group", "Groups related button actions into a compact control.", "Forms", ButtonGroupDemo],
  [
    "calendar",
    "Calendar",
    "A date picker calendar built on react-day-picker through Preact compat.",
    "Forms",
    CalendarDemo,
  ],
  ["card", "Card", "A flexible container for grouped content and actions.", "Display", CardDemo],
  ["combobox", "Combobox", "Combines a trigger, filter input, and selectable list.", "Overlays", ComboboxDemo],
  ["context-menu", "Context Menu", "A menu opened by right click or context interaction.", "Overlays", ContextMenuDemo],
  ["dialog", "Dialog", "A modal window overlaid on the page content.", "Overlays", DialogDemo],
  ["drawer", "Drawer", "A bottom sheet dialog for secondary workflows.", "Overlays", DrawerDemo],
  ["dropdown-menu", "Dropdown Menu", "Displays a menu anchored to a trigger.", "Overlays", DropdownMenuDemo],
  ["empty", "Empty", "A placeholder state for empty lists, dashboards, or search results.", "Feedback", EmptyDemo],
  ["field", "Field", "Composes labels, controls, descriptions, and validation messages.", "Forms", FieldDemo],
  ["hover-card", "Hover Card", "Shows rich preview content when hovering a trigger.", "Overlays", HoverCardDemo],
  ["input", "Input", "A styled text input control.", "Forms", InputDemo],
  ["input-group", "Input Group", "Wraps inputs with addons, buttons, and inline controls.", "Forms", InputGroupDemo],
  ["kbd", "Kbd", "Displays keyboard shortcuts in documentation and product UI.", "Display", KbdDemo],
  ["label", "Label", "Accessible label styling for form controls.", "Forms", LabelDemo],
  ["menubar", "Menubar", "A horizontal application menu with dropdown content.", "Navigation", MenubarDemo],
  [
    "native-select",
    "Native Select",
    "A styled native select control with minimal JavaScript.",
    "Forms",
    NativeSelectDemo,
  ],
  [
    "navigation-menu",
    "Navigation Menu",
    "A responsive navigation menu with dropdown panels.",
    "Navigation",
    NavigationMenuDemo,
  ],
  ["pagination", "Pagination", "Navigation controls for paginated collections.", "Navigation", PaginationDemo],
  ["popover", "Popover", "Displays floating content anchored to a trigger.", "Overlays", PopoverDemo],
  ["progress", "Progress", "Shows completion progress for a task.", "Feedback", ProgressDemo],
  ["select", "Select", "A custom select menu for choosing one option.", "Forms", SelectDemo],
  ["separator", "Separator", "Visually or semantically separates content.", "Layout", SeparatorDemo],
  ["sheet", "Sheet", "A side panel dialog that slides from an edge.", "Overlays", SheetDemo],
  ["skeleton", "Skeleton", "A loading placeholder with the shape of future content.", "Feedback", SkeletonDemo],
  ["spinner", "Spinner", "An animated loading indicator.", "Feedback", SpinnerDemo],
  ["table", "Table", "Displays tabular data with shadcn-compatible styling.", "Display", TableDemo],
  ["tabs", "Tabs", "Layered sections of content with tab triggers.", "Navigation", TabsDemo],
  ["textarea", "Textarea", "A multi-line text input control.", "Forms", TextareaDemo],
  ["toggle", "Toggle", "A two-state button for on/off controls.", "Forms", ToggleDemo],
  ["tooltip", "Tooltip", "A small label shown on hover or focus.", "Overlays", TooltipDemo],
] as const;

export const componentDocs: ComponentDoc[] = docs.map(([slug, name, description, category, demo]) => {
  const exports = componentExports[slug] ?? [name.replaceAll(" ", "")];
  const dependencies = slug === "calendar" ? ["react-day-picker", "date-fns"] : undefined;

  return {
    slug,
    name,
    description,
    category,
    demo,
    exports,
    dependencies,
    usage: usageFor(slug, name, exports),
  };
});

export const componentCategories = ["Overlays", "Forms", "Display", "Navigation", "Feedback", "Layout"] as const;

export function getComponentDoc(slug?: string) {
  return componentDocs.find((doc) => doc.slug === slug);
}
