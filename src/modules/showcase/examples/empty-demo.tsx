import { Button } from "@registry/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@registry/ui/empty";
import { FolderCodeIcon } from "lucide-preact";
import { ArrowUpRightIcon } from "lucide-preact";

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
      <Button variant="link" render={<a href="#" />} className="text-muted-foreground" size="sm" nativeButton={false}>
        Learn More <ArrowUpRightIcon />
      </Button>
    </Empty>
  );
}