import { Skeleton } from "@ui/skeleton";
import { Suspense, lazy } from "preact/compat";
import type { BundledLanguage, BundledTheme } from "shiki";

const HighlightCodeInternal = lazy(() => import("./HighlightCodeInternal"));

export default function HighlightCode(props: { codeString: string; lang: BundledLanguage; theme?: BundledTheme }) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-col items-center justify-center">
          <Skeleton
            className="w-full"
            style={{
              height: `${props.codeString.split("\n").length + 2}em`,
            }}
          />
        </div>
      }
    >
      <HighlightCodeInternal
        lang={props.lang}
        theme={props.theme}
        codeString={props.codeString}
      />
    </Suspense>
  );
}
