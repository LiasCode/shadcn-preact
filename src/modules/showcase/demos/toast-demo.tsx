import { ToastDemo as Example0 } from "../examples/toast-demo";
import { ToastPromise as Example1 } from "../examples/toast-promise";
import { ToastTypes as Example2 } from "../examples/toast-types";

export function ToastDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example0 />
      <Example1 />
      <Example2 />
    </div>
  );
}
