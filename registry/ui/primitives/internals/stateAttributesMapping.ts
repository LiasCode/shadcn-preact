import type { TransitionStatus } from "./useTransitionStatus";

export const TransitionStatusDataAttributes = {
  startingStyle: "data-starting-style",
  endingStyle: "data-ending-style",
} as const;

const STARTING_HOOK = { [TransitionStatusDataAttributes.startingStyle]: "" };
const ENDING_HOOK = { [TransitionStatusDataAttributes.endingStyle]: "" };

/** Maps `transitionStatus` to `data-starting-style` and `data-ending-style`. */
export const transitionStatusMapping = {
  transitionStatus(value: TransitionStatus): Record<string, string> | null {
    if (value === "starting") return STARTING_HOOK;
    if (value === "ending") return ENDING_HOOK;
    return null;
  },
};