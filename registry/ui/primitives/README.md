# Primitives

A Preact port of [Base UI](https://base-ui.com) 1.6.0, the headless library behind the Base UI base of shadcn/ui.
Each folder mirrors a `@base-ui/react/<name>` entry point, so components import `./primitives/<name>` where upstream
imports `@base-ui/react/<name>`. `internals/` holds the shared code that Base UI keeps in `internals`, `utils`, and
the `@base-ui/utils` package.

Base UI is released under the MIT license; see [LICENSE](./LICENSE).

Ported entry points: `merge-props`, `use-render`, `direction-provider`, `button`, `separator`, `input`, `avatar`,
`progress`, `toggle`, `toggle-group`, `checkbox`, `switch`, `radio`, `radio-group`, `collapsible`, `accordion`, `tabs`,
`slider`, `dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `preview-card`, `menu`, `context-menu`, `menubar`, `navigation-menu`, `select`, and `scroll-area`. Composite list registration and linear roving focus live in `internals/composite/`.

The exposed parts are those needed by the rebuilt shadcn components. Input and form controls currently use the
standalone Field context; Base UI Field/Form validation, CheckboxGroup, grid/Toolbar integration, and unused parts
such as Tabs.Indicator and Slider.Label/Value remain deferred (ADRs 0012 and 0013).

Floating infrastructure (ADR 0014) lives in `internals/`: `useAnchorPositioning`, `FloatingTree`/`FloatingTreeStore`,
`useFloatingRootContext`, `useDismiss`, `FloatingPortal`, `FloatingFocusManager`, `FocusGuard`,
`markOthers`, and scroll-lock hooks. These are shared internal APIs for the next overlay phases. Native Floating UI
computation uses the existing `@floating-ui/react-dom` dependency; interactions and state use Preact.
The browser fixture is available with `bun run dev` at `/tests/fixtures/floating.html` and is excluded from the site build.

Overlay entry points share lifecycle, trigger handles, hover interaction, and native drawer gestures (ADR 0015).
They expose the parts needed by the rebuilt wrappers; unused React store APIs and Drawer SwipeArea/Indent parts
remain deferred. Sheet uses Dialog, and HoverCard uses PreviewCard.

Menus, selection, and custom scrollbars use the shared Preact popup context and native DOM interactions (ADR 0016).
Menu is shared by DropdownMenu, ContextMenu, and Menubar. NavigationMenu moves content into its viewport; Select
keeps native form inputs. Unused Menu.LinkItem/Viewport and ScrollArea.Content parts remain deferred.