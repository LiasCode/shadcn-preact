# TODO — Componentes faltantes

Port de shadcn/ui a Preact con mínimas dependencias externas. Comparativa contra el catálogo completo de shadcn/ui.

Implementados (39): alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, chart, combobox, context-menu, dialog, drawer, dropdown-menu, empty, field, hover-card, input, input-group, kbd, label, menubar, native-select, navigation-menu, pagination, popover, progress, select, separator, sheet, skeleton, spinner, table, tabs, textarea, toggle, tooltip.

Faltan ~17 componentes. Ruta crítica: **Command** (desbloquea la command palette).

## 🧱 Primitiva base primero (desbloquea casi todo lo demás)

- [x] **Popover** — `@floating-ui/react-dom` + `portal.tsx` + `useFocusTrap`. Base de la mayoría de los overlays.

## 🎈 Overlays flotantes (dependen de Popover/floating-ui)

- [x] **Tooltip**
- [x] **Hover Card**
- [x] **Dropdown Menu**
- [x] **Context Menu**
- [x] **Menubar**
- [x] **Navigation Menu**
- [x] **Select** (port sin Radix; ya existe `native-select` como alternativa)
- [x] **Combobox** (composición: Popover + Command)

## 🪟 Diálogos / capas modales (dependen de `modal.tsx` + `useLo1ckBodyScroll`)

- [x] **Dialog**
- [x] **Alert Dialog**
- [x] **Sheet**
- [x] **Drawer** (en shadcn usa `vaul`; tocaría portarlo o hacer versión propia)

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

- Ya están en `share/`: `@floating-ui/react-dom`, `modal.tsx`, `portal.tsx`, `useLockBodyScroll`, `useFocusTrap` — infraestructura de overlays/modales lista.
- `chart.tsx` existe pero su demo está comentada en `RoutesDemo.tsx` (`// "chart": <ChartDemo />`).