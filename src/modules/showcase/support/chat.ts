import { useEffect, useRef, useState } from "preact/hooks";

export type DemoMessage = {
  id: string;
  role: "user" | "assistant";
  parts: { type: "text"; text: string }[];
};
type Transport = { messages: DemoMessage[]; delayMs: number };

/** Deterministic local fixture transport; never contacts an AI service. */
export function createChat() {
  const messages: DemoMessage[] = [];
  const append = (role: DemoMessage["role"], text: string, options?: { id?: string }) => {
    messages.push({ id: options?.id ?? `message-${messages.length}`, role, parts: [{ type: "text", text }] });
    return chat;
  };
  const chat = {
    user: (text: string, options?: { id?: string }) => append("user", text, options),
    assistant: (text: string, options?: { id?: string }) => append("assistant", text, options),
    sleep: (_duration: number) => chat,
    get: (count = messages.length) => messages.slice(0, count),
    next: (current: DemoMessage[]) => messages.slice(current.length).find((message) => message.role === "user"),
    transport: ({ delayMs = 20 }: { delayMs?: number } = {}): Transport => ({ messages, delayMs }),
  };
  return chat;
}

export function getMessageText(message: Pick<DemoMessage, "parts">) {
  return message.parts.map((part) => part.text).join("");
}

export function useChat({ messages: initialMessages, transport }: { messages: DemoMessage[]; transport: Transport }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready");
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const busy = useRef(false);
  useEffect(
    () => () => {
      generation.current++;
      clearTimeout(timer.current);
    },
    [],
  );
  async function sendMessage(message: DemoMessage) {
    if (busy.current) return;
    busy.current = true;
    const run = ++generation.current;
    const index = transport.messages.findIndex((candidate) => candidate.id === message.id);
    const reply = transport.messages[index + 1];
    setMessages((current) => [...current, message]);
    setStatus("submitted");
    if (!reply || reply.role !== "assistant") {
      busy.current = false;
      setStatus("ready");
      return;
    }
    const text = getMessageText(reply);
    let length = 0;
    const tick = () => {
      if (run !== generation.current) return;
      length = Math.min(text.length, length + 12);
      const snapshot: DemoMessage = { ...reply, parts: [{ type: "text", text: text.slice(0, length) }] };
      setMessages((current) =>
        current.at(-1)?.id === reply.id ? [...current.slice(0, -1), snapshot] : [...current, snapshot],
      );
      setStatus(length === text.length ? "ready" : "streaming");
      if (length < text.length) timer.current = setTimeout(tick, transport.delayMs);
      else busy.current = false;
    };
    timer.current = setTimeout(tick, transport.delayMs);
  }
  return { messages, sendMessage, status, setMessages };
}