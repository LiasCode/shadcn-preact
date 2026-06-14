# TODO — Componentes faltantes

Port de shadcn/ui a Preact con mínimas dependencias externas. Comparativa contra el catálogo completo de shadcn/ui.

Implementados (26): alert, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, chart, empty, field, input, input-group, kbd, label, native-select, pagination, progress, separator, skeleton, spinner, table, tabs, textarea, toggle.

Faltan ~30 componentes. Ruta crítica: **Popover** primero (desbloquea ~10 overlays) y **Command** (desbloquea Combobox y la command palette).

## 🧱 Primitiva base primero (desbloquea casi todo lo demás)

- [ ] **Popover** — usa `@floating-ui/react-dom` (ya está en deps) + `portal.tsx`. Base de la mayoría de los overlays.

## 🎈 Overlays flotantes (dependen de Popover/floating-ui)

- [ ] **Tooltip**
- [ ] **Hover Card**
- [ ] **Dropdown Menu**
- [ ] **Context Menu**
- [ ] **Menubar**
- [ ] **Navigation Menu**
- [ ] **Select** (port sin Radix; ya existe `native-select` como alternativa)
- [ ] **Combobox** (composición: Popover + Command)

## 🪟 Diálogos / capas modales (dependen de `modal.tsx` + `useLockBodyScroll`)

- [ ] **Dialog**
- [ ] **Alert Dialog**
- [ ] **Sheet**
- [ ] **Drawer** (en shadcn usa `vaul`; tocaría portarlo o hacer versión propia)

## ☑️ Inputs de formulario

- [ ] **Checkbox**
- [ ] **Radio Group**
- [ ] **Switch**
- [ ] **Slider**
- [ ] **Toggle Group** (ya existe `toggle`)
- [ ] **Input OTP**

## 📐 Estructura / layout

- [ ] **Accordion**
- [ ] **Collapsible**
- [ ] **Scroll Area**
- [ ] **Resizable**
- [ ] **Carousel** (shadcn usa `embla-carousel`)
- [ ] **Sidebar** (compuesto grande: usa Sheet + Tooltip + Separator…)
- [ ] **Item**

## 🧩 Recetas / compuestos (al final, dependen de varios anteriores)

- [ ] **Command** (la palette; base del Combobox)
- [ ] **Date Picker** (composición: Popover + Calendar — ya existe Calendar)
- [ ] **Form** (en shadcn usa `react-hook-form` + `zod`; decidir enfoque para Preact)
- [ ] **Data Table** (receta sobre `table` + lógica de tabla)
- [ ] **Sonner** (sistema de toasts; reemplaza al viejo Toast)

## Notas

- Ya están en `share/`: `@floating-ui/react-dom`, `modal.tsx`, `portal.tsx`, `useLockBodyScroll` — infraestructura de overlays/modales lista.
- `chart.tsx` existe pero su demo está comentada en `RoutesDemo.tsx` (`// "chart": <ChartDemo />`).
