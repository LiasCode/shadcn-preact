import { useRef, useState, useEffect } from "preact/hooks";

import { createChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { AnimationFrame } from "../../internals/useAnimationFrame";
import { useAnimationsFinished } from "../../internals/useAnimationsFinished";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useStableCallback } from "../../internals/useStableCallback";
import type { CollapsibleContext } from "../root/CollapsibleRootContext";

export function useCollapsiblePanel(
  context: CollapsibleContext,
  hiddenUntilFound: boolean,
  keepMounted: boolean,
) {
  const { open, mounted, setMounted, transitionStatus } = context;
  const panelRef = useRef<HTMLElement | null>(null);
  const initialOpen = useRef(open);
  const skipMotion = useRef(false);
  const [dimensions, setDimensions] = useState<{ height?: number; width?: number }>({});
  const latestOpen = useRef(open);
  latestOpen.current = open;
  const runFinished = useAnimationsFinished(panelRef, open, false);
  useIsoLayoutEffect(() => {
    const panel = panelRef.current;

    if (!panel || typeof window === "undefined") {
      return undefined;
    }

    if (!open) {
      initialOpen.current = false;
      skipMotion.current = false;
    }

    const styles = panel.ownerDocument.defaultView!.getComputedStyle(panel);
    const animated = [styles.animationDuration, styles.transitionDuration].some((value) =>
      value.split(",").some((part) => Number.parseFloat(part) > 0),
    );

    if (open || mounted) {
      setDimensions({ height: panel.scrollHeight, width: panel.scrollWidth });
    }

    if (!open && mounted && !animated) {
      setMounted(false);
    }

    return undefined;
  }, [open, mounted, transitionStatus, setMounted]);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    if (!open && transitionStatus !== "ending") {
      return undefined;
    }

    const controller = new AbortController();
    const frame = AnimationFrame.request(() =>
      runFinished(() => {
        if (latestOpen.current) {
          setDimensions({});
        } else {
          setMounted(false);

          setDimensions({});
        }
      }, controller.signal),
    );
    return () => {
      controller.abort();

      AnimationFrame.cancel(frame);
    };
  }, [open, mounted, transitionStatus, runFinished, setMounted]);
  const beforeMatch = useStableCallback((event: Event) => {
    const details = createChangeEventDetails("none", event);
    context.onOpenChange?.(true, details);

    if (!details.isCanceled) {
      skipMotion.current = true;
      context.setOpen(true);
    }
  });
  useIsoLayoutEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return undefined;
    }

    panel.addEventListener("beforematch", beforeMatch);
    return () => panel.removeEventListener("beforematch", beforeMatch);
  }, [beforeMatch, open, mounted, keepMounted, hiddenUntilFound]);
  const hidden = !open && !mounted;
  useIsoLayoutEffect(() => {
    if (hidden && hiddenUntilFound) {
      panelRef.current?.setAttribute("hidden", "until-found");
    }

    return undefined;
  }, [hidden, hiddenUntilFound]);
  return {
    panelRef,
    dimensions,
    shouldRender: open || mounted || keepMounted || hiddenUntilFound,
    props: {
      hidden: hidden ? (hiddenUntilFound ? "until-found" : true) : undefined,
      id: context.panelId,
    },
    suppressAnimation: open && (initialOpen.current || skipMotion.current),
  };
}
