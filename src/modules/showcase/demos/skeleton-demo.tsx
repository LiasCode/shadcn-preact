import { SkeletonAvatar as Example1 } from "../examples/skeleton-avatar";
import { SkeletonCard as Example2 } from "../examples/skeleton-card";
import { SkeletonDemo as Example3 } from "../examples/skeleton-demo";
import { SkeletonForm as Example4 } from "../examples/skeleton-form";
import { SkeletonTable as Example5 } from "../examples/skeleton-table";
import { SkeletonText as Example6 } from "../examples/skeleton-text";

export function SkeletonDemo() {
  return (
    <div className="flex min-w-0 w-full flex-col items-start gap-8 overflow-x-auto">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}
