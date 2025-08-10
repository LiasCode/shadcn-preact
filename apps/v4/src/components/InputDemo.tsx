import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

export function InputDemo() {
  return (
    <div className={"flex flex-col gap-8 *:max-w-sm"}>
      <Input
        type="email"
        placeholder="Email"
      />

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
        />
      </div>

      <Input
        disabled
        type="email"
        placeholder="Email"
      />

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
        />
      </div>

      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="email"
          placeholder="Email"
        />
        <Button
          type="submit"
          variant="outline"
        >
          Subscribe
        </Button>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-2/3 space-y-2"
      >
        <div className={"flex flex-col gap-2"}>
          <Label>Username</Label>
          <Input placeholder="shadcn" />
          <span>This is your public display name.</span>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
