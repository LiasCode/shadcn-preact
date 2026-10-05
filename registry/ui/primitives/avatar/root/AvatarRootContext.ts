import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

export interface AvatarRootContextValue {
  imageLoadingStatus: ImageLoadingStatus;
  setImageLoadingStatus: (status: ImageLoadingStatus) => void;
}

export const AvatarRootContext = createContext<AvatarRootContextValue | undefined>(undefined);

export function useAvatarRootContext() {
  const context = useContext(AvatarRootContext);

  if (!context) {
    throw new Error("Base UI: Avatar parts must be placed within <Avatar.Root>.");
  }

  return context;
}
