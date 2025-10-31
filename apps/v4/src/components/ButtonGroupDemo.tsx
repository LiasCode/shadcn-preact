import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Input } from "@ui/input";
import { ArrowLeftIcon, ArrowRightIcon, MinusIcon, PlusIcon, SearchIcon } from "lucide-preact";

export function ButtonGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroup className="hidden sm:flex">
          <Button
            variant="outline"
            size="icon"
            aria-label="Go Back"
          >
            <ArrowLeftIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Snooze</Button>
        </ButtonGroup>
      </ButtonGroup>

      <ButtonGroup
        orientation="vertical"
        aria-label="Media controls"
        className="h-fit"
      >
        <Button
          variant="outline"
          size="icon"
        >
          <PlusIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
        >
          <MinusIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroupSize />

      <ButtonGroupNested />

      <ButtonGroup>
        <Button
          variant="secondary"
          size="sm"
        >
          Copy
        </Button>
        <ButtonGroupSeparator />
        <Button
          variant="secondary"
          size="sm"
        >
          Paste
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Input placeholder="Search..." />
        <Button
          variant="outline"
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function ButtonGroupSize() {
  return (
    <div className="flex flex-col items-start gap-8">
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
        >
          Small
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          Button
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          Group
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button
          variant="outline"
          size="icon"
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outline"
          size="lg"
        >
          Large
        </Button>
        <Button
          variant="outline"
          size="lg"
        >
          Button
        </Button>
        <Button
          variant="outline"
          size="lg"
        >
          Group
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
        >
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          2
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          3
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          4
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          5
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next"
        >
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
