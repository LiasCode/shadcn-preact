import { ChartDemo as Example0 } from "../examples/chart-demo";
import { ChartExample as Example5 } from "../examples/chart-example";
import { ChartBarDemoAxis as Example1 } from "../examples/chart-example-axis";
import { ChartBarDemoGrid as Example2 } from "../examples/chart-example-grid";
import { ChartBarDemoLegend as Example3 } from "../examples/chart-example-legend";
import { ChartBarDemoTooltip as Example4 } from "../examples/chart-example-tooltip";
import { ChartTooltipDemo as Example6 } from "../examples/chart-tooltip";
export function ChartDemo() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-8 overflow-x-auto md:grid-cols-2 *:min-w-0 *:max-w-full">
      <Example0 />
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}