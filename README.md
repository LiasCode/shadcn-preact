# shadcn/ui-`preact`

An unofficial, `Preact` port of `shadcn/ui`.

This is **NOT** a component library. It’s a collection of re-usable components that you
can copy and paste into your apps.

**What do you mean by not a component library?**

I mean you do not install it as a dependency. It is not available or distributed via npm. I have no
plans to publish it as an npm package (for now).

Pick the components you need. Copy and paste the code into your project and customize to your needs.
The code is yours.

_Use this as a reference to build your own component libraries._

**Why if Preact is compatible with React?**

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

## Documentation

Start with the [introduction](https://shadcn-preact.onrender.com/docs) and
[installation guide](https://shadcn-preact.onrender.com/docs/installation), then browse the
[component catalog](https://shadcn-preact.onrender.com/docs/components). Every catalog component has an
independent page with usage, demos, exact dependencies, and a CLI command. Manual copying and degit remain optional.

The [legacy showcase](https://shadcn-preact.onrender.com/components) remains available.

## Install components with the CLI

Use an existing Preact 11 project with Tailwind CSS v4 and Preact compatibility aliases. Run the CLI
from GitHub without publishing or installing a component library from npm:

```sh
bunx --bun github:LiasCode/shadcn-preact#main init
bunx --bun github:LiasCode/shadcn-preact#main add button dialog
```

`init` records component/global CSS paths in `shadcn-preact.json`, merges a stylesheet import without
removing your CSS, installs shared dependencies, and adds the nova theme and vendored styles. Keep your
framework's Preact compatibility aliases and Tailwind integration configured. `add` copies the selected
components and all relative imports, preserves both MIT licenses, and installs exact package versions.

```sh
bunx --bun github:LiasCode/shadcn-preact#main list
bunx --bun github:LiasCode/shadcn-preact#main add calendar --dry-run
bunx --bun github:LiasCode/shadcn-preact#main init --path src/ui --css src/app.css
```

Existing modified files are protected. Use `--overwrite` to replace them after reviewing the changes,
`--no-install` to copy source without running `bun add`, `--all` for the full catalog including Theme,
and `--cwd` to target a project in a monorepo. The CLI uses Bun and built-in modules; it needs no upstream submodule.

For local development, run `bun run cli init --cwd /path/to/app`, then
`bun run cli add button --cwd /path/to/app`. Regenerate the checked-in dependency metadata with
`bun run registry:build`; `bun run registry:check` detects stale selections and theme tokens.

Manual installation and component-specific degit selections remain in the
[installation guide](https://shadcn-preact.onrender.com/docs/installation).
The source lives in [`registry/ui`](./registry/ui); it remains yours to customize.

Run `bun run performance` for the server-render benchmark of the component showcase.

All 62 upstream components are ported, with 61 showcase sections and 57 additional conversation and
questionnaire examples. To run their browser regression checks,
build the site, start `bun run preview`, and run `node scripts/phase8-browser.mjs`. Playwright is an optional
external tool: set `PERFORMANCE_PLAYWRIGHT_MODULE` to its installed module path and `PERFORMANCE_URL` if the
preview uses another port.

`bun run parity` checks upstream exports, runtime literal counts, declared props/defaults, and JSX/render structure,
plus CSS and theme tokens. `bun run parity:test` runs its mutation regression checks. Both require the upstream
submodule described below. Static wrapper parity does not certify full primitive behavior or visual equivalence.
Architecture, porting conventions, and verification limits are recorded in [AGENTS.md](./AGENTS.md).

## Development

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

## Browser comparison with upstream

The comparison tool mounts the port with Preact and the pinned upstream wrappers with real React/Base UI
in independent browser pages. Everything uses the repository's submodule and development dependencies.

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

## v3

The version 3 code is on [branch](https://github.com/LiasCode/shadcn-preact/tree/v3) and is maintained there.

## License

Licensed under the [MIT license](./LICENSE.md).

## Star History

[![Star History Chart](https://api.star-history.com/chart?repos=liascode/shadcn-preact&type=date&legend=top-left)](https://www.star-history.com/?repos=liascode%2Fshadcn-preact&type=date&legend=top-left)