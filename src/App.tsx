import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { ThemeProvider } from "@ui/theme";
import { Toaster } from "@ui/toast";
import { ExternalLink } from "lucide-preact";
import { A, ErrorRoute, Route, Router, RouterErrorBoundary } from "preact-hashish-router";
import { AppRoutes } from "./routes/AppRoutes";

import AlertPage from "./routes/Components/Alert";
import AlertDialogPage from "./routes/Components/AlertDialog";
import AvatarPage from "./routes/Components/Avatar";
import BadgePage from "./routes/Components/Badge";
import BreadcrumbsPage from "./routes/Components/Breadcrumb";
import ButtonPage from "./routes/Components/Button";
import CalendarPage from "./routes/Components/Calendar";
import CardPage from "./routes/Components/Card";
import CarouselPage from "./routes/Components/Carousel";
import ChartPage from "./routes/Components/Chart";
import CheckboxPage from "./routes/Components/Checkbox";
import CollapsiblePage from "./routes/Components/Collapsible";
import CommandPage from "./routes/Components/Command";
import DialogPage from "./routes/Components/Dialog";
import DrawerPage from "./routes/Components/Drawer";
import InputPage from "./routes/Components/Input";
import InputOtpPage from "./routes/Components/InputOtp";
// import InputTokenPage from "./routes/Components/InputToken";
import LabelPage from "./routes/Components/Label";
import PopoverPage from "./routes/Components/Popover";
import SelectPage from "./routes/Components/Select";
import SeparatorPage from "./routes/Components/Separator";
import SheetPage from "./routes/Components/Sheet";
import SkeletonPage from "./routes/Components/Skeleton";
import SwitchPage from "./routes/Components/Switch";
import TablePage from "./routes/Components/Table";
import TabsPage from "./routes/Components/Tabs";
import TextareaPage from "./routes/Components/Textarea";
import ToastPage from "./routes/Components/Toast";
import TogglePage from "./routes/Components/Toggle";
import TooltipPage from "./routes/Components/Tooltip";
import InstallationPage from "./routes/Docs/Installation";
import InstallationAstroPage from "./routes/Docs/InstallationAstro";
import InstallationVitePage from "./routes/Docs/InstallationVite";
import IntroductionPage from "./routes/Docs/Introduction";
import ThemingPage from "./routes/Docs/Theming";
// Pages
import ExamplePage from "./routes/Example";
import HomePage from "./routes/Home";

export function App() {
  return (
    <Router type="browser">
      <RouterErrorBoundary>
        <ThemeProvider>
          <Toaster position="bottom-right" />

          <Route path={AppRoutes.HOME}>
            <HomePage />
          </Route>

          <Route path={AppRoutes.EXAMPLES}>
            <ExamplePage />
          </Route>

          <Route path={AppRoutes.DOCS.INTRO}>
            <IntroductionPage />
          </Route>

          <Route path={AppRoutes.DOCS.INSTALLATION}>
            <InstallationPage />
          </Route>

          <Route path={AppRoutes.DOCS.INSTALLATION_VITE}>
            <InstallationVitePage />
          </Route>

          <Route path={AppRoutes.DOCS.INSTALLATION_ASTRO}>
            <InstallationAstroPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.SEPARATOR}>
            <SeparatorPage />
          </Route>

          <Route path={AppRoutes.DOCS.THEMING}>
            <ThemingPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.BUTTON}>
            <ButtonPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.SELECT}>
            <SelectPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TOGGLE}>
            <TogglePage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TABS}>
            <TabsPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TOOLTIP}>
            <TooltipPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.POPOVER}>
            <PopoverPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TEXTAREA}>
            <TextareaPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TOAST}>
            <ToastPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.CAROUSEL}>
            <CarouselPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.TABLE}>
            <TablePage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.COMMAND}>
            <CommandPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.CARD}>
            <CardPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.DIALOG}>
            <DialogPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.SHEET}>
            <SheetPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.SKELETON}>
            <SkeletonPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.AVATAR}>
            <AvatarPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.DRAWER}>
            <DrawerPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.CHECKBOX}>
            <CheckboxPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.BREADCRUMB}>
            <BreadcrumbsPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.INPUT}>
            <InputPage />
          </Route>

          {/* <Route path={AppRoutes.COMPONENTS.INPUT_TOKEN}>
            <InputTokenPage />
          </Route> */}

          <Route path={AppRoutes.COMPONENTS.INPUT_OTP}>
            <InputOtpPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.LABEL}>
            <LabelPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.SWITCH}>
            <SwitchPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.CHART}>
            <ChartPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.BADGE}>
            <BadgePage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.ALERT_DIALOG}>
            <AlertDialogPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.ALERT}>
            <AlertPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.CALENDAR}>
            <CalendarPage />
          </Route>

          <Route path={AppRoutes.COMPONENTS.COLLAPSIBLE}>
            <CollapsiblePage />
          </Route>

          <ErrorRoute>
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background">
              <Alert variant="destructive" className="max-w-[500px] border-red-500">
                <AlertTitle className="font-bold text-red-500">404 error, Not found</AlertTitle>
                <AlertDescription className="text-red-400">This resource doesn't exists</AlertDescription>
              </Alert>

              <A href={AppRoutes.HOME}>
                <Button variant="secondary">
                  Go home <ExternalLink />
                </Button>
              </A>
            </div>
          </ErrorRoute>
        </ThemeProvider>
      </RouterErrorBoundary>
    </Router>
  );
}
