import { Button } from "@ui/button";
import { Spinner } from "@ui/spinner";

export function SpinnerDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start gap-6">
        <Spinner className="size-3" />
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>

      <div className="flex flex-row items-start gap-6">
        <Spinner className="size-6 text-red-500" />
        <Spinner className="size-6 text-green-500" />
        <Spinner className="size-6 text-blue-500" />
        <Spinner className="size-6 text-yellow-500" />
        <Spinner className="size-6 text-purple-500" />
      </div>

      <div className="flex flex-row items-start gap-4">
        <Button
          disabled
          size="sm"
        >
          <Spinner />
          Loading...
        </Button>
        <Button
          variant="outline"
          disabled
          size="sm"
        >
          <Spinner />
          Please wait
        </Button>
        <Button
          variant="secondary"
          disabled
          size="sm"
        >
          <Spinner />
          Processing
        </Button>
      </div>
    </div>
  );
}
