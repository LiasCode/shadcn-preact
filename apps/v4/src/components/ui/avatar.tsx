import type { HTMLAttributes, ImgHTMLAttributes } from "preact";
import { createContext, forwardRef, useContext, useEffect, useLayoutEffect, useState } from "preact/compat";
import { cn } from "./share/cn";

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

const AvatarCtx = createContext<{
  status: ImageLoadingStatus;
  changeStatus: (s: ImageLoadingStatus) => void;
} | null>(null);

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, forwardedRef) => {
  const [imgStatus, setImgStatus] = useState<ImageLoadingStatus>("idle");

  const changeImgStatus = (s: ImageLoadingStatus) => setImgStatus(s);

  return (
    <AvatarCtx.Provider value={{ status: imgStatus, changeStatus: changeImgStatus }}>
      <div
        ref={forwardedRef}
        data-slot="avatar"
        className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      />
    </AvatarCtx.Provider>
  );
});

type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ onLoadingStatusChange, className, ...props }, forwardedRef) => {
    const { status, changeStatus } = useAvatar();
    const loadingStatus = useImageLoadingStatus(props.src as string, {
      crossOrigin: props.crossOrigin,
      referrerPolicy: props.crossOrigin as string,
    });

    useEffect(() => {
      changeStatus(loadingStatus);
      onLoadingStatusChange?.(loadingStatus);
    }, [loadingStatus, changeStatus, onLoadingStatusChange]);

    return status === "loaded" ? (
      <img
        ref={forwardedRef}
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        {...props}
        alt={props.alt}
      />
    ) : null;
  }
);

type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  delayMs?: number;
};

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ delayMs, className, ...props }, forwardedRef) => {
    const { status } = useAvatar();
    const [canRender, setCanRender] = useState(delayMs === undefined);

    useEffect(() => {
      if (delayMs === undefined) return;

      const timerId = setTimeout(() => setCanRender(true), delayMs);
      return () => clearTimeout(timerId);
    }, [delayMs]);

    return canRender && status !== "loaded" ? (
      <span
        ref={forwardedRef}
        data-slot="avatar-fallback"
        className={cn("flex size-full items-center justify-center rounded-full bg-muted", className)}
        {...props}
      />
    ) : null;
  }
);

type useImageLoadingStatusOptions = {
  referrerPolicy: string;
  crossOrigin: ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
};
function useImageLoadingStatus(src: string | undefined, { referrerPolicy, crossOrigin }: useImageLoadingStatusOptions) {
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>("idle");

  useLayoutEffect(() => {
    if (!src) {
      setLoadingStatus("error");
      return;
    }

    let isMounted = true;
    const image = new Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) return;
      setLoadingStatus(status);
    };

    setLoadingStatus("loading");

    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("error");

    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }

    if (typeof crossOrigin === "string") {
      image.crossOrigin = crossOrigin;
    }

    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src, referrerPolicy, crossOrigin]);

  return loadingStatus;
}

function useAvatar() {
  const c = useContext(AvatarCtx);
  if (!c) throw new Error("useAvatar should be used inside of an AvatarContextProvider");
  return c;
}

export { Avatar, AvatarFallback, AvatarImage };
