# AGENTS.md

## What this is

An unofficial **Preact port of shadcn/ui**. It is not an npm library: it is a collection of copy-paste components.

- `registry/ui/` is the **product**: the components and their shared primitives (`registry/ui/share/`). People copy
  this folder into their projects.
- `src/` is the **documentation site** that demonstrates every component. It is deployed, not distributed.

A core goal is **minimal external dependencies**. shadcn/ui is built on Radix UI; this port reimplements the Radix
primitives it needs (Slot, Portal, controlled state, focus trap, floating positioning) in `registry/ui/share/`. When
adding a component, prefer porting a primitive over adding a dependency.

Read the decision records in [`docs/decisions/`](./docs/decisions/README.md) before changing an area. Never edit an
accepted, committed record; supersede it with a new one.

## Commands

Package manager is **Bun** (`bun.lock`, exact versions, `bunfig.toml`).

- `bun run dev`: Vite dev server, exposed on the network
- `bun run build`: type check (`tsc -b`) and Vite build with prerendering
- `bun run preview`: preview the production build
- `bun run lint`: oxlint
- `bun run fmt`: oxfmt (writes); `bun run fmt:check` verifies

There is **no test suite**. A change is done only when `fmt:check`, `lint`, and `build` all pass, and the affected
pages were checked in a browser (or the missing browser check is reported).

## Registry rules (`registry/ui/`)

- **Self-contained:** files import each other only with relative paths (`./button`, `./share/cn`). Never import from
  `src/` and never use an alias. `grep -rn 'from "@/' registry` must be empty. (ADR 0002)
- Same public API and styles as the shadcn/ui originals unless a record says otherwise:
  - https://ui.shadcn.com/docs/components
  - https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4/ui
- Variants with `class-variance-authority` (`cva`) and `VariantProps`; export both the component and its
  `*Variants` object.
- `forwardRef` from `preact/compat`; props typed with `ComponentProps<"...">`.
- Class merging with `cn()` from `./share/cn`.
- `asChild` polymorphism with `Slot` from `./share/slot`.
- Set `data-slot`, `data-variant`, and `data-size`; sibling components select on them
  (for example `in-data-[slot=button-group]`).
- Icons come only from `lucide-preact`. (ADR 0004)
- Code that touches `window`, `document`, or `localStorage` must guard with `typeof window !== "undefined"`: it runs
  at build time during prerendering.

## Documentation app (`src/`)

- Preact with `preact-iso` routing. `src/main.tsx` hydrates `#app` and exports `prerender`; `src/App.tsx` holds the
  providers and `src/routes.tsx` every route. Layout follows ADR 0003 as amended by ADR 0005.
- Imports components through `@registry/*`; app code uses `@/*`.
- The site has only two views (ADR 0005): an introduction (`/`) and a showcase of every component (`/components`).
  There is no per-component documentation; do not add it back without a new record.
- Adding a component: its file in `registry/ui/`, a demo in `src/modules/showcase/demos/<name>-demo.tsx`, and an
  entry in `src/modules/showcase/demos/index.ts`.
- A new static route goes in `src/routes.tsx` and in `additionalPrerenderRoutes` in `vite.config.ts`.

## Styling

- **Tailwind CSS v4** via `@tailwindcss/postcss`, no config file. Theme tokens and global styles are in
  `src/index.css`.
- Dark mode is class-based (`.dark` on `<html>`), managed by `ThemeProvider` and `useTheme` in
  `registry/ui/theme.tsx`.

## Aliases and React compatibility

Defined in both `vite.config.ts` and `tsconfig.app.json`; keep them in sync:

- `@/*` → `src/*`
- `@registry/*` → `registry/*`
- `react` and `react-dom` → `preact/compat`, so React-targeting libraries (`react-day-picker`, `recharts`,
  `@floating-ui/react-dom`) work. Import React APIs from `preact/compat`, never from `react`.

## TypeScript

Strict, with `noUncheckedIndexedAccess` and `noUnused*`. `import type` for type-only imports.

## Branches

The maintained release line is the **`v3` branch**; `main` carries newer component work.