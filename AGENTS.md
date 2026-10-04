# AGENTS.md

## What this is

An unofficial **Preact port of shadcn/ui**. It is not an npm library: it is a collection of copy-paste components.

- `registry/ui/` is the **product**: the components and their shared primitives (`registry/ui/primitives/`). People copy
  this folder into their projects.
- `src/` is the **documentation site** that demonstrates every component. It is deployed, not distributed.

A core goal is **minimal external dependencies**. shadcn/ui is built on Radix UI; this port reimplements the Radix
primitives it needs (Slot, Portal, controlled state, focus trap, floating positioning) in `registry/ui/primitives/`. When
adding a component, prefer porting a primitive over adding a dependency.

Read the decision records in [`docs/decisions/`](./docs/decisions/README.md) before changing an area. Never edit an
accepted, committed record; supersede it with a new one.

## Commands

Package manager is **Bun** (`bun.lock`, exact versions, `bunfig.toml`).

- `bun run dev`: Vite dev server, exposed on the network
- `bun run build`: type check (`tsc -b`) and Vite build with prerendering
- `bun run preview`: preview the production build
- `bun run lint`: oxlint
- `bun run test`: core primitive regression tests with Bun and happy-dom (ADR 0011)
- `bun run format`: oxfmt (writes); `bunx oxfmt --check` verifies
- `bun run reference`: writes the upstream base-nova reference (components and examples) to
  `.cache/shadcn-reference/base-nova` (ADR 0009)
- `bun run upstream:setup`: initialize the pinned shadcn Git submodule; clone with `--recurse-submodules` to fetch it initially.
- `bun run check`: format check, tests, parity regression checks, parity, lint, and build.
- `bun run parity`: checks the vendored CSS, the theme tokens, and every rebuilt component against upstream

A change is done only when `bunx oxfmt --check`, `test`, `lint`, and `build` all pass, and the affected
pages were checked in a browser (or the missing browser check is reported).

## Registry rules (`registry/ui/`)

**Strict rule (ADR 0008):** every component matches the original shadcn/ui checked out in `upstream/shadcn`, so the API,
the look, and the Tailwind classes stay interoperable:

- Reference: `upstream/shadcn/apps/v4/registry/bases/base/ui/<name>.tsx` (the Base UI base), with its `cn-*` classes resolved
  through the **nova** style, `upstream/shadcn/apps/v4/registry/styles/style-nova.css`. Demos come from
  `upstream/shadcn/apps/v4/examples/base`.
- Same file name, exports, props (`render`, state-dependent `className`), `data-slot` and other `data-*` attributes,
  structure, and resolved classes. A deviation needs its own record.
- `IconPlaceholder` becomes the `lucide-preact` icon named in its `lucide` prop. Icons come only from `lucide-preact`.
  (ADR 0004)
- `@base-ui/react/<name>` is ported to Preact in `registry/ui/primitives/<name>` and imported as
  `./primitives/<name>`. The primitive reference is Base UI 1.6.0 (code and `docs/`); install its source locally when porting a new primitive. The parity commands use the submodule and root development dependencies without installing the upstream monorepo.
- Primitives keep Base UI's structure: public entry points in `primitives/<name>`, shared code in
  `primitives/internals/<UpstreamModule>.ts`. Preact adaptations are listed in ADR 0010; add new ones there or in a
  new record. Type and phase-2 adaptations are in ADR 0012.
- Components are plain functions that receive `ref` as a prop (Preact 11), without `forwardRef` or `"use client"`.
  React APIs come from `preact/compat` or `preact/hooks`.
- Variants with `cva` and `VariantProps`, exporting the component and its `*Variants` object; class merging with
  `cn()`, as upstream.
- A rebuilt component is done only when `bun run parity` passes. Port its upstream examples from the reference to
  `src/modules/showcase/examples/<example>.tsx` and render them from its showcase entry. (ADR 0009)
- Class merging comes from `./lib/utils` (the `cn` package), like upstream.
- Follow the phase order in ADR 0008. Until a component is rewritten, its old file (using `./share/`, `asChild`, and
  `forwardRef`) stays as is; do not mix the two styles in one file.

Always:

- **Self-contained:** files import each other only with relative paths (`./button`, `./primitives/dialog`). Never
  import from `src/` and never use an alias. `grep -rn 'from "@/' registry` must be empty. (ADR 0002)
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
- `react/jsx-runtime` and `react/jsx-dev-runtime` → `preact/jsx-runtime`
- `react` and `react-dom` → `preact/compat`, so React-targeting libraries (`react-day-picker`, `recharts`,
  `@floating-ui/react-dom`, `cmdk`, `input-otp`, `embla-carousel-react`, `react-resizable-panels`, `sonner`) work. Import React APIs from `preact/compat`, never from `react`.

## TypeScript

Strict, with `noUncheckedIndexedAccess` and `noUnused*`. `import type` for type-only imports.

## Branches

The maintained release line is the **`v3` branch**; `main` carries newer component work.