import { AlertDemo } from "@/components/AlertDemo";
import { AvatarDemo } from "@/components/AvatarDemo";
import { CardDemo } from "@/components/CardDemo";
import { InputDemo } from "@/components/InputDemo";
import { Button } from "@ui/button";
import { Loader2Icon } from "lucide-preact";
import { GitBranchIcon } from "../components/GitBranchIcon";

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-start gap-4 self-center overflow-hidden p-2">
        <header className="fixed top-1 z-10 flex h-12 w-full max-w-[63rem] items-center justify-between rounded-lg border bg-background p-2">
          <h1 class="font-bold text-[#b57beb] text-lg">Shadcn Preact V4</h1>
          <Button
            variant="ghost"
            onClick={() => {
              document.body.classList.toggle("dark");
            }}
          >
            Toggle theme
          </Button>
        </header>

        <div className="flex h-auto w-full flex-col gap-4 rounded p-2 pt-12">
          <h1>Buttons</h1>
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

          <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
            <h1>Avatars</h1>
            <AvatarDemo />
          </div>

          <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
            <h1>Alert</h1>
            <AlertDemo />
          </div>

          <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
            <h1>Card</h1>
            <CardDemo />
          </div>

          <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
            <h1>Input</h1>
            <InputDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
