import { Alert, AlertDescription, AlertTitle } from "@registry/ui/alert";
import { Button } from "@registry/ui/button";
import { ExternalLink } from "lucide-preact";

export function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background">
      <Alert variant="destructive" className="max-w-125 border-red-500">
        <AlertTitle className="font-bold text-red-500">404 error, Not found</AlertTitle>
        <AlertDescription className="text-red-400">This resource doesn't exists</AlertDescription>
      </Alert>

      <a href={"/"}>
        <Button variant="secondary">
          Go home <ExternalLink />
        </Button>
      </a>
    </div>
  );
}
