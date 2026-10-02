import { useState } from "preact/hooks";

import { createChangeEventDetails, type BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { useControlled } from "../../internals/useControlled";
import { useBaseUiId } from "../../internals/useId";
import { useStableCallback } from "../../internals/useStableCallback";
import { useTransitionStatus } from "../../internals/useTransitionStatus";
export interface UseCollapsibleRootParameters {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean, details: BaseUIChangeEventDetails<"trigger-press" | "none">) => void;
}
export function useCollapsibleRoot(parameters: UseCollapsibleRootParameters) {
  const { open: openProp, defaultOpen = false, disabled = false, onOpenChange } = parameters;
  const [open, setOpen] = useControlled({ controlled: openProp, default: defaultOpen, name: "Collapsible" });
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open, true, true);
  const defaultPanelId = useBaseUiId();
  const [panelIdState, setPanelIdState] = useState<string>();
  const handleTrigger = useStableCallback((event: Event) => {
    const details = createChangeEventDetails("trigger-press", event);
    onOpenChange?.(!open, details);
    if (!details.isCanceled) setOpen(!open);
  });
  return {
    open,
    disabled,
    mounted,
    setMounted,
    transitionStatus,
    panelId: panelIdState ?? defaultPanelId,
    setPanelIdState,
    setOpen,
    handleTrigger,
  };
}