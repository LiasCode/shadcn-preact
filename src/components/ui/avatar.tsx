import type { ImgHTMLAttributes } from "preact";
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "preact/compat";
import { cn } from "./share/cn";

export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

export const AvatarContext = createContext<{
  status: ImageLoadingStatus;
  changeStatus: (s: ImageLoadingStatus) => void;
} | null>(null);

export type AvatarProps = HTMLAttributes<HTMLDivElement>;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const [imgStatus, setImgStatus] = useState<ImageLoadingStatus>("idle");

    const changeImgStatus = (s: ImageLoadingStatus) => setImgStatus(s);

    return (
      <AvatarContext.Provider value={{ status: imgStatus, changeStatus: changeImgStatus }}>
        <div
          ref={forwardedRef}
          className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className, classNative)}
          {...props}
        />
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ onLoadingStatusChange, className, class: classNative, ...props }, forwardedRef) => {
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
        className={cn("aspect-square h-full w-full", className, classNative)}
        {...props}
        alt={props.alt}
      />
    ) : null;
  }
);
AvatarImage.displayName = "AvatarImage";

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  delayMs?: number;
};

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ delayMs, className, class: classNative, ...props }, forwardedRef) => {
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
        className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className, classNative)}
        {...props}
      />
    ) : null;
  }
);
AvatarFallback.displayName = "AvatarFallback";

type useImageLoadingStatusOptions = {
  referrerPolicy: string;
  crossOrigin: ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
};
export function useImageLoadingStatus(
  src: string | undefined,
  { referrerPolicy, crossOrigin }: useImageLoadingStatusOptions
) {
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

export function useAvatar() {
  const c = useContext(AvatarContext);
  if (!c) throw new Error("useAvatar should be used inside of an AvatarContextProvider");
  return c;
}
