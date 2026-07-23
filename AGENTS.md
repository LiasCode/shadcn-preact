# AGENTS.md

## What this is

An unofficial **Preact port of shadcn/ui**. This is NOT a component library distributed via npm — it's a collection of copy-paste components. The deployed site (`src/`) is a demo/documentation app that renders every component. The components themselves (`src/components/ui/`) are the actual product: they are meant to be copied into other projects.

A core design goal is **minimizing external dependencies**. shadcn/ui is built on Radix UI; this port reimplements the Radix primitives it needs (Slot, Portal, controlled state, etc.) in `src/components/ui/share/` rather than pulling in Radix. When adding a component, prefer porting/inlining a primitive over adding a dependency.

## Commands

Package manager is **Bun** (`bun.lock`).

- `bun run dev` — Vite dev server (host exposed on network)
- `bun run build` — type-check (`tsc -b`) then Vite build with prerendering
- `bun run preview` — preview the production build
- `bun run lint` — Biome lint with `--fix --unsafe` (autofixes)
- `bun run format` — Prettier write over `src` and `tsconfig.*`

There is **no test suite** in this repo.

## Architecture

- **Preact + preact-iso**: routing via `LocationProvider`/`Router`/`Route` in `src/App.tsx`. Entry is `src/index.tsx`, which `hydrate`s into `#app` and exports a `prerender` function.
- **Prerendering / SSR**: `vite.config.ts` enables `@preact/preset-vite` prerender (renderTarget `#app`). Code that touches `window`/`document`/`localStorage` MUST guard with `typeof window !== "undefined"` (see `theme.tsx`, `portal.tsx`) — it runs at build time during prerender.
- **Demo registration**: each component has a matching demo in `src/components/demo/<name>-demo.tsx`. Demos are registered in `src/routes/RoutesDemo.tsx` (the `RoutesDemoObj` map) and rendered alphabetically by `src/routes/Home.tsx`. When adding a component, also add its demo and register it there.

### Component conventions (`src/components/ui/`)

- Most have the same api of shadcn originals components
- Most have the same styles of shadcn originals components

Utils links:

- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/calendar.tsx
- https://ui.shadcn.com/docs/components

- Variants via `class-variance-authority` (`cva`) + `VariantProps`.
- `forwardRef` from `preact/compat`; props typed with `ComponentProps<"...">`.
- Class merging via `cn()` from `./share/cn` (clsx + tailwind-merge).
- `asChild` polymorphism via the `Slot` from `./share/slot` (ported from Radix).
- Set `data-slot`, `data-variant`, `data-size` attributes — Tailwind selectors in sibling components rely on these (e.g. `in-data-[slot=button-group]`).
- Export both the component and its `*Variants` object.

`src/components/ui/share/` holds the reusable primitives/hooks: `cn`, `slot`, `portal`, `modal`, `compose_ref`, `useControlledState`, `useLockBodyScroll`, `getScrollBarWidth`, `debounce`.

### Styling

- **Tailwind CSS v4** (config-less, via `@tailwindcss/postcss`) — global styles and theme tokens live in `src/index.css`. There is no `tailwind.config`.
- Dark mode is class-based (`.dark` on `<html>`), managed by `ThemeProvider`/`useTheme` in `theme.tsx`.

## Path aliases & React compat

Defined in both `vite.config.ts` and `tsconfig.app.json` — keep them in sync:

- `@/*` → `src/*`
- `@ui/*` → `src/components/ui/*`
- `react` / `react-dom` → `preact/compat` (so React-targeting libs like `react-day-picker`, `recharts`, `@floating-ui/react-dom` work). Import React APIs from `preact/compat`, not `react`.

## Conventions / tooling notes

- **Biome** lints+formats; **Prettier** also formats (with tailwind-class sorting + import organizing). Both enforce 2-space indent, double quotes, semicolons, 120 col, ES5 trailing commas.
- `noExplicitAny` is off; `useImportType` is enforced (use `import type`).
- TypeScript is strict with `noUncheckedIndexedAccess` and `noUnused*` on.
- The maintained release line is the **`v3` branch** (per README); `main` is ahead with newer component updates.
