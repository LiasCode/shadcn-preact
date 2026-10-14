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

## Quick start

[Bun](https://bun.sh) is required. In an empty directory or a Vite project:

```sh
bunx --bun github:LiasCode/shadcn-preact#main init
bunx --bun github:LiasCode/shadcn-preact#main add button dialog
```

Starting from the Vite `preact-ts` template? Clean its starter styles and add the font first; the
[installation guide](https://shadcn-preact.onrender.com/docs/installation) walks through every step.

## Learn more

- [Documentation site](https://shadcn-preact.onrender.com/docs): introduction, installation guide and a
  [catalog](https://shadcn-preact.onrender.com/docs/components) with a page, demos and CLI command per component.
- [DOCUMENTATION.md](./DOCUMENTATION.md): requirements, every CLI option, manual installation, and how to develop
  and verify this repository.
- [v3](https://github.com/LiasCode/shadcn-preact/tree/v3): the previous version, maintained on its own branch.

## License

Licensed under the [MIT license](./LICENSE.md).

## Star History

[![Star History Chart](https://api.star-history.com/chart?repos=liascode/shadcn-preact&type=date&legend=top-left)](https://www.star-history.com/?repos=liascode%2Fshadcn-preact&type=date&legend=top-left)
