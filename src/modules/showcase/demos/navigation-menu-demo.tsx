import Example1 from "../examples/navigation-menu-demo";

export function NavigationMenuDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <div className="w-full min-w-0 overflow-x-auto">
        <Example1 />
      </div>
    </div>
  );
}