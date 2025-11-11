import { Button } from "@ui/button";
import { Show } from "@ui/show";
import { Skeleton } from "@ui/skeleton";
import { Check, Copy } from "lucide-preact";
import { useLayoutEffect, useState } from "preact/hooks";
import type { BundledLanguage, BundledTheme } from "shiki";
import highlightCode from "./highlight";

export default function HighlightCodeInternal(props: {
  codeString: string;
  lang: BundledLanguage;
  theme?: BundledTheme;
}) {
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useLayoutEffect(() => {
    (async () => {
      const htmlHighlightCode = await highlightCode({
        codeString: props.codeString,
        lang: props.lang,
        theme: props.theme,
      });
      setHtmlCode(htmlHighlightCode);
      setIsProcessing(false);
    })();
  }, [props.codeString, props.lang, props.theme]);

  return (
    <div className="group relative w-full max-w-full overflow-hidden rounded-lg bg-background">
      <Button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 hidden h-7 w-7 p-1 group-hover:flex"
        size="icon"
      >
        {!copied && <Copy className="" />}
        {copied && <Check className="" />}
      </Button>

      <Show when={isProcessing}>
        <Skeleton
          className="w-full"
          style={{
            height: `${props.codeString.split("\n").length + 2}em`,
          }}
        />
      </Show>

      <Show when={!isProcessing}>
        <div
          className="max-w-full text-sm *:overflow-auto"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Is how shiki works
          dangerouslySetInnerHTML={{
            __html: htmlCode,
          }}
        />
      </Show>
    </div>
  );
}
