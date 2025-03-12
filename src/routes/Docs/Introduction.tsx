import { DocsLayout } from "@/components/Layout/DocsLayout";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronRight } from "lucide-preact";
import { A } from "preact-hashish-router";
import { AppRoutes } from "../AppRoutes";

export default function IntroductionPage() {
  return (
    <DocsLayout
      title="Introduction"
      description="A set of beautifully-designed, accessible, and customizable components to help you build your component library. Open Source."
    >
      <div className="flex max-w-full flex-col gap-6 pb-12 *:my-1">
        <p className="break-words leading-7 *:mx-2 [&amp;:not(:first-child)]:mt-6">
          An unofficial,
          <a
            className="font-medium underline underline-offset-4"
            href="https://preactjs.com/"
            target="_blank"
            rel="noreferrer"
          >
            Preact
          </a>
          port of
          <a
            className="font-medium underline underline-offset-4"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
          >
            shadcn/ui
          </a>
          .
        </p>

        <div className="flex flex-col *:break-words *:leading-7">
          <p>
            This is <strong>NOT</strong> a component library. It’s a collection of re-usable components that you can
            copy and paste into your apps.
          </p>

          <h2 className="mt-6 font-bold">What do you mean by not a component library?</h2>

          <p>
            I mean you do not install it as a dependency. It is not available or distributed via npm. I have no plans to
            publish it as an npm package (for now).
          </p>

          <p>
            Pick the components you need. Copy and paste the code into your project and customize to your needs. The
            code is yours.
          </p>

          <span className="italic">Use this as a reference to build your own component libraries.</span>

          <h2 className="mt-6 font-bold">Why if Preact is compatible with React? </h2>

          <p>
            Shadcn/ui is built on top of Radix UI and Tailwind CSS. Radix UI is an excellent component library, but it's
            dependency-heavy, and I've tried to move it to Preact for better integration and minimal external
            dependencies.
          </p>
        </div>
      </div>

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem />
          <PaginationItem>
            <A href={AppRoutes.DOCS.INSTALLATION}>
              <Button className="gap-1 pr-1" variant="outline">
                Intallation
                <ChevronRight />
              </Button>
            </A>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DocsLayout>
  );
}
