import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { ThemeProvider } from "@ui/theme";
import { Toaster } from "@ui/toast";
import { ExternalLink } from "lucide-preact";
import { LocationProvider, Route, Router } from "preact-iso";
import { AppRoutes } from "./routes/AppRoutes";
import AccordionPage from "./routes/Components/Accordion";
import AlertPage from "./routes/Components/Alert";
import AlertDialogPage from "./routes/Components/AlertDialog";
import AspectRatioPage from "./routes/Components/AspectRatio";
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
import LabelPage from "./routes/Components/Label";
import PopoverPage from "./routes/Components/Popover";
import ProgressPage from "./routes/Components/Progress";
import ResizablePage from "./routes/Components/Resizable";
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
import DarkModePage from "./routes/Docs/DarkMode";
import InstallationPage from "./routes/Docs/Installation";
import InstallationAstroPage from "./routes/Docs/InstallationAstro";
import InstallationVitePage from "./routes/Docs/InstallationVite";
import IntroductionPage from "./routes/Docs/Introduction";
import ThemingPage from "./routes/Docs/Theming";
import ExamplePage from "./routes/Example";
import HomePage from "./routes/Home";

export function App() {
  return (
    <LocationProvider>
      <ThemeProvider>
        <Toaster position="bottom-right" />

        <Router>
          <Route
            component={HomePage}
            path={AppRoutes.HOME}
          />

          <Route
            component={ExamplePage}
            path={AppRoutes.EXAMPLES}
          />

          <Route
            component={IntroductionPage}
            path={AppRoutes.DOCS.INTRO}
          />

          <Route
            component={InstallationPage}
            path={AppRoutes.DOCS.INSTALLATION}
          />

          <Route
            component={InstallationVitePage}
            path={AppRoutes.DOCS.INSTALLATION_VITE}
          />

          <Route
            component={InstallationAstroPage}
            path={AppRoutes.DOCS.INSTALLATION_ASTRO}
          />

          <Route
            component={SeparatorPage}
            path={AppRoutes.COMPONENTS.SEPARATOR}
          />

          <Route
            component={AccordionPage}
            path={AppRoutes.COMPONENTS.ACCORDION}
          />

          <Route
            component={ThemingPage}
            path={AppRoutes.DOCS.THEMING}
          />

          <Route
            component={DarkModePage}
            path={AppRoutes.DOCS.DARK_MODE}
          />

          <Route
            component={ButtonPage}
            path={AppRoutes.COMPONENTS.BUTTON}
          />

          <Route
            component={SelectPage}
            path={AppRoutes.COMPONENTS.SELECT}
          />

          <Route
            component={TogglePage}
            path={AppRoutes.COMPONENTS.TOGGLE}
          />

          <Route
            component={TabsPage}
            path={AppRoutes.COMPONENTS.TABS}
          />

          <Route
            component={TooltipPage}
            path={AppRoutes.COMPONENTS.TOOLTIP}
          />

          <Route
            component={PopoverPage}
            path={AppRoutes.COMPONENTS.POPOVER}
          />

          <Route
            component={TextareaPage}
            path={AppRoutes.COMPONENTS.TEXTAREA}
          />

          <Route
            component={ToastPage}
            path={AppRoutes.COMPONENTS.TOAST}
          />

          <Route
            component={CarouselPage}
            path={AppRoutes.COMPONENTS.CAROUSEL}
          />

          <Route
            component={TablePage}
            path={AppRoutes.COMPONENTS.TABLE}
          />

          <Route
            component={CommandPage}
            path={AppRoutes.COMPONENTS.COMMAND}
          />

          <Route
            component={CardPage}
            path={AppRoutes.COMPONENTS.CARD}
          />

          <Route
            component={DialogPage}
            path={AppRoutes.COMPONENTS.DIALOG}
          />

          <Route
            component={SheetPage}
            path={AppRoutes.COMPONENTS.SHEET}
          />

          <Route
            component={SkeletonPage}
            path={AppRoutes.COMPONENTS.SKELETON}
          />

          <Route
            component={AvatarPage}
            path={AppRoutes.COMPONENTS.AVATAR}
          />

          <Route
            component={DrawerPage}
            path={AppRoutes.COMPONENTS.DRAWER}
          />

          <Route
            component={CheckboxPage}
            path={AppRoutes.COMPONENTS.CHECKBOX}
          />

          <Route
            component={BreadcrumbsPage}
            path={AppRoutes.COMPONENTS.BREADCRUMB}
          />

          <Route
            component={InputPage}
            path={AppRoutes.COMPONENTS.INPUT}
          />

          <Route
            component={InputOtpPage}
            path={AppRoutes.COMPONENTS.INPUT_OTP}
          />

          <Route
            component={AspectRatioPage}
            path={AppRoutes.COMPONENTS.ASPECT_RATIO}
          />

          <Route
            component={LabelPage}
            path={AppRoutes.COMPONENTS.LABEL}
          />

          <Route
            component={SwitchPage}
            path={AppRoutes.COMPONENTS.SWITCH}
          />

          <Route
            component={ChartPage}
            path={AppRoutes.COMPONENTS.CHART}
          />

          <Route
            component={BadgePage}
            path={AppRoutes.COMPONENTS.BADGE}
          />

          <Route
            component={AlertDialogPage}
            path={AppRoutes.COMPONENTS.ALERT_DIALOG}
          />

          <Route
            component={AlertPage}
            path={AppRoutes.COMPONENTS.ALERT}
          />

          <Route
            component={ProgressPage}
            path={AppRoutes.COMPONENTS.PROGRESS}
          />

          <Route
            component={CalendarPage}
            path={AppRoutes.COMPONENTS.CALENDAR}
          />

          <Route
            component={ResizablePage}
            path={AppRoutes.COMPONENTS.RESIZABLE}
          />

          <Route
            component={CollapsiblePage}
            path={AppRoutes.COMPONENTS.COLLAPSIBLE}
          />

          <Route
            default
            component={() => (
              <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background">
                <Alert
                  variant="destructive"
                  className="max-w-[500px] border-red-500"
                >
                  <AlertTitle className="font-bold text-red-500">404 error, Not found</AlertTitle>
                  <AlertDescription className="text-red-400">This resource doesn't exists</AlertDescription>
                </Alert>

                <a href={AppRoutes.HOME}>
                  <Button variant="secondary">
                    Go home <ExternalLink />
                  </Button>
                </a>
              </div>
            )}
          />
        </Router>
      </ThemeProvider>
    </LocationProvider>
  );
}
