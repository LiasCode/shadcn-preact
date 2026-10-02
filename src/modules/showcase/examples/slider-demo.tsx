import { Slider } from "@registry/ui/slider";

export function SliderDemo() {
  return <Slider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" />;
}