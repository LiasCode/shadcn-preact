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
import { ToggleDemo } from "@/components/demo/toggle-demo";
import type { ComponentChild } from "preact";

export const RoutesDemoObj: Record<string, ComponentChild> = {
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
  "toggle": <ToggleDemo />,
};
