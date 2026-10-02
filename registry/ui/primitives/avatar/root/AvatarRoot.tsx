import { useMemo, useState } from "preact/hooks";

import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { AvatarRootContext, type ImageLoadingStatus } from "./AvatarRootContext";
import { avatarStateAttributesMapping } from "./stateAttributesMapping";
export type { ImageLoadingStatus } from "./AvatarRootContext";
export interface AvatarRootState {
  imageLoadingStatus: ImageLoadingStatus;
}
export interface AvatarRootProps extends BaseUIComponentProps<"span", AvatarRootState> {}

export function AvatarRoot(componentProps: AvatarRootProps) {
  const { ref, className: _className, render: _render, style: _style, ...elementProps } = componentProps;
  const [imageLoadingStatus, setImageLoadingStatus] = useState<ImageLoadingStatus>("idle");
  const contextValue = useMemo(() => ({ imageLoadingStatus, setImageLoadingStatus }), [imageLoadingStatus]);
  const element = useRenderElement("span", componentProps, {
    state: { imageLoadingStatus },
    ref,
    props: elementProps,
    stateAttributesMapping: avatarStateAttributesMapping,
  });
  return <AvatarRootContext.Provider value={contextValue}>{element}</AvatarRootContext.Provider>;
}

export declare namespace AvatarRoot {
  type Props = AvatarRootProps;
  type State = AvatarRootState;
}