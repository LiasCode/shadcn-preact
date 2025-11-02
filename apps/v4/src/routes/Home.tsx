import { AlertDemo } from "@/components/demo/alert-demo";
import { AvatarDemo } from "@/components/demo/avatar-demo";
import { BadgeDemo } from "@/components/demo/badge-demo";
import { ButtonDemo } from "@/components/demo/button-demo";
import { ButtonGroupDemo } from "@/components/demo/button-group-demo";
import { CardDemo } from "@/components/demo/card-demo";
import { EmptyDemo } from "@/components/demo/empty-demo";
import { FieldDemo } from "@/components/demo/field-demo";
import { InputDemo } from "@/components/demo/input-demo";
import { InputGroupDemo } from "@/components/demo/input-group-demo";
import { KbdDemo } from "@/components/demo/kbd-demo";
import { LabelDemo } from "@/components/demo/label-demo";
import { NativeSelectDemo } from "@/components/demo/native-select-demo";
import { PaginationDemo } from "@/components/demo/pagination-demo";
import { SeparatorDemo } from "@/components/demo/separator-demo";
import { SkeletonDemo } from "@/components/demo/skeleton-demo";
import { SpinnerDemo } from "@/components/demo/spinner-demo";
import { TableDemo } from "@/components/demo/table-demo";
import { TabsDemo } from "@/components/demo/tabs-demo";
import { TextareaDemo } from "@/components/demo/textarea-demo";
import { Header } from "@/layout/Header";
import type { ComponentChild } from "preact";

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

const RoutesDemoObj: Record<string, ComponentChild> = {
  "alert": <AlertDemo />,
  "avatar": <AvatarDemo />,
  "badge": <BadgeDemo />,
  "button": <ButtonDemo />,
  "button-group": <ButtonGroupDemo />,
  "card": <CardDemo />,
  "empty": <EmptyDemo />,
  "field": <FieldDemo />,
  "input": <InputDemo />,
  "input-group": <InputGroupDemo />,
  "kbd": <KbdDemo />,
  "label": <LabelDemo />,
  "native-select": <NativeSelectDemo />,
  "pagination": <PaginationDemo />,
  "separator": <SeparatorDemo />,
  "skeleton": <SkeletonDemo />,
  "spinner": <SpinnerDemo />,
  "table": <TableDemo />,
  "tabs": <TabsDemo />,
  "textarea": <TextareaDemo />,
};
