# AGENTS.md

## Project and current scope

This is an unofficial **Preact 11 port of shadcn/ui**, distributed as copy-paste components, not an npm library.

- `registry/ui/` is the product. Its components and `primitives/` must work when copied into another project.
- `src/` is the deployed documentation/showcase app; it is not distributed with the components.
- `main` contains the Base UI + nova rebuild. `v3` is the maintained older release line.
- All catalog phases are complete: 62 upstream wrappers, 61 showcase sections (Theme is a provider).
  No wrapper uses the retired `share/` primitives. Do not reintroduce that implementation style.
- Keep external runtime dependencies minimal. Port headless primitives to Preact before adding dependencies.
  Existing upstream libraries may remain when they work through `preact/compat`.
- This file is the shared source of agent context. Record essential architectural changes, reviewed deviations,
  and remaining limitations here so a fresh clone contains everything needed to work.

## Setup and commands

Use **Bun**, exact dependency versions, `bun.lock`, and `bunfig.toml`.

- Clone with `git clone --recurse-submodules`; existing clones use `bun run upstream:setup`.
- Install with `bun install --frozen-lockfile`.
- `bun run dev`: network-exposed Vite development server.
- `bun run build`: TypeScript project checks and Vite production build with prerendering.
- `bun run preview`: serve the production build.
- `bun run format`: write Oxfmt formatting; `bunx oxfmt --check`: verify formatting.
- `bun run lint`: Oxlint.
- `bun run test`: primitive and component-installation regressions using Bun and happy-dom.
- `bun run reference`: generate resolved base-nova components/examples in `.cache/shadcn-reference/base-nova`.
- `bun run parity`: compare all wrappers, vendored CSS, and theme tokens with the pinned upstream.
- `bun run parity:test`: mutation and CLI regressions for the parity checker.
- `bun run check`: formatting, primitive tests, parity regressions, parity, lint, and production build.
- `bun run performance`: server-render benchmark for the showcase demos.
- `bun run parity:browser`: independent React/Base UI and Preact behavior/screenshot comparisons.
- `bun run parity:browser:test`: deliberate visual/behavior mutations must fail those comparisons.

Finish implementation changes with `bun run check` and check affected pages in a browser, or report the missing
browser check. Browser parity is separate from `check`; install Chromium with `bunx playwright install chromium`
(or `--with-deps` where system packages are needed). Artifacts go in `.cache/browser-parity/results`.
`BROWSER_PARITY_CASE` accepts a case or comma-separated cases; `BROWSER_PARITY_DIRECTION` accepts `ltr` or `rtl`.

## Upstream reference and parity contract

- `upstream/shadcn` is a pinned Git submodule of `https://github.com/shadcn-ui/ui.git`.
  The parent repository's gitlink locks the revision. Never advance it during routine checks.
- Components: `upstream/shadcn/apps/v4/registry/bases/base/ui/<name>.tsx`.
  Resolve semantic `cn-*` classes through `upstream/shadcn/apps/v4/registry/styles/style-nova.css`.
  Examples: `upstream/shadcn/apps/v4/examples/base`.
- Use root development dependencies for reference transforms. Do not install or modify the upstream workspace
  or require sibling checkouts. `SHADCN_DIR` is an explicit optional override only.
- Preserve upstream filenames, exports, props (`render`, state-dependent `className`/`style`), defaults,
  `data-slot`/other attributes, element nesting/order, and resolved Tailwind classes.
- Replace `IconPlaceholder` with the `lucide-preact` icon named by its `lucide` prop. Use only Lucide icons.
- Import Base UI ports through `./primitives/<name>` instead of `@base-ui/react/<name>`.
  The primitive reference is Base UI **1.6.0**; inspect its source and API before changing behavior.
  Authoring reference files belong inside this repository's ignored `.cache/`.
- Public primitive entry points mirror Base UI subpaths. Shared modules live in
  `registry/ui/primitives/internals/<UpstreamModule>.ts`. Preserve the Base UI MIT license.
- Message Scroller and Questionnaire port `upstream/shadcn/packages/react/src` instead of Base UI.
  Their shared `internals/ShadcnUseRender.ts` preserves their distinct rendering/cancellation semantics.
- Static parity checks export names, literal counts, declared prop/default signatures, JSX/render structure,
  byte-identical vendored CSS, and neutral theme tokens. It does not certify primitive behavior or pixel parity.
