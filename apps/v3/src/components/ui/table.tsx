import type { TdHTMLAttributes, ThHTMLAttributes } from "preact";
import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export type TableProps = HTMLAttributes<HTMLTableElement>;

const Table = forwardRef<HTMLTableElement, TableProps>(({ className, class: classNative, ...props }, forwardedRef) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={forwardedRef}
      className={cn("w-full caption-bottom text-sm", className, classNative)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <thead
      ref={forwardedRef}
      className={cn("[&_tr]:border-b", className, classNative)}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <tbody
      ref={forwardedRef}
      className={cn("[&_tr:last-child]:border-0", className, classNative)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <tfoot
      ref={forwardedRef}
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className, classNative)}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <tr
      ref={forwardedRef}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
        classNative
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <th
      ref={forwardedRef}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
        classNative
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <td
      ref={forwardedRef}
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
        classNative
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <caption
      ref={forwardedRef}
      className={cn("mt-4 text-muted-foreground text-sm", className, classNative)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
