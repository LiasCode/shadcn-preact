import type { Middleware, Padding, MiddlewareState } from "@floating-ui/react-dom";
/** Base UI's arrow fork measures against the positioner even when the arrow is inside a transformed popup. */
export function arrow(
  options: (state: MiddlewareState) => { element: Element; padding: Padding },
): Middleware {
  return {
    name: "arrow",
    async fn(state) {
      const { element, padding } = options(state);
      const axis = /^(top|bottom)/.test(state.placement) ? "x" : "y";
      const length = axis === "x" ? "width" : "height";
      const clientProperty = axis === "x" ? "clientWidth" : "clientHeight";
      const dimensions = await state.platform.getDimensions(element);
      const clientSize =
        (state.elements.floating as HTMLElement)[clientProperty] || state.rects.floating[length];
      const minProp = axis === "x" ? "left" : "top";
      const maxProp = axis === "x" ? "right" : "bottom";
      const largestPadding = clientSize / 2 - dimensions[length] / 2 - 1;
      const minPadding = Math.min(
        typeof padding === "number" ? padding : (padding[minProp] ?? 0),
        largestPadding,
      );
      const maxPadding = Math.min(
        typeof padding === "number" ? padding : (padding[maxProp] ?? 0),
        largestPadding,
      );
      const endDiff =
        state.rects.reference[length] +
        state.rects.reference[axis] -
        state[axis] -
        state.rects.floating[length];
      const startDiff = state[axis] - state.rects.reference[axis];
      const center = clientSize / 2 - dimensions[length] / 2 + endDiff / 2 - startDiff / 2;
      const max = clientSize - dimensions[length] - maxPadding;
      const position = Math.max(minPadding, Math.min(center, max));
      const addOffset =
        !state.middlewareData.arrow &&
        state.placement.includes("-") &&
        center !== position &&
        state.rects.reference[length] / 2 -
          (center < minPadding ? minPadding : maxPadding) -
          dimensions[length] / 2 <
          0;
      const adjustment = addOffset ? (center < minPadding ? center - minPadding : center - max) : 0;
      return {
        [axis]: state[axis] + adjustment,
        data: {
          [axis]: position,
          centerOffset: center - position - adjustment,
          ...(addOffset ? { alignmentOffset: adjustment } : {}),
        },
        reset: addOffset,
      };
    },
  };
}