- The reviewed wrapper exception is ChartTooltipContent's explicit optional `color` prop, needed because
  Preact div props omit React's legacy field. `scripts/parity-adaptations.ts` checks exact canonical hashes;
  never broaden exemptions to hide drift. Record any new unavoidable deviation here with its reason.
- Port upstream examples to `src/modules/showcase/examples/` and render them through the showcase entry.
  Adapt Next Image/Link to native elements, prefix ids/labels per example, and remove unused imports.

## Preact, types, and component conventions

- Components are plain functions with `ref` as a prop. Do not use `forwardRef` or `"use client"`.
- Import React APIs from `preact/compat` or `preact/hooks`, never directly from `react`.
  Native `HTMLAttributes`/`CSSProperties` come from the `preact` root.
- Use `import type`; TypeScript is strict with `noUncheckedIndexedAccess` and `noUnused*`.
- Shared `ComponentProps` combines intrinsic union fields, unwraps Signals, and permits compatible callback refs.
  `BaseUIComponentProps` omits `class`; use `className` consistently.
- Use `cva`/`VariantProps`, exporting the component and its `*Variants` object where upstream does.
  Merge classes through `./lib/utils` (`cn`).
- Native DOM events support `preventBaseUIHandler()`. Merged event handlers run right-to-left.
  Input text changes use `onInput`; public callbacks retain upstream names and cancelability.
- Render-element refs come from `vnode.ref` for DOM elements and `props.ref` for components.
  Stable callbacks store their latest implementation during render; ids use Preact `useId` with `base-ui-` prefix.
- Restore controlled Questionnaire inputs/radio siblings when owners reject changes.
- Guard browser globals, observers, scheduling, and storage for SSR/prerendering with
  `typeof window !== "undefined"` before browser-only work.
- Keep all registry imports relative. Never import from `src/` or use app aliases in registry files.
- Write readable multiline blocks. Every `if`/`else` body and loop uses braces; ordinary `else if` chains are fine.
  Separate consecutive standalone function calls and logical groups with blank lines. Give functions, types,
  early returns, and control blocks semantic breathing room; formatting alone does not provide this structure.

## Floating behavior and performance invariants

- Use native Floating UI `computePosition`/`autoUpdate` from the existing `@floating-ui/react-dom` dependency;
  Preact owns interactions, contexts, refs, and asynchronous state. Reject stale positioning results.
- Preserve RTL/logical sides, collision behavior, size/origin variables, and device-pixel coordinate rounding.
  Closed keepMounted content must not track anchors. Reuse unchanged positioning state to avoid rerenders.
- Focus and dismissal must preserve modal trapping, nested-layer ordering, cancelable events, return focus,
  nonmodal Tab order, pointer/touch intent, composition handling, portals, and custom document containers.
- Reconcile background inert/aria-hidden locks by element/attribute; retain unchanged locks, reference counts,
  original attributes, live regions, nested exclusions, and newly inserted background content.
- Scroll locks are per-document and reference-counted. Lock html with overflow hidden; use overflow clip on body
  unless body is the document scrolling element. Making body a new scroll container hides sticky navigation.
  Restore original inline values/priorities, scrollbar compensation, and markers after the final lock.
- Cache computed ancestor styles only within one tabbable traversal, never across interactions.
- Preserve stable Slider observers, memoized Combobox filtering, ScrollArea observation cleanup, and
  Message Scroller's event-driven/coalesced frames, stable store snapshots, prepend anchors, and cleanup.

## Field/Form semantics

- The shadcn `field.tsx` wrapper is presentational. Validation lives in `primitives/field`, `form`, and `fieldset`.
- Registered controls: Input, Checkbox, Switch, RadioGroup, Select, Combobox, and Slider.
  Keep raw validation values separate from submitted serialization, native constraints, and visible focus targets.
  Combobox's query must not register as a second control or replace the selected value.
- Field.Item provides local label/description scopes; Fieldset propagates disabled state and legend associations.
  Disabled controls are excluded from submitted values; moving focus within a composite is not a field blur.
- Native reset updates run in a task after dispatch/default actions and honor cancellation and controlled owners.
  Generation checks discard stale validation after edits, reset, removal, or disabling; assimilate thenables.
