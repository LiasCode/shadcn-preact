import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

const DEFAULT_ORIENTATION = "horizontal";

const ORIENTATIONS = ["horizontal", "vertical"] as const;

type Orientation = (typeof ORIENTATIONS)[number];

export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
};

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;

    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;

    // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
    const ariaOrientation = orientation === "vertical" ? orientation : undefined;

    const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, "role": "separator" };

    return (
      // @ts-expect-error
      <div
        data-orientation={orientation}
        {...semanticProps}
        {...domProps}
        ref={forwardedRef}
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
          className,
          classNative
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation);
}
