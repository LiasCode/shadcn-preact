import { Bubble, BubbleContent } from "@registry/ui/bubble";
import { Message, MessageContent } from "@registry/ui/message";
import { MessageScrollerItem } from "@registry/ui/message-scroller";
import { BrainIcon } from "lucide-preact";
import * as React from "preact/compat";

import type { MessageAnimationPreset } from "./message-animations";
import { MESSAGE_ANIMATIONS } from "./message-animations";

type MessageAnimatedPart = {
  content?: unknown;
  type: string;
  text?: unknown;
};

type MessageAnimatedMessage = {
  id: string;
  role: string;
  text?: string;
  parts?: ReadonlyArray<MessageAnimatedPart>;
};

const MotionMessageScrollerItem = MessageScrollerItem;

function MessageAnimated({
  message,
  animationPreset = MESSAGE_ANIMATIONS["slide-up"],
  assistantVariant = "ghost",
  scrollAnchor,
  userVariant = "muted",
  ...props
}: Omit<
  React.ComponentProps<typeof MotionMessageScrollerItem>,
  "animate" | "children" | "exit" | "initial" | "messageId" | "variants"
> & {
  animationPreset?: MessageAnimationPreset;
  assistantVariant?: React.ComponentProps<typeof Bubble>["variant"];
  message: MessageAnimatedMessage;
  userVariant?: React.ComponentProps<typeof Bubble>["variant"];
}) {
  const isUserMessage = message.role === "user";

  if (isUserMessage) {
    return (
      <MotionMessageScrollerItem
        messageId={message.id}
        scrollAnchor={scrollAnchor ?? true}
        className={`demo-message-enter demo-message-${animationPreset.id}`}
        {...props}
      >
        <MessageAnimatedRow message={message} assistantVariant={assistantVariant} userVariant={userVariant} />
      </MotionMessageScrollerItem>
    );
  }

  return (
    <MotionMessageScrollerItem messageId={message.id} scrollAnchor={scrollAnchor} {...props}>
      <MessageAnimatedRow message={message} assistantVariant={assistantVariant} userVariant={userVariant} />
    </MotionMessageScrollerItem>
  );
}

function MessageAnimatedRow({
  message,
  assistantVariant,
  userVariant,
}: {
  assistantVariant: React.ComponentProps<typeof Bubble>["variant"];
  message: MessageAnimatedMessage;
  userVariant: React.ComponentProps<typeof Bubble>["variant"];
}) {
  const isUserMessage = message.role === "user";
  const parts = getMessageAnimatedContentParts(message);

  return (
    <Message align={isUserMessage ? "end" : "start"}>
      <MessageContent>
        {parts.map((part) => {
          const paragraphs = part.text
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);

          if (part.type === "reasoning") {
            return (
              <div key={part.key} className="w-full border-l-2 border-muted-foreground/30 pl-3 text-muted-foreground">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium">
                  <BrainIcon className="size-3.5" />
                  Reasoning
                </div>
                <div className="space-y-1.5 text-sm">
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${part.key}-${paragraphIndex}`} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Bubble key={part.key} variant={isUserMessage ? userVariant : assistantVariant}>
              <BubbleContent className="space-y-2">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${part.key}-${paragraphIndex}`} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </BubbleContent>
            </Bubble>
          );
        })}
      </MessageContent>
    </Message>
  );
}

function getMessageAnimatedContentParts(message: MessageAnimatedMessage) {
  if (message.parts) {
    return message.parts.flatMap((part, index) => {
      const type =
        part.type === "reasoning" || part.type === "thinking" ? "reasoning" : part.type === "text" ? "text" : null;
      const text = typeof part.text === "string" ? part.text : typeof part.content === "string" ? part.content : null;

      if (!type || text === null) {
        return [];
      }

      return [
        {
          key: `${message.id}-${index}`,
          text,
          type,
        },
      ];
    });
  }

  return typeof message.text === "string" ? [{ key: `${message.id}-text`, text: message.text, type: "text" }] : [];
}

export { MessageAnimated, type MessageAnimatedMessage };