# Primitives

A Preact port of [Base UI](https://base-ui.com) 1.6.0, the headless library behind the Base UI base of shadcn/ui.
Each folder mirrors a `@base-ui/react/<name>` entry point, so components import `./primitives/<name>` where upstream
imports `@base-ui/react/<name>`. `internals/` holds the shared code that Base UI keeps in `internals`, `utils`, and
the `@base-ui/utils` package.

Base UI is released under the MIT license; see [LICENSE](./LICENSE).

Ported entry points: `merge-props`, `use-render`, `direction-provider`, `button`, `separator`, `input`, `avatar`,
`progress`, `toggle`, `toggle-group`, `checkbox`, `switch`, `radio`, `radio-group`, `collapsible`, `accordion`, `tabs`,
and `slider`. Composite list registration and linear roving focus live in `internals/composite/`.

The exposed parts are those needed by the rebuilt shadcn components. Input and form controls currently use the
standalone Field context; Base UI Field/Form validation, CheckboxGroup, grid/Toolbar integration, and unused parts
such as Tabs.Indicator and Slider.Label/Value remain deferred (ADRs 0012 and 0013).