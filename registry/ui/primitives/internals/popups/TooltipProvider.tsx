import { createContext, type ComponentChildren } from "preact";
import { useContext, useMemo, useRef } from "preact/hooks";
interface ProviderContext {
  delay: number;
  closeDelay: number;
  activate(id: string, close: () => void): void;
  deactivate(id: string): void;
  resolveDelay(id: string, delay: number): number;
}
const defaultContext: ProviderContext = {
  delay: 600,
  closeDelay: 0,
  activate() {},
  deactivate() {},
  resolveDelay(_, delay) {
    return delay;
  },
};
const TooltipContext = createContext<ProviderContext>(defaultContext);
export interface TooltipProviderProps {
  children?: ComponentChildren;
  delay?: number;
  closeDelay?: number;
  timeout?: number;
  "data-slot"?: string;
}
export function TooltipProvider({ children, delay = 600, closeDelay = 0, timeout = 400 }: TooltipProviderProps) {
  const active = useRef<{ id: string; close: () => void } | null>(null);
  const closedAt = useRef(-Infinity);
  const context = useMemo(
    () => ({
      delay,
      closeDelay,
      activate(id: string, close: () => void) {
        if (active.current?.id !== id) active.current?.close();
        active.current = { id, close };
      },
      deactivate(id: string) {
        if (active.current?.id === id) {
          active.current = null;
          closedAt.current = Date.now();
        }
      },
      resolveDelay(id: string, requested: number) {
        return (active.current && active.current.id !== id) || Date.now() - closedAt.current <= timeout ? 0 : requested;
      },
    }),
    [delay, closeDelay, timeout],
  );
  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>;
}
export function useTooltipProvider() {
  return useContext(TooltipContext);
}
export namespace TooltipProvider {
  export type Props = TooltipProviderProps;
}