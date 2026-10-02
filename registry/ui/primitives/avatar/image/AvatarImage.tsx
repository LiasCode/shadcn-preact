import { useRef } from "preact/hooks";

import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
import type { BaseUIComponentProps } from "../../internals/types";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useOpenChangeComplete } from "../../internals/useOpenChangeComplete";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";
import type { AvatarRootState, ImageLoadingStatus } from "../root/AvatarRoot";
import { useAvatarRootContext } from "../root/AvatarRootContext";
import { avatarStateAttributesMapping } from "../root/stateAttributesMapping";
import { useImageLoadingStatus } from "./useImageLoadingStatus";

const stateAttributesMapping = { ...avatarStateAttributesMapping, ...transitionStatusMapping };

export interface AvatarImageState extends AvatarRootState {
  transitionStatus: TransitionStatus;
}

export interface AvatarImageProps extends BaseUIComponentProps<"img", AvatarImageState> {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export function AvatarImage(componentProps: AvatarImageProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    onLoadingStatusChange,
    ...elementProps
  } = componentProps;
  const { setImageLoadingStatus } = useAvatarRootContext();
  const imageLoadingStatus = useImageLoadingStatus(elementProps.src, elementProps);
  const isVisible = imageLoadingStatus === "loaded";
  const { mounted, transitionStatus, setMounted } = useTransitionStatus(isVisible);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const handleStatus = useStableCallback((status: ImageLoadingStatus) => {
    onLoadingStatusChange?.(status);
    setImageLoadingStatus(status);
  });
  useIsoLayoutEffect(() => {
    if (imageLoadingStatus !== "idle") handleStatus(imageLoadingStatus);
  }, [imageLoadingStatus, handleStatus]);
  useIsoLayoutEffect(() => () => setImageLoadingStatus("idle"), [setImageLoadingStatus]);
  useOpenChangeComplete({
    open: isVisible,
    ref: imageRef,
    onComplete() {
      if (!isVisible) setMounted(false);
    },
  });
  return useRenderElement("img", componentProps, {
    state: { imageLoadingStatus, transitionStatus },
    ref: [ref ?? null, imageRef],
    props: elementProps,
    stateAttributesMapping,
    enabled: mounted,
  });
}

export declare namespace AvatarImage {
  type Props = AvatarImageProps;
  type State = AvatarImageState;
}