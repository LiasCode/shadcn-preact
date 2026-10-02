# Primitives

A Preact port of [Base UI](https://base-ui.com) 1.6.0, the headless library behind the Base UI base of shadcn/ui.
Each folder mirrors a `@base-ui/react/<name>` entry point, so components import `./primitives/<name>` where upstream
imports `@base-ui/react/<name>`. `internals/` holds the shared code that Base UI keeps in `internals`, `utils`, and
the `@base-ui/utils` package.

Base UI is released under the MIT license; see [LICENSE](./LICENSE).