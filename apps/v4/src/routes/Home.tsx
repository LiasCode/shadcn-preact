import { AlertDemo } from "@/components/AlertDemo";
import { AvatarDemo } from "@/components/AvatarDemo";
import { BadgeDemo } from "@/components/BadgeDemo";
import { ButtonDemo } from "@/components/ButtonDemo";
import { CardDemo } from "@/components/CardDemo";
import { InputDemo } from "@/components/InputDemo";
import { InputGroupDemo } from "@/components/InputGroupDemo";
import { NativeSelectDemo } from "@/components/NativeSelectDemo";
import { SeparatorDemo } from "@/components/SeparatorDemo";
import { SpinnerDemo } from "@/components/SpinnerDemo";
import { Header } from "@/layout/Header";
import type { ComponentChild } from "preact";

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-start gap-4 self-center overflow-hidden p-2">
        <Header />

        <div className="flex h-auto w-full flex-col gap-4 rounded p-2 pt-12">
          <DemoSection
            title="Buttons"
            slot=<ButtonDemo />
          />

          <DemoSection
            title="Avatars"
            slot=<AvatarDemo />
          />

          <DemoSection
            title="Alert"
            slot=<AlertDemo />
          />

          <DemoSection
            title="Spinner"
            slot=<SpinnerDemo />
          />

          <DemoSection
            title="Card"
            slot=<CardDemo />
          />

          <DemoSection
            title="Input"
            slot=<InputDemo />
          />

          <DemoSection
            title="Input Group"
            slot=<InputGroupDemo />
          />

          <DemoSection
            title="Native Select"
            slot=<NativeSelectDemo />
          />

          <DemoSection
            title="Separator"
            slot=<SeparatorDemo />
          />

          <DemoSection
            title="Badges"
            slot=<BadgeDemo />
          />
        </div>
      </div>
    </div>
  );
}

const DemoSection = (props: { title: string; slot: ComponentChild }) => {
  return (
    <>
      <div className="flex h-auto w-full flex-col gap-4 rounded p-2">
        <h1 class={"font-semibold"}>{props.title}</h1>
        {props.slot}
      </div>
      <div class="h-[1px] w-full bg-border" />
    </>
  );
};
