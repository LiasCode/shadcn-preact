import { expect, test } from "bun:test";

import { useTransitionStatus } from "@registry/ui/primitives/internals/useTransitionStatus";
import { useState } from "preact/hooks";

import { act, render, settle } from "../../../utils";

test("starts on open, settles, ends while closing, and resets once unmounted", async () => {
  const log: string[] = [];

  let setOpen: (open: boolean) => void = () => {};

  let api!: ReturnType<typeof useTransitionStatus>;

  function Subject() {
    const [open, set] = useState(false);
    setOpen = set;
    api = useTransitionStatus(open);
    log.push(`${open}:${api.mounted}:${api.transitionStatus}`);
    return null;
  }

  render(<Subject />);

  act(() => setOpen(true));

  expect(api.mounted).toBe(true);

  expect(log).toContain("true:true:starting");

  await settle();

  expect(api.transitionStatus).toBeUndefined();

  act(() => setOpen(false));

  expect(api.transitionStatus).toBe("ending");

  expect(api.mounted).toBe(true);

  act(() => api.setMounted(false));

  expect(api.mounted).toBe(false);

  expect(api.transitionStatus).toBeUndefined();
});
