import type { HTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";

type ProgressState = "indeterminate" | "complete" | "loading";

const DEFAULT_MAX = 100;

type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
};

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({ children, className, ...props }, forwardedRef) => {
  const { value: valueProp = null, max: maxProp, getValueLabel = defaultGetValueLabel, ...progressProps } = props;

  if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
    console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
  }

  const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;

  if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
    console.error(getInvalidValueError(`${valueProp}`, "Progress"));
  }

  const value = isValidValueNumber(valueProp, max) ? valueProp : null;
  const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

  return (
    <div
      ref={forwardedRef}
      data-slot="progress"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={isNumber(value) ? value : undefined}
      aria-valuetext={valueLabel}
      role="progressbar"
      data-state={getProgressState(value, max)}
      data-value={value ?? undefined}
      data-max={max}
      {...progressProps}
    >
      <div
        ref={forwardedRef}
        data-state={getProgressState(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {children}
    </div>
  );
});

/* ---------------------------------------------------------------------------------------------- */

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function getProgressState(value: number | undefined | null, maxValue: number): ProgressState {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}

function isNumber(value: any): value is number {
  return typeof value === "number";
}

function isValidMaxNumber(max: any): max is number {
  return isNumber(max) && !Number.isNaN(max) && max > 0;
}

function isValidValueNumber(value: any, max: number): value is number {
  return isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0;
}

// Split this out for clearer readability of the error message.
function getInvalidMaxError(propValue: string, componentName: string) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}

function getInvalidValueError(propValue: string, componentName: string) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}

export { Progress };
