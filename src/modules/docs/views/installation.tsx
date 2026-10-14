import { buttonVariants } from "@registry/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { DocsLayout } from "@/layouts/docs-layout";
import type { InstallationSnippets } from "@/lib/installation-snippets";
import { cliCommand, repositoryUrl } from "@/lib/site";
import { CodeBlock } from "@/modules/showcase/components/code-block";

import { setupDependencies, setupDevDependencies } from "../../../../cli/registry.json";

// Every code block of this page is highlighted at build time by `scripts/installation-docs.ts`.
// The file is generated, so it is loaded through a glob that tolerates its absence while type-checking.
const generated = import.meta.glob<InstallationSnippets>(
  "../../../../.cache/guide-docs/installation.json",
  { eager: true, import: "default" },
);

function loadSnippets(): InstallationSnippets {
  const found = generated["../../../../.cache/guide-docs/installation.json"];

  if (!found) {
    throw new Error("Missing installation snippets: run the Vite build to generate them.");
  }

  return found;
}

const snippets = loadSnippets();

const sections = [
  { id: "quick-start", title: "Quick start" },
  { id: "create", title: "1. Create the project", nested: true },
  { id: "starter-styles", title: "2. Clean the starter styles", nested: true },
  { id: "init", title: "3. Run init", nested: true },
  { id: "font", title: "4. Add the font", nested: true },
  { id: "add", title: "5. Add components", nested: true },
  { id: "usage", title: "6. Use them", nested: true },
  { id: "verify", title: "7. Verify", nested: true },
  { id: "dark-mode", title: "Dark mode and toasts" },
  { id: "existing-project", title: "Existing project" },
  { id: "changes", title: "What init changes" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "manual", title: "Manual / degit" },
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

const problems = [
  [
    "Borders, hover backgrounds or text colors look wrong (for example purple accents)",
    "Your global stylesheet still declares theme variables such as --border, --accent or --background, usually from the Vite starter. Remove them: step 2. init prints a warning that names the variables.",
  ],
  [
    "The page is centered in a narrow bordered column or headings have starter sizes",
    "The starter #app, h1 and h2 rules are still in src/index.css. Replace the file as shown in step 2.",
  ],
  [
    "Tailwind classes have no effect",
    'The stylesheet must start with @import "tailwindcss"; and be imported by src/main.tsx or configured with --css. Run init again; it repairs both imports without touching your other CSS.',
  ],
  [
    "The text uses a generic sans-serif font",
    "Install Geist as shown in step 4. The theme names Geist Variable but never loads it by itself.",
  ],
  [
    "Existing files differ",
    "init and add never replace a file you changed. Review the listed files, then pass --overwrite. Use --dry-run first to preview.",
  ],
  [
    "Dependency installation failed",
    "The CLI rolls back every file and the lockfile. Fix the network or registry error and run the same command again.",
  ],
  [
    "Where did my vite.config.ts go?",
    "It is preserved as vite.config.shadcn-preact.original.ts. Keep editing that file; vite.config.ts is a small wrapper that adds Preact, Tailwind and aliases.",
  ],
  [
    "The theme never switches to dark",
    "Wrap the app in ThemeProvider (see Dark mode and toasts). The provider adds the dark class to the html element.",
  ],
  [
    'Hook, context or "invalid hook call" errors',
    "A second copy of Preact or React is loaded. Use the Preact + TypeScript Vite template, run bun install, and do not replace the wrapper vite.config.ts.",
  ],
];

const linkClass = "font-medium underline underline-offset-4 hover:text-foreground";
const sectionClass = "scroll-mt-20 space-y-4";
const textClass = "text-sm leading-7 text-muted-foreground";
const headingClass = "font-semibold text-2xl tracking-tight";

function P({ children }: { children: ComponentChildren }) {
  return <p className={textClass}>{children}</p>;
}

function Step({ id, title, children }: { id: string; title: string; children: ComponentChildren }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 space-y-3">
      <h3 id={`${id}-title`} className="font-semibold text-lg tracking-tight">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function InstallationView() {
  return (
    <DocsLayout toc={sections}>
      <article className="min-w-0 space-y-12">
        <section id="installation" aria-labelledby="installation-title" className={sectionClass}>
          <h1 id="installation-title" className="font-bold text-3xl tracking-tight sm:text-4xl">
            Installation
          </h1>
          <P>
            Follow the quick start from an empty folder to a working, fully configured project. The
            CLI configures Preact 11, TypeScript, Vite, Tailwind CSS v4 and the nova theme in one
            run. You need{" "}
            <a href="https://bun.sh/docs/installation" className={linkClass}>
              Bun
            </a>{" "}
            (the installer is Bun-only); the CLI runs directly from GitHub, so there is nothing to
            publish or install globally.
          </P>
        </section>

        <section id="quick-start" aria-labelledby="quick-start-title" className={sectionClass}>
          <h2 id="quick-start-title" className={headingClass}>
            Quick start
          </h2>

          <Step id="create" title="1. Create the Vite project">
            <P>
              Choose the <strong>Preact + TypeScript</strong> template. The components are TSX, so
              the TypeScript template (preact-ts) is required.
            </P>
            <CodeBlock {...snippets.create} />
          </Step>

          <Step id="starter-styles" title="2. Clean the starter styles">
            <P>
              The Vite starter ships demo styles that redeclare <code>--border</code> and{" "}
              <code>--accent</code> (the theme uses both), define colors and sizes of their own, and
              restyle <code>#app</code>, <code>h1</code> and <code>h2</code>. They load after the
              theme and silently override it, so remove them before running init. Skip this step
              only for an empty directory, which init bootstraps for you.
            </P>
            <CodeBlock {...snippets.cleanFiles} />
            <CodeBlock {...snippets.cleanCss} />
            <CodeBlock {...snippets.cleanApp} />
          </Step>

          <Step id="init" title="3. Run init">
            <CodeBlock {...snippets.init} />
            <P>
              This single command prepares everything: it merges the TypeScript settings and aliases
              (including referenced configs), wraps your Vite config with the Preact and Tailwind
              plugins, loads the global stylesheet, adds the nova theme, and installs exact
              dependencies. It only touches what it needs, preserves existing CSS and comments, and
              can safely be run again. Preview it with <code>--dry-run</code> first if you prefer.
            </P>
            <P>
              If the output starts with <code>Warning: src/index.css already declares …</code>, your
              stylesheet redefines theme variables: remove them as described in step 2.
            </P>
          </Step>

          <Step id="font" title="4. Add the font">
            <P>
              The nova theme uses Geist Variable but does not load it. Install it and import it in
              your global stylesheet, between Tailwind and the theme:
            </P>
            <CodeBlock {...snippets.geistInstall} />
            <CodeBlock {...snippets.geistCss} />
          </Step>

          <Step id="add" title="5. Add components">
            <CodeBlock {...snippets.add} />
            <P>
              Each component is copied with its local dependencies (<code>lib/</code> and{" "}
              <code>primitives/</code>) and both MIT licenses; the packages it needs are installed
              with exact versions. Browse the{" "}
              <a href="/docs/components" className={linkClass}>
                catalog
              </a>{" "}
              for names, or run <code>{`${cliCommand} list`}</code>.
            </P>
          </Step>

          <Step id="usage" title="6. Use them">
            <CodeBlock {...snippets.usage} />
            <P>
              Imports are relative on purpose: the copied files never depend on an alias or on this
              repository.
            </P>
          </Step>

          <Step id="verify" title="7. Verify">
            <CodeBlock {...snippets.verify} />
            <P>You are done when all of these are true:</P>
            <ul className={`${textClass} list-disc space-y-1 pl-5`}>
              <li>
                The button is dark with light text and rounded corners; the outline button has a
                neutral gray border.
              </li>
              <li>The dialog opens, traps focus, and closes with Escape.</li>
              <li>The text renders in Geist rather than a generic sans-serif font.</li>
              <li>
                <code>bun run build</code> finishes without TypeScript or Vite errors.
              </li>
            </ul>
          </Step>
        </section>

        <section id="dark-mode" aria-labelledby="dark-mode-title" className={sectionClass}>
          <h2 id="dark-mode-title" className={headingClass}>
            Dark mode and toasts
          </h2>
          <P>
            Install the Theme provider, then wrap the app once. It applies the dark class to the
            html element, follows the system preference by default, and remembers the choice. Use{" "}
            <code>useTheme()</code> to switch between light, dark and system.
          </P>
          <CodeBlock {...snippets.addTheme} />
          <CodeBlock {...snippets.main} />
          <P>
            Toast and Sonner need a viewport: add <code>add sonner</code> (or <code>toast</code>)
            and render <code>{"<Toaster />"}</code> once, for example next to your routes.
          </P>
        </section>

        <section
          id="existing-project"
          aria-labelledby="existing-project-title"
          className={sectionClass}
        >
          <h2 id="existing-project-title" className={headingClass}>
            Existing project
          </h2>
          <P>
            init also works in a project you already have. Check these points first, then run steps
            3 to 7:
          </P>
          <ul className={`${textClass} list-disc space-y-1 pl-5`}>
            <li>
              It must be a Vite project written in TypeScript and Preact. React projects must
              migrate to Preact first.
            </li>
            <li>
              Tailwind CSS must be v4 (<code>@import "tailwindcss"</code>); init installs the Vite
              plugin and keeps your other plugins. Remove a Tailwind v3 config and PostCSS plugin
              first.
            </li>
            <li>
              Your global stylesheet must not define variables that the theme also defines, nor
              restyle <code>html</code>, <code>body</code> or the root element with colors or
              widths. Rename or remove them (see step 2). init lists the conflicting variables.
            </li>
            <li>
              Use <code>--cwd ./apps/web</code> in a monorepo, <code>--css</code> for a stylesheet
              other than <code>src/index.css</code>, and <code>--path</code> for another component
              folder.
            </li>
          </ul>
          <CodeBlock {...snippets.options} />
          <P>
            The CLI protects existing files that differ: <code>--overwrite</code> replaces them,{" "}
            <code>--dry-run</code> only reports changes, <code>--no-install</code> copies files and
            prints the dependency command, and <code>--all</code> includes the Theme provider.
          </P>
        </section>

        <section id="changes" aria-labelledby="changes-title" className={sectionClass}>
          <h2 id="changes-title" className={headingClass}>
            What init changes
          </h2>
          <CodeBlock {...snippets.tree} />
          <P>
            Packages installed with exact versions:{" "}
            <code>{Object.keys(setupDependencies).join(", ")}</code> and, as development
            dependencies, <code>{Object.keys(setupDevDependencies).join(", ")}</code>. The package
            scripts dev, build and preview are added only if missing.
          </P>
        </section>

        <section
          id="troubleshooting"
          aria-labelledby="troubleshooting-title"
          className={sectionClass}
        >
          <h2 id="troubleshooting-title" className={headingClass}>
            Troubleshooting
          </h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Common installation problems and fixes</caption>
              <thead className="border-b bg-muted/40">
                <tr>
                  <th scope="col" className="p-3 font-medium">
                    Symptom
                  </th>
                  <th scope="col" className="p-3 font-medium">
                    Fix
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map(([symptom, fix]) => (
                  <tr key={symptom} className="border-b align-top last:border-0">
                    <th scope="row" className="p-3 font-medium">
                      {symptom}
                    </th>
                    <td className="p-3 text-muted-foreground">{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="manual" aria-labelledby="manual-title" className={sectionClass}>
          <h2 id="manual-title" className={headingClass}>
            Manual installation / degit (optional)
          </h2>
          <P>
            Prefer not to use the CLI? Create the project as in step 1, clean the starter styles as
            in step 2, then apply these steps. They produce the same result as init.
          </P>
          <details className="rounded-xl border p-4 sm:p-6">
            <summary className="cursor-pointer font-semibold">Show the manual steps</summary>
            <ol className="mt-6 space-y-8">
              <li className="space-y-3">
                <h3 className="font-medium">1. Install dependencies</h3>
                <CodeBlock {...snippets.runtimeInstall} />
                <CodeBlock {...snippets.developmentInstall} />
              </li>
              <li className="space-y-3">
                <h3 className="font-medium">2. Configure Vite</h3>
                <P>
                  @preact/preset-vite aliases React imports to Preact for the upstream libraries;
                  add the Tailwind plugin next to it.
                </P>
                <CodeBlock {...snippets.manualVite} />
              </li>
              <li className="space-y-3">
                <h3 className="font-medium">3. Configure TypeScript</h3>
                <P>
                  Merge into <code>compilerOptions</code> of tsconfig.app.json (or tsconfig.json
                  when there is a single file).
                </P>
                <CodeBlock {...snippets.manualTypescript} />
              </li>
              <li className="space-y-3">
                <h3 id="source" className="scroll-mt-20 font-medium">
                  4. Choose your components
                </h3>
                <P>
                  Choose a component from the{" "}
                  <a href="/docs/components" className={linkClass}>
                    catalog
                  </a>{" "}
                  and follow its installation guide to copy that component and its local
                  dependencies directly from the repository with degit. Also copy{" "}
                  <code>lib/utils.ts</code>, which every component imports.
                </P>
                <details className="rounded-lg border p-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Copy the entire catalog instead
                  </summary>
                  <div className="mt-4 space-y-3">
                    <CodeBlock {...snippets.copyCatalog} />
                    <P>
                      This copies the full catalog. Keep lib/ and primitives/ alongside the
                      wrappers: their imports are relative. You can remove components you do not
                      use, retaining the files they import. The full catalog also needs every
                      package in the additional dependencies table below; otherwise bun run build
                      fails on the components whose packages are missing.
                    </P>
                  </div>
                </details>
              </li>
              <li className="space-y-3">
                <h3 id="styles" className="scroll-mt-20 font-medium">
                  5. Add the styles
                </h3>
                <P>
                  Copy{" "}
                  <a
                    href={`${repositoryUrl}/blob/main/src/styles/shadcn-tailwind.css`}
                    className={linkClass}
                  >
                    shadcn-tailwind.css
                  </a>{" "}
                  into src/styles/, install the font with{" "}
                  <code>bun add --exact @fontsource-variable/geist</code>, and use this global
                  stylesheet, importing it from src/main.tsx.
                </P>
                <CodeBlock {...snippets.manualCss} />
                <P>
                  Then add the theme tokens below after the imports. They match this port's nova
                  styles.
                </P>
                <details className="rounded-lg border p-4">
                  <summary className="cursor-pointer text-sm font-medium">Show theme CSS</summary>
                  <div className="mt-4">
                    <CodeBlock {...snippets.themeCss} />
                  </div>
                </details>
              </li>
            </ol>
          </details>
        </section>

        <section id="dependencies" aria-labelledby="dependencies-title" className={sectionClass}>
          <h2 id="dependencies-title" className={headingClass}>
            Additional dependencies
          </h2>
          <P>
            The CLI installs these when needed. For manual installation, add them only when you use
            the corresponding component.
          </P>
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
          <P>Combobox, Toast, Message Scroller, and Questionnaire use local Preact primitives.</P>
        </section>

        <section id="upstream" aria-labelledby="upstream-title" className={sectionClass}>
          <h2 id="upstream-title" className={headingClass}>
            Upstream documentation
          </h2>
          <P>
            Use the{" "}
            <a href="https://ui.shadcn.com/docs/components/base/button" className={linkClass}>
              official Base UI component documentation
            </a>{" "}
            for composition and usage patterns. Adapt imports to your local Preact components. The
            official shadcn CLI installs upstream components; use shadcn-preact for this port.
          </P>
          <P>
            For customization, see{" "}
            <a href="https://ui.shadcn.com/docs/theming" className={linkClass}>
              Theming
            </a>
            . The older release is maintained on the{" "}
            <a href={`${repositoryUrl}/tree/v3`} className={linkClass}>
              v3 branch
            </a>
            .
          </P>
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
