import { cloneElement, createElement, isValidElement, type Ref, type VNode } from "preact";

import { mergeClassNames, mergeProps, mergePropsN } from "../merge-props";
import { EMPTY_OBJECT } from "./empty";
import { getReactElementRef } from "./getReactElementRef";
import { getStateAttributesProps, type StateAttributesMapping } from "./getStateAttributesProps";
import { mergeObjects } from "./mergeObjects";
import { resolveClassName } from "./resolveClassName";
import { resolveStyle } from "./resolveStyle";
import type { ComponentRenderFn } from "./types";
import { useMergedRefs, useMergedRefsN } from "./useMergedRefs";

type AnyProps = Record<string, any>;

export interface UseRenderElementComponentProps<State> {
  className?: string | ((state: State) => string | undefined) | undefined;
  style?: AnyProps | ((state: State) => AnyProps | undefined) | undefined;
  render?: VNode<any> | ComponentRenderFn<any, State> | undefined;
}

export interface UseRenderElementParameters<State> {
  enabled?: boolean | undefined;
  state?: State | undefined;
  ref?: Ref<any> | Ref<any>[] | undefined;
  props?: AnyProps | AnyProps[] | undefined;
  stateAttributesMapping?: StateAttributesMapping<State> | undefined;
}

/**
 * Renders a Base UI element.
 *
 * @param element The default tag, replaced by the `render` prop when given.
 * @param componentProps The component's `render`, `className`, and `style` props.
 * @param params The state, ref, and props of the element.
 */
export function useRenderElement<State extends Record<string, any>>(
  element: string | undefined,
  componentProps: UseRenderElementComponentProps<State>,
  params: UseRenderElementParameters<State> = {},
): VNode<any> | null {
  const renderProp = componentProps.render;
  const outProps = useRenderElementProps(componentProps, params);

  if (params.enabled === false) {
    return null;
  }

  const state = params.state ?? (EMPTY_OBJECT as unknown as State);
  return evaluateRenderProp(element, renderProp, outProps, state);
}

function useRenderElementProps<State extends Record<string, any>>(
  componentProps: UseRenderElementComponentProps<State>,
  params: UseRenderElementParameters<State>,
): AnyProps {
  const { className: classNameProp, style: styleProp, render: renderProp } = componentProps;
  const {
    state = EMPTY_OBJECT as unknown as State,
    ref,
    props,
    stateAttributesMapping,
    enabled = true,
  } = params;

  const className = enabled ? resolveClassName(classNameProp, state) : undefined;
  const style = enabled ? resolveStyle(styleProp as never, state) : undefined;
  const stateProps = enabled
    ? getStateAttributesProps(state, stateAttributesMapping)
    : EMPTY_OBJECT;
  const resolvedProps = enabled && props ? resolveRenderFunctionProps(props) : undefined;

  // Always a fresh object when enabled, so the ref, className, and style can be set on it.
  const outProps: AnyProps = enabled
    ? (mergeObjects(stateProps, resolvedProps) ?? {})
    : EMPTY_OBJECT;

  // The same single hook runs on every branch. Refs are not used while prerendering.
  if (typeof document !== "undefined") {
    if (!enabled) {
      useMergedRefs(null, null);
    } else if (Array.isArray(ref)) {
      outProps.ref = useMergedRefsN([outProps.ref, getReactElementRef(renderProp), ...ref]);
    } else {
      outProps.ref = useMergedRefs(outProps.ref, getReactElementRef(renderProp), ref);
    }
  }

  if (!enabled) {
    return EMPTY_OBJECT;
  }

  if (className !== undefined) {
    outProps.className = mergeClassNames(outProps.className, className);
  }

  if (style !== undefined) {
    outProps.style = mergeObjects(outProps.style, style);
  }

  return outProps;
}

function resolveRenderFunctionProps(props: AnyProps | AnyProps[]): AnyProps {
  if (Array.isArray(props)) {
    return mergePropsN(props as never[]);
  }

  return mergeProps(undefined, props as never);
}

function evaluateRenderProp<State>(
  element: string | undefined,
  render: VNode<any> | ComponentRenderFn<any, State> | undefined,
  props: AnyProps,
  state: State,
): VNode<any> {
  if (render) {
    if (typeof render === "function") {
      return render(props, state);
    }

    if (!isValidElement(render)) {
      throw new Error(
        "Base UI: The `render` prop was provided an invalid element. It is cloned with props to replace the default element.",
      );
    }

    const mergedProps = mergeProps(
      props as never,
      (render as VNode<AnyProps>).props as never,
    ) as AnyProps;
    mergedProps.ref = props.ref;
    return cloneElement(render, mergedProps);
  }

  if (typeof element === "string") {
    return renderTag(element, props);
  }

  throw new Error("Base UI: Render element or function are not defined.");
}

function renderTag(tag: string, props: AnyProps): VNode<any> {
  if (tag === "button") {
    return createElement("button", { type: "button", ...props, key: props.key });
  }

  if (tag === "img") {
    return createElement("img", { alt: "", ...props, key: props.key });
  }

  return createElement(tag, props);
}
