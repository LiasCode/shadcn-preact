import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

function DimensionsFields() {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="width">Width</Label>
        <Input
          id="width"
          defaultValue="100%"
          className="col-span-2 h-8"
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="maxWidth">Max. width</Label>
        <Input
          id="maxWidth"
          defaultValue="300px"
          className="col-span-2 h-8"
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="height">Height</Label>
        <Input
          id="height"
          defaultValue="25px"
          className="col-span-2 h-8"
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="maxHeight">Max. height</Label>
        <Input
          id="maxHeight"
          defaultValue="none"
          className="col-span-2 h-8"
        />
      </div>
    </div>
  );
}

export function PopoverDemo() {
  return (
    <div className="flex w-full flex-row flex-wrap gap-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit"
          >
            Open popover Left
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="start"
        >
          <div className="grid gap-4">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
            <DimensionsFields />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit"
          >
            Open popover Center
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="center"
        >
          <div className="grid gap-4">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
            <DimensionsFields />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit"
          >
            Open popover Right
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="end"
        >
          <div className="grid gap-4">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
            <DimensionsFields />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
