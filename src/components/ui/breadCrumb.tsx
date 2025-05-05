import { ChevronRight, MoreHorizontal } from "lucide-preact";
import type { ComponentProps } from "preact";
import {
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from "preact/compat";
import { cn } from "./share/cn";

export type BreadcrumbProps = ComponentPropsWithoutRef<"nav"> & {
  separator?: ReactNode;
};

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    {...props}
  />
));
Breadcrumb.displayName = "Breadcrumb";

export type BreadcrumbListProps = ComponentPropsWithoutRef<"ol">;

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5",
        className,
        classNative
      )}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

export type BreadcrumbItemProps = ComponentPropsWithoutRef<"li">;

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1.5", className, classNative)}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export type BreadcrumbLinkProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  href?: AnchorHTMLAttributes["href"];
};

export const BreadcrumbLink = forwardRef<HTMLDivElement, BreadcrumbLinkProps>(
  ({ asChild, children, className, class: classNative, ...props }, ref) => {
    if (asChild) {
      return (
        <div
          ref={ref}
          className={cn("transition-colors hover:text-foreground", className, classNative)}
          {...props}
        >
          {children}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn("transition-colors *:h-full *:w-full hover:text-foreground", className, classNative)}
        {...props}
      >
        <a href={props.href}>{children}</a>
      </div>
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export type BreadcrumbPageProps = ComponentPropsWithoutRef<"span">;

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, class: classNative, ...props }, ref) => (
    // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className, classNative)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

export type BreadcrumbSeparatorProps = ComponentProps<"li">;

export const BreadcrumbSeparator = ({
  children,
  className,
  class: classNative,
  ...props
}: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className, classNative)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisProps = ComponentProps<"span">;

export const BreadcrumbEllipsis = ({ className, class: classNative, ...props }: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className, classNative)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
