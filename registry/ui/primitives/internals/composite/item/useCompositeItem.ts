import { useCompositeListItem } from "../list/useCompositeListItem";
import { useCompositeRootContext } from "../root/CompositeRootContext";
export function useCompositeItem() {
  const context = useCompositeRootContext()!;
  const { ref, index } = useCompositeListItem();
  return {
    compositeRef: ref,
    index,
    compositeProps: {
      tabIndex: context.highlightedIndex === index ? 0 : -1,
      onFocus() {
        if (index !== -1) context.onHighlightedIndexChange(index);
      },
    },
  };
}