import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-preact";
import type { ComponentProps } from "preact";
import { forwardRef } from "preact/compat";
import { type ButtonProps, buttonVariants } from "./button";
import { cn } from "./share/cn";

const Pagination = ({ className, class: classNative, ...props }: ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className, classNative)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={cn("flex flex-row items-center gap-1", className, classNative)}
      {...props}
    />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <li
      ref={forwardedRef}
      className={cn("", className, classNative)}
      {...props}
    />
  )
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  ComponentProps<"a">;

const PaginationLink = ({ className, class: classNative, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "cursor-pointer",
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
      classNative
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, class: classNative, ...props }: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className, classNative)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, class: classNative, ...props }: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className, classNative)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, class: classNative, ...props }: ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className, classNative)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
