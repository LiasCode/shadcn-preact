import ContentLayout from "@/components/ContentLayout";
import { Footer } from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadCrumb";
import { Button } from "@ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { A } from "preact-hashish-router";
import { Header } from "../../components/Header";
import { AppRoutes } from "../AppRoutes";

export default function InstallationPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <Header />

      <div className="relative mt-0 flex w-full flex-1 flex-col items-center justify-start border-accent border-b border-dashed p-0">
        <div className="flex w-full max-w-screen-2xl flex-col gap-4 border-accent border-dashed *:max-w-[100vw] *:overflow-auto md:border-x md:px-1 md:pt-2">
          <ContentLayout>
            <Card className="flex w-full max-w-screen-md flex-col border border-primary border-none pt-0 shadow-none max-md:*:px-2">
              <CardHeader>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <A href={AppRoutes.DOCS.INTRO}>Docs</A>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Installation</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <CardTitle className="text-3xl">Installation</CardTitle>

                <CardDescription className="text-md">
                  How to install dependencies and structure your app.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <A
                    class="flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10"
                    href={AppRoutes.DOCS.INSTALLATION_VITE}
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="currentColor"
                    >
                      <title>Vite</title>
                      <path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z" />
                    </svg>
                    <p class="mt-2 font-medium">Vite</p>
                  </A>

                  <A
                    class="flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10"
                    href={AppRoutes.DOCS.INSTALLATION_ASTRO}
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10"
                      fill="currentColor"
                    >
                      <title>Astro</title>
                      <path
                        d="M16.074 16.86C15.354 17.476 13.917 17.895 12.262 17.895C10.23 17.895 8.527 17.263 8.075 16.412C7.914 16.9 7.877 17.458 7.877 17.814C7.877 17.814 7.771 19.564 8.988 20.782C8.988 20.15 9.501 19.637 10.133 19.637C11.216 19.637 11.215 20.582 11.214 21.349V21.418C11.214 22.582 11.925 23.579 12.937 24C12.7812 23.6794 12.7005 23.3275 12.701 22.971C12.701 21.861 13.353 21.448 14.111 20.968C14.713 20.585 15.383 20.161 15.844 19.308C16.0926 18.8493 16.2225 18.3357 16.222 17.814C16.2221 17.4903 16.1722 17.1685 16.074 16.86ZM15.551 0.6C15.747 0.844 15.847 1.172 16.047 1.829L20.415 16.176C18.7743 15.3246 17.0134 14.7284 15.193 14.408L12.35 4.8C12.3273 4.72337 12.2803 4.65616 12.2162 4.60844C12.152 4.56072 12.0742 4.53505 11.9943 4.53528C11.9143 4.5355 11.8366 4.56161 11.7727 4.60969C11.7089 4.65777 11.6623 4.72524 11.64 4.802L8.83 14.405C7.00149 14.724 5.23264 15.3213 3.585 16.176L7.974 1.827C8.174 1.171 8.274 0.843 8.471 0.6C8.64406 0.385433 8.86922 0.218799 9.125 0.116C9.415 0 9.757 0 10.443 0H13.578C14.264 0 14.608 0 14.898 0.117C15.1529 0.219851 15.3783 0.386105 15.551 0.6Z"
                        fill="currentColor"
                      />
                    </svg>
                    <p class="mt-2 font-medium">Astro</p>
                  </A>
                </div>

                <Pagination className="mt-10">
                  <PaginationContent className="flex w-full flex-row justify-between">
                    <PaginationItem>
                      <A href={AppRoutes.DOCS.INTRO}>
                        <Button className="gap-1 pl-1" variant="outline">
                          <ChevronLeft />
                          Introduction
                        </Button>
                      </A>
                    </PaginationItem>
                    <PaginationItem>
                      <A href={AppRoutes.DOCS.THEMING}>
                        <Button className="gap-1 pr-1" variant="outline">
                          Theming
                          <ChevronRight />
                        </Button>
                      </A>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </ContentLayout>
        </div>
      </div>

      <Footer />
    </div>
  );
}
