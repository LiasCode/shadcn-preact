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

See every component on the [showcase](https://shadcn-preact.onrender.com/components).

The components live in [`registry/ui`](./registry/ui). Copy them into your project with:

```sh
bunx degit https://github.com/LiasCode/shadcn-preact/registry/ui#main ./src/components/ui
```

> The components moved from `src/components/ui` to `registry/ui`. Update your `degit` source if you used the old path.

The [catalog performance report](./docs/performance/2026-10-04-components.md) records the 55-component baseline before phase 8.
Run `bun run performance` for the server-render benchmark; the report also documents optional browser profiling.

All 62 upstream components are ported, with 61 showcase sections and 57 additional examples from
[phase 8](./docs/decisions/0021-conversation-and-questionnaire-components.md). To run its browser regression checks,
build the site, start `bun run preview`, and run `node scripts/phase8-browser.mjs`. Playwright is an optional
external tool: set `PERFORMANCE_PLAYWRIGHT_MODULE` to its installed module path and `PERFORMANCE_URL` if the
preview uses another port.

`bun run parity` checks upstream exports, runtime literal counts, declared props/defaults, and JSX/render structure,
plus CSS and theme tokens. `bun run parity:test` runs its mutation regression checks. Both require the upstream
checkout described in [ADR 0009](./docs/decisions/0009-upstream-reference-and-parity-tooling.md). Static wrapper
parity does not certify full primitive behavior or visual equivalence; see
[ADR 0022](./docs/decisions/0022-structural-wrapper-parity.md).

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
change that must pass the parity checks; see [ADR 0023](./docs/decisions/0023-pinned-upstream-submodule.md).

## v3

The version 3 code is on [branch](https://github.com/LiasCode/shadcn-preact/tree/v3) and is maintained there.

## License

Licensed under the [MIT license](./LICENSE.md).

## Star History

[![Star History Chart](https://api.star-history.com/chart?repos=liascode/shadcn-preact&type=date&legend=top-left)](https://www.star-history.com/?repos=liascode%2Fshadcn-preact&type=date&legend=top-left)