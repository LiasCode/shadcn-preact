import { Header } from "@/layout/Header";
import type { ComponentChild } from "preact";
import { RoutesDemoObj } from "./RoutesDemo";

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-start gap-4 self-center overflow-hidden p-2">
        <Header />

        <div className="flex h-auto w-full flex-col gap-4 rounded p-2 pt-12">
          {Object.entries(RoutesDemoObj)
            .sort((a, b) => {
              const keyA = a[0].toLowerCase();
              const keyB = b[0].toLowerCase();
              if (keyA === keyB) return 1;
              if (keyA > keyB) return 1;
              return -1;
            })
            .map(([key, slot]) => (
              <DemoSection
                title={key.split("-").join(" ")}
                slot={slot}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

const DemoSection = (props: { title: string; slot: ComponentChild }) => {
  return (
    <>
      <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
        <h1 class="font-semibold capitalize">{props.title}</h1>
        {props.slot}
      </div>
      <div class="h-[1px] w-full bg-border" />
    </>
  );
};
