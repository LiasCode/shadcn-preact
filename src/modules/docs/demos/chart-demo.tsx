import { ChartBarInteractive } from "./charts/bars";
import { ChartPieDonutText } from "./charts/pie";
import { ChartRadialGrid } from "./charts/radial";

export function ChartDemo() {
  return (
    <div className={"flex flex-col gap-8"}>
      <ChartBarInteractive />
      <ChartPieDonutText />
      <ChartRadialGrid />
    </div>
  );
}