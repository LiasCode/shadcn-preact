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
        <Label htmlFor="picture1">Picture</Label>
        <Input
          id="picture1"
          type="file"
        />
      </div>

      <Input
        disabled
        type="email"
        placeholder="Email"
      />

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="email1">Email</Label>
        <Input
          type="email"
          id="email1"
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
