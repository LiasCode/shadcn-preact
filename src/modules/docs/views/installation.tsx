import { buttonVariants } from "@registry/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-preact";

import { DocsLayout } from "@/layouts/docs-layout";
import { copyComponentsCommand, repositoryUrl } from "@/lib/site";
import { CodeBlock } from "@/modules/showcase/components/code-block";

import globalStyles from "@/index.css?raw";

// Reuse the verified theme blocks without documentation-only styles.
const themeStyles =
  globalStyles.match(/@theme inline \{[\s\S]*?@layer base \{[\s\S]*?\n\}/)?.[0] ?? "";

const sections = [
  { id: "compatibility", title: "Preact compatibility" },
  { id: "shared-dependencies", title: "Shared dependencies" },
  { id: "source", title: "Copy components" },
  { id: "styles", title: "Styles" },
  { id: "usage", title: "Usage" },
  { id: "dependencies", title: "Additional dependencies" },
  { id: "upstream", title: "Upstream documentation" },
];

const dependencies = [
  ["Calendar", "react-day-picker, date-fns (date examples)"],
  ["Chart", "recharts"],
  ["Command", "cmdk"],
  ["Carousel", "embla-carousel-react, embla-carousel-autoplay (optional)"],
  ["Input OTP", "input-otp"],
  ["Resizable", "react-resizable-panels 4.x"],
  ["Sonner", "sonner"],
];

const linkClass = "font-medium underline underline-offset-4 hover:text-foreground";
const sectionClass = "scroll-mt-20 space-y-4";

export function InstallationView() {
  return (
    <DocsLayout toc={sections}>
      <article className="min-w-0 space-y-12">
        <section id="installation" aria-labelledby="installation-title" className={sectionClass}>
          <h1 id="installation-title" className="font-bold text-3xl tracking-tight sm:text-4xl">
            Installation
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Start with a Preact 11 project with Tailwind CSS v4 configured. Follow the{" "}
            <a href="https://tailwindcss.com/docs/installation/using-vite" className={linkClass}>
              Tailwind Vite guide
            </a>{" "}
            if you need to add Tailwind.
          </p>
          <ol className="space-y-8">
            <li className="space-y-3">
              <h2 id="compatibility" className="scroll-mt-20 font-medium">
                1. Configure Preact compatibility
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                With Vite, use @preact/preset-vite. It aliases React imports to Preact for the
                upstream libraries. Keep the same aliases in your TypeScript configuration.
              </p>
              <CodeBlock
                code={`// vite.config.ts — keep your existing Tailwind plugin
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
});`}
              />
              <CodeBlock
                code={`// tsconfig.json — merge into compilerOptions
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime/"],
      "react/jsx-dev-runtime": ["./node_modules/preact/jsx-runtime/"]
    }
  }
}`}
              />
            </li>
            <li className="space-y-3">
              <h2 id="shared-dependencies" className="scroll-mt-20 font-medium">
                2. Add shared dependencies
              </h2>
              <CodeBlock code="bun add --exact class-variance-authority@0.7.1 cn@0.4.0 lucide-preact@1.51.0 @floating-ui/react-dom@2.1.9 tw-animate-css@1.4.0" />
            </li>
            <li className="space-y-3">
              <h2 id="source" className="scroll-mt-20 font-medium">
                3. Choose your components
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Choose a component from the{" "}
                <a href="/docs/components" className={linkClass}>
                  catalog
                </a>{" "}
                and follow its installation guide to copy that component and its local dependencies
                directly from the repository with degit.
              </p>
              <details className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Copy the entire catalog instead
                </summary>
                <div className="mt-4">
                  <CodeBlock code={copyComponentsCommand} />
                </div>
              </details>
              <p className="text-sm leading-7 text-muted-foreground">
                This copies the full catalog. Keep lib/ and primitives/ alongside the wrappers:
                their imports are relative. You can remove components you do not use, retaining the
                files they import.
              </p>
            </li>
            <li className="space-y-3">
              <h2 id="styles" className="scroll-mt-20 font-medium">
                4. Add the styles
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Copy{" "}
                <a
                  href={`${repositoryUrl}/blob/main/src/styles/shadcn-tailwind.css`}
                  className={linkClass}
                >
                  shadcn-tailwind.css
                </a>{" "}
                into src/styles/. Add these imports at the top of your global stylesheet.
              </p>
              <CodeBlock
                code={`/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "./styles/shadcn-tailwind.css";

@custom-variant dark (&:is(.dark *));`}
              />
              <p className="text-sm leading-7 text-muted-foreground">
                Add the theme tokens below after the imports. These match this port's nova styles.
                Import your global stylesheet from the app entry point.
              </p>
              <details className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-medium">Show theme CSS</summary>
                <div className="mt-4">
                  <CodeBlock code={themeStyles} />
                </div>
              </details>
            </li>
          </ol>
        </section>

        <section id="usage" aria-labelledby="usage-title" className={sectionClass}>
          <h2 id="usage-title" className="font-semibold text-2xl tracking-tight">
            Usage
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Import a copied component and use it in your app.
          </p>
          <CodeBlock
            code={`import { Button } from "./components/ui/button";

export function App() {
  return <Button>Continue</Button>;
}`}
          />
          <p className="text-sm leading-7 text-muted-foreground">
            For dark mode, wrap your app in ThemeProvider from ./components/ui/theme. Use useTheme
            to switch between light, dark, and system. The provider applies the dark class to the
            document element.
          </p>
        </section>

        <section id="dependencies" aria-labelledby="dependencies-title" className={sectionClass}>
          <h2 id="dependencies-title" className="font-semibold text-2xl tracking-tight">
            Additional dependencies
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Install these only when you use the corresponding component.
          </p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Component-specific runtime dependencies</caption>
              <thead className="border-b bg-muted/40">
                <tr>
                  <th scope="col" className="p-3 font-medium">
                    Component
                  </th>
                  <th scope="col" className="p-3 font-medium">
                    Package
                  </th>
                </tr>
              </thead>
              <tbody>
                {dependencies.map(([component, packages]) => (
                  <tr key={component} className="border-b last:border-0">
                    <th scope="row" className="p-3 font-medium">
                      {component}
                    </th>
                    <td className="p-3 text-muted-foreground">{packages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Combobox, Toast, Message Scroller, and Questionnaire use local Preact primitives.
          </p>
        </section>

        <section id="upstream" aria-labelledby="upstream-title" className={sectionClass}>
          <h2 id="upstream-title" className="font-semibold text-2xl tracking-tight">
            Upstream documentation
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Use the{" "}
            <a href="https://ui.shadcn.com/docs/components/base/button" className={linkClass}>
              official Base UI component documentation
            </a>{" "}
            for composition and usage patterns. Adapt imports to your local Preact components. The
            official CLI installs upstream components; use the copy command above for this port.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            For customization, see{" "}
            <a href="https://ui.shadcn.com/docs/theming" className={linkClass}>
              Theming
            </a>
            . The older release is maintained on the{" "}
            <a href={`${repositoryUrl}/tree/v3`} className={linkClass}>
              v3 branch
            </a>
            .
          </p>
        </section>
        <nav
          aria-label="Documentation pages"
          className="flex flex-wrap justify-between gap-3 border-t pt-6"
        >
          <a href="/docs" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon aria-hidden="true" /> Introduction
          </a>
          <a href="/docs/components" className={buttonVariants({ variant: "outline" })}>
            Components <ArrowRightIcon aria-hidden="true" />
          </a>
        </nav>
      </article>
    </DocsLayout>
  );
}
