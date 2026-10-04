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

Combobox and Toast use local Preact primitives and add no runtime dependency.

## Documentation

See every component on the [showcase](https://shadcn-preact.onrender.com/components).

The components live in [`registry/ui`](./registry/ui). Copy them into your project with:

```sh
bunx degit https://github.com/LiasCode/shadcn-preact/registry/ui#main ./src/components/ui
```

> The components moved from `src/components/ui` to `registry/ui`. Update your `degit` source if you used the old path.

The [catalog performance report](./docs/performance/2026-10-04-components.md) covers all showcase components.
Run `bun run performance` for the server-render benchmark; the report also documents optional browser profiling.

## v3

The version 3 code is on [branch](https://github.com/LiasCode/shadcn-preact/tree/v3) and is maintained there.

## License

Licensed under the [MIT license](./LICENSE.md).

## Star History

[![Star History Chart](https://api.star-history.com/chart?repos=liascode/shadcn-preact&type=date&legend=top-left)](https://www.star-history.com/?repos=liascode%2Fshadcn-preact&type=date&legend=top-left)