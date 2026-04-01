import type { ComponentProps, HTMLAttributes, ImgHTMLAttributes } from "preact";
import { createContext, forwardRef, useContext, useEffect, useLayoutEffect, useState } from "preact/compat";
import { cn } from "./share/cn";

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

const AvatarCtx = createContext<{
  status: ImageLoadingStatus;
  changeStatus: (s: ImageLoadingStatus) => void;
} | null>(null);

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { size?: "default" | "sm" | "lg" }>(
  ({ className, size = "default", ...props }, forwardedRef) => {
    const [imgStatus, setImgStatus] = useState<ImageLoadingStatus>("idle");

    const changeImgStatus = (s: ImageLoadingStatus) => setImgStatus(s);

    return (
      <AvatarCtx.Provider value={{ status: imgStatus, changeStatus: changeImgStatus }}>
        <div
          ref={forwardedRef}
          data-slot="avatar"
          data-size={size}
          className={cn(
            "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
            className
          )}
          {...props}
        />
      </AvatarCtx.Provider>
    );
  }
);

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
        className={cn("aspect-square size-full rounded-full object-cover", className)}
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
        className={cn(
          "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm group-data-[size=sm]/avatar:text-xs",
          className
        )}
        {...props}
      />
    ) : null;
  }
);

const AvatarBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <span
        data-slot="avatar-badge"
        className={cn(
          "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background",
          "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
          "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
          "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
          className
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  }
);

const AvatarGroup = forwardRef<HTMLDivElement, ComponentProps<"div">>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      ref={forwardedRef}
      {...props}
    />
  );
});

const AvatarGroupCount = forwardRef<HTMLDivElement, ComponentProps<"div">>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      ref={forwardedRef}
      {...props}
    />
  );
});

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

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
