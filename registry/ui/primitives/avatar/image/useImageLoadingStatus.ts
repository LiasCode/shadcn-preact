import { useState } from "preact/hooks";

import type { ComponentProps } from "../../internals/types";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import type { ImageLoadingStatus } from "../root/AvatarRoot";

export function useImageLoadingStatus(
  src: string | undefined,
  { referrerPolicy, crossOrigin, sizes, srcSet }: ComponentProps<"img">,
) {
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>("idle");

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!src && !srcSet) {
      setLoadingStatus("error");
      return undefined;
    }
    let isMounted = true;
    const image = new window.Image();
    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (isMounted) setLoadingStatus(status);
    };
    setLoadingStatus("loading");
    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("error");
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    image.crossOrigin = crossOrigin ?? null;
    if (sizes) image.sizes = sizes;
    if (srcSet) image.srcset = srcSet;
    if (src) image.src = src;
    if (image.complete) setLoadingStatus(image.naturalWidth > 0 ? "loaded" : "error");
    return () => {
      isMounted = false;
    };
  }, [src, srcSet, sizes, crossOrigin, referrerPolicy]);
  return loadingStatus;
}