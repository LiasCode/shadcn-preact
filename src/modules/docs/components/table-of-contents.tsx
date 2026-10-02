export type TableOfContentsItem = { id: string; label: string };

export function TableOfContents({ items }: { items: readonly TableOfContentsItem[] }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20 space-y-2 text-sm">
        <div className="font-medium">On This Page</div>
        {items.map(({ id, label }) => (
          <a href={`#${id}`} className="block text-muted-foreground transition-colors hover:text-foreground">
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}