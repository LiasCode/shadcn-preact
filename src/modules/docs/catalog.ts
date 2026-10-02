// The single list of documented components. Navigation, the components index, and the prerender routes in
// `vite.config.ts` all derive from it, so it must stay free of JSX and browser APIs (ADR 0003).

export const componentCategories = ["Overlays", "Forms", "Display", "Navigation", "Feedback", "Layout"] as const;

export type ComponentCategory = (typeof componentCategories)[number];

type CatalogEntry = {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  /** Defaults to the name without spaces. */
  exports?: readonly string[];
  dependencies?: readonly string[];
};

export const catalog = [
  { slug: "alert", name: "Alert", description: "Displays a callout for user attention.", category: "Feedback" },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description: "A modal confirmation dialog for destructive or important actions.",
    category: "Overlays",
    exports: [
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
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Keeps media and custom content within a consistent ratio.",
    category: "Layout",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "An image element with fallback content for representing a user.",
    category: "Display",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A compact label for status, metadata, or counts.",
    category: "Display",
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "Shows the path to the current page in a hierarchy.",
    category: "Navigation",
  },
  { slug: "button", name: "Button", description: "Displays a button or link styled as a button.", category: "Forms" },
  {
    slug: "button-group",
    name: "Button Group",
    description: "Groups related button actions into a compact control.",
    category: "Forms",
    exports: ["ButtonGroup", "ButtonGroupSeparator"],
  },
  {
    slug: "calendar",
    name: "Calendar",
    description: "A date picker calendar built on react-day-picker through Preact compat.",
    category: "Forms",
    dependencies: ["react-day-picker", "date-fns"],
  },
  {
    slug: "card",
    name: "Card",
    description: "A flexible container for grouped content and actions.",
    category: "Display",
  },
  {
    slug: "combobox",
    name: "Combobox",
    description: "Combines a trigger, filter input, and selectable list.",
    category: "Overlays",
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description: "A menu opened by right click or context interaction.",
    category: "Overlays",
    exports: ["ContextMenu", "ContextMenuTrigger", "ContextMenuContent", "ContextMenuItem"],
  },
  { slug: "dialog", name: "Dialog", description: "A modal window overlaid on the page content.", category: "Overlays" },
  {
    slug: "drawer",
    name: "Drawer",
    description: "A bottom sheet dialog for secondary workflows.",
    category: "Overlays",
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Displays a menu anchored to a trigger.",
    category: "Overlays",
    exports: ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem"],
  },
  {
    slug: "empty",
    name: "Empty",
    description: "A placeholder state for empty lists, dashboards, or search results.",
    category: "Feedback",
  },
  {
    slug: "field",
    name: "Field",
    description: "Composes labels, controls, descriptions, and validation messages.",
    category: "Forms",
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    description: "Shows rich preview content when hovering a trigger.",
    category: "Overlays",
    exports: ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
  },
  { slug: "input", name: "Input", description: "A styled text input control.", category: "Forms" },
  {
    slug: "input-group",
    name: "Input Group",
    description: "Wraps inputs with addons, buttons, and inline controls.",
    category: "Forms",
    exports: ["InputGroup", "InputGroupInput", "InputGroupAddon", "InputGroupButton"],
  },
  {
    slug: "kbd",
    name: "Kbd",
    description: "Displays keyboard shortcuts in documentation and product UI.",
    category: "Display",
  },
  { slug: "label", name: "Label", description: "Accessible label styling for form controls.", category: "Forms" },
  {
    slug: "menubar",
    name: "Menubar",
    description: "A horizontal application menu with dropdown content.",
    category: "Navigation",
  },
  {
    slug: "native-select",
    name: "Native Select",
    description: "A styled native select control with minimal JavaScript.",
    category: "Forms",
    exports: ["NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"],
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    description: "A responsive navigation menu with dropdown panels.",
    category: "Navigation",
    exports: ["NavigationMenu", "NavigationMenuList", "NavigationMenuItem", "NavigationMenuTrigger"],
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "Navigation controls for paginated collections.",
    category: "Navigation",
  },
  {
    slug: "popover",
    name: "Popover",
    description: "Displays floating content anchored to a trigger.",
    category: "Overlays",
  },
  { slug: "progress", name: "Progress", description: "Shows completion progress for a task.", category: "Feedback" },
  { slug: "select", name: "Select", description: "A custom select menu for choosing one option.", category: "Forms" },
  {
    slug: "separator",
    name: "Separator",
    description: "Visually or semantically separates content.",
    category: "Layout",
  },
  {
    slug: "sheet",
    name: "Sheet",
    description: "A side panel dialog that slides from an edge.",
    category: "Overlays",
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "A loading placeholder with the shape of future content.",
    category: "Feedback",
  },
  { slug: "spinner", name: "Spinner", description: "An animated loading indicator.", category: "Feedback" },
  {
    slug: "table",
    name: "Table",
    description: "Displays tabular data with shadcn-compatible styling.",
    category: "Display",
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Layered sections of content with tab triggers.",
    category: "Navigation",
  },
  { slug: "textarea", name: "Textarea", description: "A multi-line text input control.", category: "Forms" },
  { slug: "toggle", name: "Toggle", description: "A two-state button for on/off controls.", category: "Forms" },
  { slug: "tooltip", name: "Tooltip", description: "A small label shown on hover or focus.", category: "Overlays" },
] as const satisfies readonly CatalogEntry[];

export type ComponentSlug = (typeof catalog)[number]["slug"];

export type ComponentEntry = {
  slug: ComponentSlug;
  name: string;
  description: string;
  category: ComponentCategory;
  exports: readonly string[];
  dependencies?: readonly string[];
};

export const components: readonly ComponentEntry[] = catalog.map((entry: CatalogEntry & { slug: ComponentSlug }) => ({
  ...entry,
  exports: entry.exports ?? [entry.name.replaceAll(" ", "")],
}));

export const componentRoutes: readonly string[] = components.map((entry) => `/docs/components/${entry.slug}`);

export function getComponent(slug: string | undefined): ComponentEntry | undefined {
  return components.find((entry) => entry.slug === slug);
}

export function getNextComponent(slug: ComponentSlug): ComponentEntry | undefined {
  const index = components.findIndex((entry) => entry.slug === slug);
  return components[index + 1] ?? components[0];
}