# Documentation

Everything about using and developing shadcn/ui-`preact` that does not belong on the front page.
The site has the same material with live demos: [introduction](https://shadcn-preact.onrender.com/docs),
[installation guide](https://shadcn-preact.onrender.com/docs/installation) and
[component catalog](https://shadcn-preact.onrender.com/docs/components). Every catalog component has its own page
with usage, demos, exact dependencies and a CLI command. The
[legacy showcase](https://shadcn-preact.onrender.com/components) remains available.

- [Using the components](#using-the-components)
  - [Requirements](#requirements)
  - [Install with the CLI](#install-with-the-cli)
  - [Manual installation](#manual-installation)
- [Developing this repository](#developing-this-repository)
  - [Setup](#setup)
  - [Checks](#checks)
  - [Browser comparison with upstream](#browser-comparison-with-upstream)

## Using the components

### Requirements

The `main` branch follows shadcn/ui's Base UI base and nova style. Its headless primitives are ported to Preact,
while composed components keep upstream libraries where they work through `preact/compat`.

Use Preact 11 and alias `react` and `react-dom` to `preact/compat`, plus `react/jsx-runtime` and
`react/jsx-dev-runtime` to `preact/jsx-runtime`. Vite's Preact preset configures these runtime aliases.
The shared styling dependencies are `class-variance-authority`, `cn`, `lucide-preact`, `tw-animate-css`, and
`shadcn/tailwind.css`; floating components also use `@floating-ui/react-dom`.

| Component | Additional dependency                                        |
| --------- | ------------------------------------------------------------ |
| Calendar  | `react-day-picker`, `date-fns` for date examples             |
| Chart     | `recharts`                                                   |
| Command   | `cmdk`                                                       |
| Carousel  | `embla-carousel-react`, optionally `embla-carousel-autoplay` |
| Input OTP | `input-otp`                                                  |
| Resizable | `react-resizable-panels` 4.x                                 |
| Sonner    | `sonner`                                                     |

Combobox, Toast, Message Scroller, and Questionnaire use local Preact primitives and add no runtime dependency.

### Install with the CLI

Run the CLI from GitHub in an existing Vite project or an empty directory. Bun is required. From a new
Vite project (`bun create vite my-app --template preact-ts`), clean the starter styles first: its
`src/index.css` redeclares `--border` and `--accent`, and its `#app`/`h1` rules override the theme.
Replace `src/index.css` with `@import "tailwindcss";`, delete `src/app.css` and `src/assets`, replace
`src/app.tsx` with a component that imports neither, then:

```sh
bunx --bun github:LiasCode/shadcn-preact#main init
bun add --exact @fontsource-variable/geist
bunx --bun github:LiasCode/shadcn-preact#main add button dialog
```

The theme names Geist Variable but never loads it. Add `@import "@fontsource-variable/geist";` to your
global stylesheet between `@import "tailwindcss";` and `@import "./shadcn-preact.css";`. `init` warns when
your stylesheet redeclares theme custom properties. The
[installation guide](https://shadcn-preact.onrender.com/docs/installation) covers every step, dark mode,
existing projects, and troubleshooting.

`init` configures TypeScript JSX and compatibility paths, Vite aliases, the Preact preset, Tailwind v4,
and automatic global style loading. It installs exact runtime/tooling versions and adds the nova theme,
styles, and `shadcn-preact.json`. Existing Vite settings are preserved in an imported backup; TypeScript
comments and unrelated settings are retained. An empty directory also gets a minimal app and dev/build
scripts. Run `bun run dev` immediately after initialization.

`add` copies the selected components and all relative imports, preserves both MIT licenses, and installs
exact package versions.

```sh
bunx --bun github:LiasCode/shadcn-preact#main list
bunx --bun github:LiasCode/shadcn-preact#main add calendar --dry-run
bunx --bun github:LiasCode/shadcn-preact#main init --path src/ui --css src/app.css
```

Existing modified files are protected. Use `--overwrite` to replace them after reviewing the changes,
`--no-install` to copy source without running `bun add`, `--all` for the full catalog including Theme,
and `--cwd` to target a project in a monorepo. The CLI uses Bun and built-in modules; it needs no upstream submodule.

For local development of the CLI, run `bun run cli init --cwd /path/to/app`, then
`bun run cli add button --cwd /path/to/app`. Regenerate the checked-in dependency metadata with
`bun run registry:build`; `bun run registry:check` detects stale selections and theme tokens.

### Manual installation

Manual installation and component-specific degit selections remain in the
[installation guide](https://shadcn-preact.onrender.com/docs/installation).
The source lives in [`registry/ui`](./registry/ui); it remains yours to customize.

## Developing this repository

All 62 upstream components are ported, with 62 showcase sections and 57 additional conversation and
questionnaire examples. Architecture, porting conventions, and verification limits are recorded in
[AGENTS.md](./AGENTS.md).

### Setup

Clone the project together with its pinned upstream reference:

```sh
git clone --recurse-submodules https://github.com/LiasCode/shadcn-preact.git
cd shadcn-preact
bun install --frozen-lockfile
bun run check
```

For an existing clone, run `bun run upstream:setup` first. Git requires `--recurse-submodules` or this setup
command; a plain clone does not fetch submodule contents automatically. After switching branches or pulling a
change to the recorded upstream revision, run `bun run upstream:setup` again.

The shadcn reference lives in `upstream/shadcn`, pinned by the parent repository. Reference/parity commands use
the root development dependencies; installing the upstream monorepo is unnecessary. `bun run reference` generates
its output in the ignored `.cache/shadcn-reference/base-nova` directory. Updating the upstream pin is an explicit
change that must pass the parity checks.

### Checks

`bun run check` runs formatting, CLI registry consistency, tests, the parity regressions and parity, lint, and the
production build.

`bun run parity` checks upstream exports, runtime literal counts, declared props/defaults, and JSX/render structure,
plus CSS and theme tokens. `bun run parity:test` runs its mutation regression checks. Both require the upstream
submodule. Static wrapper parity does not certify full primitive behavior or visual equivalence.

`bun run install:flow` replays the installation guide on a fresh Vite `preact-ts` project with the local CLI. It
needs network access, so it is not part of `check`.

Run `bun run performance` for the server-render benchmark of the component showcase. To run the browser regression
checks of the showcase, build the site, start `bun run preview`, and run `node scripts/phase8-browser.mjs`.
Playwright is an optional external tool: set `PERFORMANCE_PLAYWRIGHT_MODULE` to its installed module path and
`PERFORMANCE_URL` if the preview uses another port.

### Browser comparison with upstream

The comparison tool mounts the port with Preact and the pinned upstream wrappers with real React/Base UI
in independent browser pages. Everything uses the repository's submodule and development dependencies.
The React side runs the `@base-ui/react` development dependency, which is updated independently and can be
newer than the Base UI 1.6.0 the primitives were ported from, so a behavior change in a newer release shows up here
as a failing state. pixelmatch compares colors in OKLab (v8) and the bar is zero differing pixels.

```sh
bunx playwright install chromium
bun run parity:browser
bun run parity:browser:test
```

On Linux CI hosts that need browser system packages, use `bunx playwright install --with-deps chromium`.
The suite covers Button, Input, Checkbox, Tabs, Accordion, Dialog, Select, Field/Form, Switch, RadioGroup,
Toggle, ToggleGroup, Popover and AlertDialog. Light/dark, desktop/mobile and LTR/RTL configurations
produce 328 state comparisons. It checks expected interactions on both runtimes and
compares screenshots against the live reference. Mutation checks verify that visual and behavioral changes fail.

Screenshots, differences, geometry and the revision/browser report are written to
`.cache/browser-parity/results`. To inspect one fixture, use `BROWSER_PARITY_CASE=select bun run parity:browser`.
Use a comma-separated case list to select several fixtures and `BROWSER_PARITY_DIRECTION=rtl` to select one direction.
This is a separate check requiring Chromium; `bun run check` remains usable without browser binaries.
Animations, fonts, additional engines and the remaining catalog need further coverage.
The current scope and remaining limitations are recorded in [AGENTS.md](./AGENTS.md).
