import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
export const collapsibleStateAttributesMapping = {
  open: (value: boolean): Record<string, string> => (value ? { "data-open": "" } : { "data-closed": "" }),
  ...transitionStatusMapping,
};
export const triggerOpenStateMapping = {
  open: (value: boolean): Record<string, string> | null => (value ? { "data-panel-open": "" } : null),
};