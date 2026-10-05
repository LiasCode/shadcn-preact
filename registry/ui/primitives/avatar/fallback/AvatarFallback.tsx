import { useEffect, useState } from "preact/hooks";

import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTimeout } from "../../internals/useTimeout";
import type { AvatarRootState } from "../root/AvatarRoot";
import { useAvatarRootContext } from "../root/AvatarRootContext";
import { avatarStateAttributesMapping } from "../root/stateAttributesMapping";

export interface AvatarFallbackState extends AvatarRootState {}

export interface AvatarFallbackProps extends BaseUIComponentProps<"span", AvatarFallbackState> {
  delay?: number;
}

export function AvatarFallback(componentProps: AvatarFallbackProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    delay,
    ...elementProps
  } = componentProps;
  const { imageLoadingStatus } = useAvatarRootContext();
  const [delayPassed, setDelayPassed] = useState(delay === undefined);
  const timeout = useTimeout();
  useEffect(() => {
    if (delay !== undefined) {
      timeout.start(delay, () => setDelayPassed(true));
    } else {
      setDelayPassed(true);
    }

    return timeout.clear;
  }, [timeout, delay]);
  return useRenderElement("span", componentProps, {
    state: { imageLoadingStatus },
    ref,
    props: elementProps,
    stateAttributesMapping: avatarStateAttributesMapping,
    enabled: imageLoadingStatus !== "loaded" && (delay === undefined || delayPassed),
  });
}

export declare namespace AvatarFallback {
  type Props = AvatarFallbackProps;

  type State = AvatarFallbackState;
}
