import type {
  ComponentProps as PreactComponentProps,
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  JSX,
  Ref,
  VNode,
} from "preact";

/** Props accepted by the element returned from a `render` function. */
export type HTMLProps<T extends EventTarget = any> = HTMLAttributes<T> & {
  ref?: Ref<T> | undefined;
};

export type ComponentRenderFn<Props, State> = (props: Props, state: State) => VNode<any>;

/**
 * An event passed to a handler merged by `mergeProps`. Calling `preventBaseUIHandler()` stops the handlers merged
 * before it (the component's own) from running.
 */
export type BaseUIEvent<E extends Event> = E & {
  preventBaseUIHandler: () => void;
  readonly baseUIHandlerPrevented?: boolean | undefined;
};

type WithPreventBaseUIHandler<T> = T extends (event: infer E) => any
  ? E extends Event
    ? (event: BaseUIEvent<E>) => ReturnType<T>
    : T
  : T;

/** Adds `preventBaseUIHandler` to the event of every handler. */
export type WithBaseUIEvent<T> = { [K in keyof T]: WithPreventBaseUIHandler<T[K]> };

type Unsignal<T> = T extends { value: infer V; peek(): unknown } ? V : T;
type UnionKeys<T> = T extends unknown ? keyof T : never;
type UnionValue<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? T[K] : never) : never;
type BivariantCallback<T> = T extends (instance: infer V) => infer R
  ? { bivarianceHack(instance: V): R }["bivarianceHack"]
  : T;
type NativeProps<P> = {
  [K in UnionKeys<P>]?: K extends "ref"
    ? BivariantCallback<UnionValue<P, K>>
    : K extends "style"
      ? CSSProperties
      : Unsignal<UnionValue<P, K>>;
};
/** React-compatible native props; custom component props retain their required fields. */
export type ComponentProps<T extends ElementType> = T extends keyof JSX.IntrinsicElements
  ? NativeProps<PreactComponentProps<T>>
  : PreactComponentProps<T>;
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type ElementRef<T> =
  | { bivarianceHack(instance: T | null): void | (() => void) }["bivarianceHack"]
  | { current: T | null }
  | null;

export type ElementType = keyof JSX.IntrinsicElements | ComponentType<any>;

/**
 * Props shared by all Base UI components: `className` and `style` may be functions of the component's state, and
 * `render` replaces or composes the rendered element.
 */
export type BaseUIComponentProps<T extends ElementType, State, RenderFunctionProps = HTMLProps> = DistributiveOmit<
  WithBaseUIEvent<ComponentProps<T>>,
  "className" | "class" | "color" | "defaultValue" | "defaultChecked" | "style"
> & {
  /** CSS class applied to the element, or a function that returns a class based on the component's state. */
  className?: string | ((state: State) => string | undefined) | undefined;
  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts an element or a function that returns the element to render.
   */
  render?: VNode<any> | ComponentRenderFn<RenderFunctionProps, State> | undefined;
  /** Style applied to the element, or a function that returns a style object based on the component's state. */
  style?: CSSProperties | ((state: State) => CSSProperties | undefined) | undefined;
};

export interface NativeButtonProps {
  /**
   * Whether the component renders a native `<button>` element when replacing it via the `render` prop.
   * Set to `false` if the rendered element is not a button (for example, `<div>`).
   * @default true
   */
  nativeButton?: boolean | undefined;
}

export interface NonNativeButtonProps {
  /**
   * Whether the component renders a native `<button>` element when replacing it via the `render` prop.
   * Set to `true` if the rendered element is a native button.
   * @default false
   */
  nativeButton?: boolean | undefined;
}

export type Orientation = "horizontal" | "vertical";