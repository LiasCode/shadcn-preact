export function getDecimalPrecision(num: number) {
  if (num === 0) return 0;
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split("e-");
    const decimal = parts[0]!.split(".")[1];
    return (decimal?.length ?? 0) + Number.parseInt(parts[1] ?? "0", 10);
  }
  return num.toString().split(".")[1]?.length ?? 0;
}
export function roundValueToStep(value: number, step: number, min: number) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(Math.max(getDecimalPrecision(step), getDecimalPrecision(min))));
}