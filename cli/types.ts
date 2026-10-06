export type Registry = {
  version: 1;
  components: Record<
    string,
    { name: string; files: string[]; dependencies: Record<string, string> }
  >;
  theme: string;
  setupDependencies: Record<string, string>;
  setupDevDependencies: Record<string, string>;
};

export type Configuration = {
  version: 1;
  style: "nova";
  paths: { ui: string; css: string };
};

export type Options = {
  cwd: string;
  path?: string;
  css?: string;
  dryRun: boolean;
  overwrite: boolean;
  install: boolean;
  all: boolean;
};

export type FileChange = { path: string; content: string; merge?: boolean };
