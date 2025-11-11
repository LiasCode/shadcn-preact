export function Footer() {
  return (
    <footer class="relative flex w-full items-center justify-center bg-background py-6 md:px-8 md:py-0">
      <div class="container flex w-full flex-col items-center justify-between gap-4 px-4 md:h-24 md:max-w-screen-md md:flex-row md:px-8">
        <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p class="text-center text-muted-foreground text-sm leading-loose md:text-left">
            Built &amp; designed by{" "}
            <a
              href="https://twitter.com/shadcn"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              shadcn
            </a>
            . Ported to Preact by{" "}
            <a
              href="https://github.com/LiasCode"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              LiasCode
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/LiasCode/shadcn-preact"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              GitHub.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
