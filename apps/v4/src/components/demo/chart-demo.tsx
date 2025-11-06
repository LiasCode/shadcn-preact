import { ChartBarInteractive } from "../charts/Bars";
import { ChartPieDonutText } from "../charts/Pie";
import { ChartRadialGrid } from "../charts/Radial";

export function ChartDemo() {
  return (
    <div className={"flex flex-col gap-8"}>
      <ChartBarInteractive />
      <ChartPieDonutText />
      <ChartRadialGrid />
    </div>
  );
}
