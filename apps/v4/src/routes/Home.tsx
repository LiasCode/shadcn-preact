import { AlertDemo } from "@/components/AlertDemo";
import { AvatarDemo } from "@/components/AvatarDemo";
import { Button } from "@ui/button";
import { Loader2Icon } from "lucide-preact";

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-start gap-4 self-center overflow-hidden border-x-2">
        <header className="flex w-full items-center justify-center border-b-2 p-4">
          <h1 class="font-bold text-[#a855f7] text-xl">Shadcn Preact V4</h1>
        </header>

        <div className={"flex h-auto w-full flex-col gap-4 border p-2"}>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                title="Git Branch"
                aria-label="Git Branch"
                role="img"
                class="icon icon-tabler icons-tabler-outline icon-tabler-git-branch"
              >
                <path
                  stroke="none"
                  d="M0 0h24v24H0z"
                  fill="none"
                />
                <path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M7 8l0 8" />
                <path d="M9 18h6a2 2 0 0 0 2 -2v-5" />
                <path d="M14 14l3 -3l3 3" />
              </svg>{" "}
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

          <div className={"flex h-auto w-full flex-col gap-4 border p-2"}>
            <h1>Avatars</h1>
            <AvatarDemo />
          </div>

          <div className={"flex h-auto w-full flex-col gap-4 border p-2"}>
            <h1>Alert</h1>
            <AlertDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
