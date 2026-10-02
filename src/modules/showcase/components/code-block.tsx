import { Button } from "@registry/ui/button";
import { CheckIcon, CopyIcon } from "lucide-preact";
import { useState } from "preact/compat";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted/40">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Copy code"
        className="absolute top-2 right-2"
        onClick={async () => {
          if (typeof navigator === "undefined" || !navigator.clipboard) return;
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre className="overflow-x-auto p-4 pr-12 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}