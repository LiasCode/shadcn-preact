import type { ComponentProps, HTMLAttributes, JSX, Ref, VNode } from "preact";

import type { StateAttributesMapping } from "../internals/getStateAttributesProps";
import type { ComponentRenderFn, ElementType, HTMLProps } from "../internals/types";
import { useRenderElement } from "../internals/useRenderElement";

export type { ComponentRenderFn, HTMLProps } from "../internals/types";

export type UseRenderRenderProp<State = Record<string, unknown>> =
  | VNode<any>
  | ComponentRenderFn<HTMLAttributes<any>, State>;

export type UseRenderElementProps<T extends ElementType> = ComponentProps<T>;

export type UseRenderComponentProps<
  T extends ElementType,
  State = {},
  RenderFunctionProps = HTMLProps,
> = ComponentProps<T> & {
  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts an element or a function that returns the element to render.
   */
  render?: VNode<any> | ComponentRenderFn<RenderFunctionProps, State> | undefined;
};

export interface UseRenderParameters<State, RenderedElementType extends Element, Enabled extends boolean | undefined> {
  /** The element, or a function that returns one, to override the default element. */
  render?: UseRenderRenderProp<State> | undefined;
  /** The ref to apply to the rendered element. */
  ref?: Ref<RenderedElementType> | Ref<RenderedElementType>[] | undefined;
  /** The state of the component, passed to the `render` callback and converted to `data-*` attributes. */
  state?: State | undefined;
  /** Custom mapping from state properties to `data-*` attributes. */
  stateAttributesMapping?: StateAttributesMapping<State> | undefined;
  /**
   * Props spread on the rendered element. Event handlers are merged, `className` and `style` are joined, and other
   * external props overwrite the internal ones.
   */
  props?: Record<string, unknown> | undefined;
  /** If `false`, the hook skips its logic and returns `null`. @default true */
  enabled?: Enabled | undefined;
  /** The tag rendered when `render` is not given. @default 'div' */
  defaultTagName?: keyof JSX.IntrinsicElements | undefined;
}

export type UseRenderReturnValue<Enabled extends boolean | undefined> = Enabled extends false ? null : VNode<any>;

export interface UseRenderState {}

/** Renders an element that supports the `render` prop, state `data-*` attributes, and merged props. */
export function useRender<
  State extends Record<string, unknown>,
  RenderedElementType extends Element,
  Enabled extends boolean | undefined = undefined,
>(params: useRender.Parameters<State, RenderedElementType, Enabled>): useRender.ReturnValue<Enabled> {
  return useRenderElement<State>(
    params.defaultTagName ?? "div",
    params as never,
    params as never,
  ) as useRender.ReturnValue<Enabled>;
}

export declare namespace useRender {
  type State = UseRenderState;
  type RenderProp<TState = Record<string, unknown>> = UseRenderRenderProp<TState>;
  type ElementProps<T extends ElementType> = UseRenderElementProps<T>;
  type ComponentProps<T extends ElementType, TState = {}, RenderFunctionProps = HTMLProps> = UseRenderComponentProps<
    T,
    TState,
    RenderFunctionProps
  >;
  type Parameters<
    TState,
    RenderedElementType extends Element,
    Enabled extends boolean | undefined,
  > = UseRenderParameters<TState, RenderedElementType, Enabled>;
  type ReturnValue<Enabled extends boolean | undefined> = UseRenderReturnValue<Enabled>;
}