import { lstatSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

export function projectPath(cwd: string, path: string) {
  if (!path || isAbsolute(path)) {
    throw new Error(`Use a project-relative path: ${path}`);
  }

  const destination = resolve(cwd, path);
  const local = relative(cwd, destination);

  if (
    !local ||
    local === ".." ||
    local.startsWith(`..${sep}`) ||
    local.split(sep).includes("node_modules")
  ) {
    throw new Error(`Path must stay inside the project: ${path}`);
  }

  let current = cwd;

  const parts = local.split(sep);

  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const information = lstatSync(current, { throwIfNoEntry: false });

    if (information?.isSymbolicLink()) {
      throw new Error(`Refusing to write through a symlink: ${path}`);
    }

    if (information && index < parts.length - 1 && !information.isDirectory()) {
      throw new Error(`Expected a directory: ${relative(cwd, current)}`);
    }
  }

  return destination;
}
