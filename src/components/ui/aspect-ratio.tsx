import { type ComponentProps, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

type AspectRatioProps = ComponentProps<"div"> & {
  ratio?: number;
};

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>((props, forwardedRef) => {
  const { ratio = 1 / 1, style, className, ...aspectRatioProps } = props;
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        // ensures inner element is contained
        position: "relative",
        // ensures padding bottom trick maths works
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
      }}
    >
      <div
        {...aspectRatioProps}
        ref={forwardedRef}
        className={cn(className)}
        style={Object.assign({}, style, {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        })}
      />
    </div>
  );
});

export { AspectRatio, type AspectRatioProps };
