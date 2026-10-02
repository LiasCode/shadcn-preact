import { render } from "preact";
import { useState } from "preact/hooks";

import { DirectionProvider } from "../../registry/ui/primitives/direction-provider";
import { FloatingFocusManager } from "../../registry/ui/primitives/internals/FloatingFocusManager";
import { FloatingPortal } from "../../registry/ui/primitives/internals/FloatingPortal";
import { FloatingTree, FloatingNode, useFloatingNodeId } from "../../registry/ui/primitives/internals/FloatingTree";
import { useAnchorPositioning } from "../../registry/ui/primitives/internals/useAnchorPositioning";
import { useDismiss } from "../../registry/ui/primitives/internals/useDismiss";
import { useFloatingRootContext } from "../../registry/ui/primitives/internals/useFloatingRootContext";
import { useScrollLock } from "../../registry/ui/primitives/internals/useScrollLock";

function Overlay({ name, modal = false, nested = false }: { name: string; modal?: boolean; nested?: boolean }) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState<HTMLButtonElement | null>(null);
  const [floating, setFloating] = useState<HTMLDivElement | null>(null);
  const [backdrop, setBackdrop] = useState<HTMLDivElement | null>(null);
  const id = useFloatingNodeId();
  const context = useFloatingRootContext({
    open,
    nodeId: id,
    elements: { reference, floating },
    onOpenChange(next) {
      setOpen(next);
    },
  });
  useDismiss(context, { outsidePressEvent: "intentional" });
  useScrollLock(open && modal, reference);
  const position = useAnchorPositioning({
    mounted: open,
    anchor: reference,
    side: "bottom",
    sideOffset: 8,
    collisionAvoidance: { side: "flip", align: "shift" },
    floatingRootContext: context,
  });
  return (
    <FloatingNode id={id}>
      <button ref={setReference} data-trigger={name} onClick={() => setOpen(!open)}>
        Open {name}
      </button>
      {open && (
        <FloatingPortal>
          {modal && (
            <div ref={setBackdrop} data-backdrop={name} style={{ position: "fixed", inset: 0, background: "#0005" }} />
          )}
          <FloatingFocusManager context={context} modal={modal} restoreFocus getInsideElements={() => [backdrop]}>
            <div
              ref={position.refs.setFloating}
              style={
                modal
                  ? { position: "fixed", top: "25%", left: "50%", transform: "translateX(-50%)" }
                  : position.positionerStyles
              }
            >
              <div
                role="dialog"
                aria-label={name}
                ref={setFloating}
                data-popup={name}
                data-side={position.physicalSide}
                style={{
                  background: "white",
                  border: "1px solid #999",
                  borderRadius: 10,
                  padding: 20,
                  minWidth: 160,
                  maxWidth: "calc(100vw - 48px)",
                  boxShadow: "0 8px 32px #0003",
                }}
              >
                <h2>{name}</h2>
                <button data-first={name}>First</button>
                {nested && <Overlay name="child" modal />}
                <label>
                  Text <input />
                </label>
                <button data-last={name} onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FloatingNode>
  );
}
function Positioning() {
  const [reference, setReference] = useState<HTMLButtonElement | null>(null);
  const position = useAnchorPositioning({
    mounted: true,
    anchor: reference,
    side: "inline-start",
    align: "start",
    sideOffset: 8,
    collisionAvoidance: { side: "flip", align: "shift" },
  });
  return (
    <>
      <button ref={setReference} id="position-anchor" style={{ position: "fixed", right: 4, bottom: 4 }}>
        RTL anchor
      </button>
      <FloatingPortal>
        <div
          id="position-popup"
          ref={position.refs.setFloating}
          data-physical={position.physicalSide}
          data-logical={position.side}
          style={{ ...position.positionerStyles, width: 160, height: 80, background: "#eef", border: "1px solid #99c" }}
        >
          RTL / collision
        </div>
      </FloatingPortal>
    </>
  );
}
if (typeof window !== "undefined") {
  const style = window.document.createElement("style");
  style.textContent =
    "body{font:16px system-ui;margin:32px;min-height:180vh}button,input{font:inherit;padding:8px;margin:4px}label{display:block}h2{font-size:18px}";
  window.document.head.append(style);
  render(
    <FloatingTree>
      <h1>Floating infrastructure</h1>
      <button id="before">Before</button>
      <Overlay name="modal" modal nested />
      <Overlay name="popover" />
      <button id="after">After</button>
      <DirectionProvider direction="rtl">
        <Positioning />
      </DirectionProvider>
      <p>This development fixture is excluded from the site build.</p>
    </FloatingTree>,
    window.document.querySelector("#fixture")!,
  );
}