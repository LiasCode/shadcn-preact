import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "preact/hooks";

export function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(90), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={"flex flex-row gap-8 *:max-w-sm"}>
      <Progress
        value={progress}
        className="w-[60%]"
      />
    </div>
  );
}
