import { createContext } from "preact";
import { useContext } from "preact/hooks";
export type ProgressStatus = "indeterminate" | "progressing" | "complete";
export interface ProgressRootState {
  status: ProgressStatus;
}
export interface ProgressRootContextValue {
  formattedValue: string;
  value: number | null;
  min: number;
  max: number;
  setLabelId: (id: string | undefined) => void;
  state: ProgressRootState;
  status: ProgressStatus;
}
export const ProgressRootContext = createContext<ProgressRootContextValue | undefined>(undefined);
export function useProgressRootContext() {
  const context = useContext(ProgressRootContext);
  if (!context) throw new Error("Base UI: Progress parts must be placed within <Progress.Root>.");
  return context;
}