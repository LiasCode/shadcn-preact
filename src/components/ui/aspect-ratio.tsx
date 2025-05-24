import { forwardRef, type HTMLAttributes } from "preact/compat";
import { cn } from "./share/cn";

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  ratio?: number;
};

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>((props, forwardedRef) => {
  const { ratio = 1 / 1, style, className, class: classNative, ...aspectRatioProps } = props;
  return (
    <div
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
        className={cn(className, classNative)}
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
AspectRatio.displayName = "AspectRatio";
