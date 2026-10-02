import { useEffect, useState } from "preact/hooks";
/** Match media after hydration so prerendered and hydrated markup agree. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}