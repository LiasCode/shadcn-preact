import { useBaseUiId } from "./useId";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";

export function useRegisteredLabelId(
  idProp: string | undefined,
  setLabelId: (id: string | undefined) => void,
) {
  const id = useBaseUiId(idProp);
  useIsoLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);
  return id;
}
