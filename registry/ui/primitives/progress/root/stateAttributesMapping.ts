import type { ProgressStatus } from "./ProgressRootContext";
export const progressStateAttributesMapping = {
  status(value: ProgressStatus) {
    return { [`data-${value}`]: "" };
  },
};