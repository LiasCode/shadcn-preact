import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "preact/hooks";

export function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(90), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-row items-center justify-center gap-8">
      <Progress
        value={progress}
        className="w-[60%]"
      />
  </div>
  );
}