- Submission remains synchronous: outstanding async validators do not delay `onFormSubmit`.
  Blur-required checks respect interaction history; submission/imperative validation bypass debounce.
- Field reset restores local dirty/touched state; browser comparison does not claim those flags match upstream.

## Documentation app and styling

- Use `preact-iso`: `src/main.tsx` hydrates `#app` and exports `prerender`; `src/App.tsx` holds providers;
  `src/routes.tsx` defines routes. Following the requested shadcn-style site organization, `/` is the
  landing page, `/docs` is the introduction, `/docs/installation` is the manual setup guide, and
  `/docs/components` is the catalog. `/components` remains a compatibility route for existing links.
  Documentation uses `src/layouts/docs-layout.tsx` with shared sidebar navigation and optional page contents.
  `src/lib/component-catalog.ts` is the shared navigation metadata; it must not import demo code.
  `/docs/components/<slug>` gives each catalog component its own installation, usage, and examples page.
  Each page lazily imports only its demo and documentation; `/components` retains the legacy full showcase.
  `scripts/component-docs.ts` generates page data in `.cache/component-docs` when Vite starts.
  Each guide uses `degit@3.10.0 --files` to select the component's relative-import dependency closure
  and both MIT licenses from the repository. Selection happens in `.cache/shadcn-preact/<slug>` before
  copying into `src/components/ui`: degit's file filter prunes the destination, so never point a filtered
  `--force` clone directly at a consumer's existing component directory.
  Package versions come from the root manifest, descriptions/usage from the pinned upstream MDX, and example
  code from local ports. Installation regressions in `tests/docs` verify file selections and copied imports.
  The build requires the pinned submodule; it no longer packages or serves source archives.
  Prerender all catalog paths from `componentCatalog`; do not import the aggregate demos into individual pages.
- App imports use `@/*`; registry consumers use `@registry/*`.
  Keep aliases aligned in `vite.config.ts` and `tsconfig.app.json`: `react`/`react-dom` to `preact/compat`,
  JSX runtimes to `preact/jsx-runtime`.
- Add components with a registry file, `src/modules/showcase/demos/<name>-demo.tsx`, an entry in its `index.ts`,
  and upstream examples. New static routes also belong in `additionalPrerenderRoutes` in `vite.config.ts`.
- Keep the showcase lazily loaded; notification viewports belong there so the introduction stays lightweight.
  Measure section heights in batches before applying content-visibility containment; refresh on width changes.
  Keep offscreen demo state. Calendar, Sidebar, and newer conversation examples mount one selected example.
  Pause documentation-only OTP polling and carousel autoplay offscreen without changing registry defaults.
- Tailwind v4 uses `@tailwindcss/postcss`, without a Tailwind config. Tokens/global styles: `src/index.css`.
  `src/styles/shadcn-tailwind.css` is vendored upstream CSS; never hand-format or casually edit it.
- ThemeProvider/useTheme in `registry/ui/theme.tsx` apply `.dark` to html. Native color-scheme follows the theme.
  Site scrollbar styling belongs to the documentation app, not the copy-paste registry.
- Chat demos use deterministic local streaming fixtures, reduced-motion CSS entrances, and a limited safe
  Markdown helper. These app helpers do not promise AI SDK, Motion physics, or general Markdown equivalence.

## Remaining scope and verification limits

- The live browser suite covers 14 fixtures, 328 states across LTR/RTL, light/dark, and desktop/mobile Chromium.
  It uses real React/Base UI reference pages generated independently from the pinned upstream wrappers.
  Keep expected behavior assertions on both runtimes and zero differing pixels under the configured pixelmatch
  threshold; never replace this with an approvable local screenshot baseline.
- Next work: remaining catalog browser comparisons, touch gestures, additional engines, animation timing,
  actual fonts, physical devices, and complex nested overlays. Select's ordinary anchored fixture excludes
  selected-item alignment. Native scroll locking does not claim every historical iOS workaround.
- Deferred primitives: CheckboxGroup/multiple-input registration, initial values across control replacement,
  unused store/part APIs, Combobox grid/virtualization, and anchored Toast parts. Do not claim complete Base UI parity.
- Deferred examples: upstream language-dependent RTL infrastructure, calendar-hijri's extra calendar/font setup,
  and sidebar-rsc's React Server Components environment.
- Date Picker, Form, and Data Table recipes are separate from the upstream component-file catalog.
