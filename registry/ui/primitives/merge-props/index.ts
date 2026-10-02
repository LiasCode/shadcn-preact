import type { ComponentProps } from "preact";

import { mergeObjects } from "../internals/mergeObjects";
import type { BaseUIEvent, ElementType, WithBaseUIEvent } from "../internals/types";

type PropsOf<T extends ElementType> = WithBaseUIEvent<ComponentProps<T>>;
type InputProps<T extends ElementType> = PropsOf<T> | ((otherProps: PropsOf<T>) => PropsOf<T>) | undefined;
type AnyProps = Record<string, any>;
type Handler = (...args: unknown[]) => unknown;

const EMPTY_PROPS: AnyProps = {};

/**
 * Merges several sets of props. Like `Object.assign`, the rightmost value wins, except for:
 *
 * - event handlers, which are all called from right to left; the rightmost can call
 *   `event.preventBaseUIHandler()` to stop the ones before it;
 * - `className`, whose classes are concatenated from right to left;
 * - `style`, whose objects are merged with the rightmost winning.
 *
 * A set of props can also be a function that receives the props merged so far and returns new ones; it is then
 * responsible for chaining handlers. `ref` is not merged.
 */
export function mergeProps<T extends ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c?: InputProps<T>,
  d?: InputProps<T>,
  e?: InputProps<T>,
): PropsOf<T> {
  if (!c && !d && !e && !a) {
    return createInitialMergedProps(b) as PropsOf<T>;
  }

  let merged = createInitialMergedProps(a);
  if (b) merged = mergeInto(merged, b);
  if (c) merged = mergeInto(merged, c);
  if (d) merged = mergeInto(merged, d);
  if (e) merged = mergeInto(merged, e);
  return merged as PropsOf<T>;
}

/** Merges an array of props with the same rules as `mergeProps`. */
export function mergePropsN<T extends ElementType>(props: InputProps<T>[]): PropsOf<T> {
  if (props.length === 0) {
    return EMPTY_PROPS as PropsOf<T>;
  }
  if (props.length === 1) {
    return createInitialMergedProps(props[0]) as PropsOf<T>;
  }

  let merged = createInitialMergedProps(props[0]);
  for (let i = 1; i < props.length; i += 1) {
    merged = mergeInto(merged, props[i]);
  }
  return merged as PropsOf<T>;
}

function createInitialMergedProps(inputProps: unknown): AnyProps {
  if (isPropsGetter(inputProps)) {
    return { ...resolvePropsGetter(inputProps, EMPTY_PROPS) };
  }
  return copyInitialProps(inputProps as AnyProps | undefined);
}

function mergeInto(merged: AnyProps, inputProps: unknown): AnyProps {
  if (isPropsGetter(inputProps)) {
    return resolvePropsGetter(inputProps, merged);
  }
  return mutablyMergeInto(merged, inputProps as AnyProps | undefined);
}

function copyInitialProps(inputProps: AnyProps | undefined): AnyProps {
  const copiedProps: AnyProps = { ...inputProps };
  for (const propName in copiedProps) {
    const propValue = copiedProps[propName];
    if (isEventHandler(propName, propValue)) {
      copiedProps[propName] = wrapEventHandler(propValue);
    }
  }
  return copiedProps;
}

/** Merges `externalProps` into `mergedProps`; external values win. */
function mutablyMergeInto(mergedProps: AnyProps, externalProps: AnyProps | undefined): AnyProps {
  if (!externalProps) {
    return mergedProps;
  }

  for (const propName in externalProps) {
    const externalPropValue = externalProps[propName];
    switch (propName) {
      case "style":
        mergedProps[propName] = mergeObjects(mergedProps.style, externalPropValue);
        break;
      case "className":
        mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue);
        break;
      default:
        if (isEventHandler(propName, externalPropValue)) {
          mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
        } else {
          mergedProps[propName] = externalPropValue;
        }
    }
  }

  return mergedProps;
}

function isEventHandler(key: string, value: unknown): value is Handler | undefined {
  const code0 = key.charCodeAt(0);
  const code1 = key.charCodeAt(1);
  const code2 = key.charCodeAt(2);
  return (
    code0 === 111 /* o */ &&
    code1 === 110 /* n */ &&
    code2 >= 65 /* A */ &&
    code2 <= 90 /* Z */ &&
    (typeof value === "function" || typeof value === "undefined")
  );
}

function isPropsGetter(inputProps: unknown): inputProps is (props: AnyProps) => AnyProps {
  return typeof inputProps === "function";
}

function resolvePropsGetter(inputProps: unknown, previousProps: AnyProps): AnyProps {
  if (isPropsGetter(inputProps)) {
    return inputProps(previousProps);
  }
  return (inputProps as AnyProps | undefined) ?? EMPTY_PROPS;
}

function mergeEventHandlers(ourHandler: Handler | undefined, theirHandler: Handler | undefined) {
  if (!theirHandler) {
    return ourHandler;
  }
  if (!ourHandler) {
    return wrapEventHandler(theirHandler);
  }

  return (...args: unknown[]) => {
    const event = args[0];
    if (isPreventableEvent(event)) {
      makeEventPreventable(event);
      const result = theirHandler(...args);
      if (!event.baseUIHandlerPrevented) {
        ourHandler(...args);
      }
      return result;
    }

    const result = theirHandler(...args);
    ourHandler(...args);
    return result;
  };
}

function wrapEventHandler(handler: Handler | undefined) {
  if (!handler) {
    return handler;
  }
  return (...args: unknown[]) => {
    const event = args[0];
    if (isPreventableEvent(event)) {
      makeEventPreventable(event);
    }
    return handler(...args);
  };
}

export function makeEventPreventable<T extends Event>(event: T): BaseUIEvent<T> {
  const baseUIEvent = event as BaseUIEvent<T> & { baseUIHandlerPrevented?: boolean };
  baseUIEvent.preventBaseUIHandler = () => {
    baseUIEvent.baseUIHandlerPrevented = true;
  };
  return baseUIEvent;
}

export function mergeClassNames(ourClassName: string | undefined, theirClassName: string | undefined) {
  if (theirClassName) {
    if (ourClassName) {
      return theirClassName + " " + ourClassName;
    }
    return theirClassName;
  }
  return ourClassName;
}

/**
 * Base UI only makes React's synthetic events preventable. Preact passes native DOM events to handlers, so those
 * count too; values passed to custom callbacks (for example `onValueChange`) do not.
 */
function isPreventableEvent(event: unknown): event is BaseUIEvent<Event> {
  return (
    event != null &&
    typeof event === "object" &&
    ("nativeEvent" in event || (typeof Event !== "undefined" && event instanceof Event))
  );
}