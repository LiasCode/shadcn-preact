import type { FloatingRootContext } from "./useFloatingRootContext";

export interface FloatingNode {
  id: string;
  parentId: string | null;
  context: FloatingRootContext;
}
export class FloatingTreeStore {
  nodes = new Map<string, FloatingNode>();
  register(node: FloatingNode) {
    this.nodes.set(node.id, node);
    return () => {
      this.nodes.delete(node.id);
    };
  }
  descendants(id: string): FloatingNode[] {
    const result: FloatingNode[] = [];
    for (const node of this.nodes.values()) {
      let parent = node.parentId;
      const seen = new Set<string>();
      while (parent && !seen.has(parent)) {
        if (parent === id) {
          result.push(node);
          break;
        }
        seen.add(parent);
        parent = this.nodes.get(parent)?.parentId ?? null;
      }
    }
    return result;
  }
}