import { Footer } from "@/components/Layout/Footer";
import { Button } from "@ui/button";
import Header from "../components/Layout/Header";
import { AppRoutes } from "./AppRoutes";

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <Header />

      <div className="relative flex w-full flex-1 flex-col items-center justify-start border-accent border-b border-dashed">
        <div className="flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-4 border-accent border-dashed px-1 py-4 *:max-w-[100vw] *:overflow-auto 2xl:border-x 2xl:px-4">
          <div className="flex flex-col items-start gap-1 px-7 py-4 md:p-2">
            <h1 className="font-bold text-3xl leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Build your component library
            </h1>
            <p className="max-w-2xl font-light text-foreground text-lg">
              A set of beautifully-designed, accessible, and customizable components to help you build your component
              library. Open Source.
            </p>
            <p className="max-w-2xl font-light text-foreground text-lg">
              This is a direct port of shadcn components api and ui/ux to <strong>preact</strong>.
            </p>
            <div className="flex w-full items-center justify-start gap-2 pt-2">
              <a href={AppRoutes.DOCS.INTRO}>
                <Button size="sm">Get Started</Button>
              </a>
              <a
                href="https://github.com/LiasCode/shadcn-preact"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>Github</title>
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
                    />
                  </svg>
                  Github
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
