import { Button } from "@ui/button";
import { ArrowUpRightIcon, Loader2Icon } from "lucide-preact";
import { GitBranchIcon } from "../GitBranchIcon";

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div class={"flex flex-col gap-2"}>
        <h2>Sizes</h2>
        <ButtonSize />
      </div>

      <h2>Variants</h2>

      <div className="flex flex-row flex-wrap gap-4">
        <Button variant={"default"}>This a Button default</Button>
        <Button variant={"destructive"}>This a Button destructive</Button>
        <Button variant={"ghost"}>This a Button ghost</Button>
        <Button variant={"link"}>This a Button link</Button>
        <Button variant={"outline"}>This a Button outline</Button>
        <Button variant={"secondary"}>This a Button secondary</Button>
        <Button
          variant="outline"
          size="sm"
        >
          <GitBranchIcon />
          New Branch
        </Button>

        <Button
          size="sm"
          disabled
        >
          <Loader2Icon className="animate-spin" />
          Please wait
        </Button>
      </div>
    </div>
  );
}

export function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button
          size="sm"
          variant="outline"
        >
          Small
        </Button>
        <Button
          size="icon-sm"
          aria-label="Submit"
          variant="outline"
        >
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline">Default</Button>
        <Button
          size="icon"
          aria-label="Submit"
          variant="outline"
        >
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button
          variant="outline"
          size="lg"
        >
          Large
        </Button>
        <Button
          size="icon-lg"
          aria-label="Submit"
          variant="outline"
        >
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  );
}
