import { BreadcrumbBasic as Example1 } from "../examples/breadcrumb-basic";
import { BreadcrumbEllipsisDemo as Example2 } from "../examples/breadcrumb-ellipsis";
import { BreadcrumbLinkDemo as Example3 } from "../examples/breadcrumb-link";
import { BreadcrumbSeparatorDemo as Example4 } from "../examples/breadcrumb-separator";

export function BreadcrumbDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}