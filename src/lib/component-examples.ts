export type ComponentExample = {
  id: string;
  title: string;
  description: string;
  modulePath: string;
  exportName: string;
  code: string;
  sourcePath: string;
  helpers: string[];
  components: { slug: string; name: string }[];
  packages: string[];
};
