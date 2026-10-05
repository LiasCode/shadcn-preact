import { createContext, type ComponentChildren } from "preact";
import { useContext, useRef } from "preact/hooks";

import { FloatingTreeStore } from "./FloatingTreeStore";
import { useBaseUiId } from "./useId";

const TreeContext = createContext<FloatingTreeStore | null>(null);
const NodeContext = createContext<string | null>(null);

export function FloatingTree({ children }: { children: ComponentChildren }) {
  const tree = useRef(new FloatingTreeStore());
  return <TreeContext.Provider value={tree.current}>{children}</TreeContext.Provider>;
}

export function FloatingNode({ id, children }: { id: string; children: ComponentChildren }) {
  return <NodeContext.Provider value={id}>{children}</NodeContext.Provider>;
}

export function useFloatingTree() {
  return useContext(TreeContext);
}

export function useFloatingParentNodeId() {
  return useContext(NodeContext);
}

export function useFloatingNodeId() {
  return useBaseUiId();
}
