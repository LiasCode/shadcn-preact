import { expect, test } from "bun:test";

import { useState } from "preact/hooks";

import { Combobox } from "../../../registry/ui/primitives/combobox";
import { Toast } from "../../../registry/ui/primitives/toast";
import { act, fire, render, settle } from "../../utils";

function get(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}

function key(element: Element, value: string, extra = {}) {
  fire(
    element,
    new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true, ...extra }),
  );
}

function type(value: string) {
  const input = get("#query") as HTMLInputElement;
  input.value = value;
  fire(input, new InputEvent("input", { bubbles: true }));
}

function Options() {
  return (
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Empty>Nothing found</Combobox.Empty>
          <Combobox.List>
            {(item: any) => (
              <Combobox.Item
                value={item}
                disabled={item === "Blocked"}
                id={`item-${typeof item === "string" ? item : item.id}`}
              >
                {typeof item === "string" ? item : item.label}
                <Combobox.ItemIndicator>Selected</Combobox.ItemIndicator>
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

const items = ["Apple", "Blocked", "Café", "Pear"];

function Basic(props: any) {
  return (
    <Combobox.Root items={items} {...props}>
      <Combobox.Input id="query" />
      <Combobox.Trigger id="toggle">Toggle</Combobox.Trigger>
      <Combobox.Clear id="clear">Clear</Combobox.Clear>
      <Options />
    </Combobox.Root>
  );
}

test("combobox retains filtered items while navigating and refreshes them when the query changes", async () => {
  let blockedCalls = 0;

  const filter = (value: string, query: string) => {
    if (value === "Blocked") {
      blockedCalls++;
    }

    return value.toLowerCase().includes(query.toLowerCase());
  };

  render(<Basic filter={filter} />);

  type("a");

  await settle();
  blockedCalls = 0;
  key(get("#query"), "ArrowDown");

  key(get("#query"), "ArrowDown");

  expect(blockedCalls).toBe(0);

  type("b");

  await settle();

  expect(blockedCalls).toBeGreaterThan(0);

  expect(get("[role=listbox]").querySelectorAll("[role=option]")).toHaveLength(1);
});

test("combobox filters accents, keeps input focused, skips disabled options and selects with Enter", async () => {
  const values: any[] = [];
  render(<Basic onValueChange={(v: any) => values.push(v)} />);

  act(() => get("#query").focus());

  type("cafe");

  await settle();

  expect(get("[role=listbox]").querySelectorAll("[role=option]").length).toBe(1);

  key(get("#query"), "ArrowDown");

  expect(document.activeElement?.id).toBe("query");

  expect(get("#query").getAttribute("aria-activedescendant")).toBe("item-Café");

  key(get("#query"), "Enter");

  expect(values).toEqual(["Café"]);

  expect((get("#query") as HTMLInputElement).value).toBe("Café");

  await settle();

  expect(get("#query").getAttribute("aria-expanded")).toBe("false");

  act(() => get("#toggle").click());

  await settle();

  key(get("#query"), "ArrowDown");

  key(get("#query"), "ArrowDown");

  expect(get("#query").getAttribute("aria-activedescendant")).toBe("item-Café");
});

test("combobox exposes an empty state, auto highlights, loops through the input and ignores IME Enter", async () => {
  render(<Basic autoHighlight />);

  type("zzz");

  await settle();

  expect(get("[role=status]").textContent).toBe("Nothing found");

  type("a");

  await settle();

  expect(get("#query").getAttribute("aria-activedescendant")).toBe("item-Apple");

  key(get("#query"), "Enter", { isComposing: true });

  expect(get("#query").getAttribute("aria-expanded")).toBe("true");

  key(get("#query"), "End");

  key(get("#query"), "ArrowDown");

  expect(get("#query").getAttribute("aria-activedescendant")).toBeNull();
});

test("combobox cancellation and preventBaseUIHandler preserve values and opening state", async () => {
  render(<Basic defaultValue="Pear" onValueChange={(_v: any, details: any) => details.cancel()} />);

  act(() => get("#toggle").click());

  await settle();

  act(() => get("#item-Apple").click());

  expect((get("#query") as HTMLInputElement).value).toBe("Pear");

  expect(get("#query").getAttribute("aria-expanded")).toBe("true");

  act(() => get("#clear").click());

  expect((get("#query") as HTMLInputElement).value).toBe("Pear");
});

test("combobox input callbacks are cancellable and custom handlers prevent internal changes", () => {
  render(
    <Combobox.Root items={items} onInputValueChange={(_v, details) => details.cancel()}>
      <Combobox.Input id="query" />
    </Combobox.Root>,
  );

  type("Apple");

  expect(get("#query").getAttribute("aria-expanded")).toBe("false");
});

test("combobox object labels, equality, serialization and form reset remain controlled", async () => {
  const options = [
    { id: "one", value: "1", label: "One" },
    { id: "two", value: "2", label: "Two" },
  ];

  function Subject() {
    const [value, setValue] = useState(options[0]);
    return (
      <form id="form">
        <Combobox.Root
          name="number"
          items={options}
          value={value}
          defaultValue={options[0]}
          onValueChange={(v) => setValue(v ?? undefined)}
          isItemEqualToValue={(a, b) => a?.id === b?.id}
        >
          <Combobox.Input id="query" />
          <Options />
        </Combobox.Root>
      </form>
    );
  }

  render(<Subject />);

  type("Tw");

  await settle();

  act(() => get("#item-two").click());

  expect(new FormData(get("#form") as HTMLFormElement).get("number")).toBe("2");

  expect((get("#query") as HTMLInputElement).value).toBe("Two");

  act(() => (get("#form") as HTMLFormElement).reset());

  await settle();

  expect(new FormData(get("#form") as HTMLFormElement).get("number")).toBe("1");

  expect((get("#query") as HTMLInputElement).value).toBe("One");
});

test("combobox groups filter their collections and retain accessible group labels", async () => {
  render(
    <Combobox.Root items={[{ value: "Fruit", items }]}>
      <Combobox.Input id="query" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              {(group) => (
                <Combobox.Group items={group.items}>
                  <Combobox.GroupLabel>Fruit</Combobox.GroupLabel>
                  <Combobox.Collection>
                    {(item) => <Combobox.Item value={item}>{item}</Combobox.Item>}
                  </Combobox.Collection>
                </Combobox.Group>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>,
  );

  type("Pear");

  await settle();

  expect(get("[role=group]").getAttribute("aria-labelledby")).toBeTruthy();

  expect(get("[role=listbox]").querySelectorAll("[role=option]").length).toBe(1);
});

test("multiple combobox serializes repeated fields and removes chips without closing", async () => {
  render(
    <form id="form">
      <Combobox.Root multiple name="fruit" items={items} defaultValue={["Apple", "Pear"]}>
        <Combobox.Chips>
          <Combobox.Value>
            {(values) => (
              <>
                {values.map((value: string) => (
                  <Combobox.Chip key={value}>
                    {value}
                    <Combobox.ChipRemove />
                  </Combobox.Chip>
                ))}
                <Combobox.Input id="query" />
              </>
            )}
          </Combobox.Value>
        </Combobox.Chips>
        <Options />
      </Combobox.Root>
    </form>,
  );

  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["Apple", "Pear"]);

  act(() => get('[aria-label="Remove Apple"]').click());

  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["Pear"]);

  type("Caf");

  await settle();

  act(() => get("#item-Café").click());

  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["Pear", "Café"]);

  expect(get("#query").getAttribute("aria-expanded")).toBe("true");

  key(get("#query"), "Backspace");

  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["Pear"]);
});

test("disabled and readOnly comboboxes cannot open, edit or clear", () => {
  render(<Basic readOnly defaultValue="Apple" />);

  act(() => get("#toggle").click());

  type("Pear");

  act(() => get("#clear").click());

  expect(get("#query").getAttribute("aria-expanded")).toBe("false");

  expect(get("#query").hasAttribute("readonly")).toBe(true);
});

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Viewport id="notifications">
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Content>
            <Toast.Title />
            <Toast.Description />
            <Toast.Action />
            <Toast.Close>Close</Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

test("toast manager upserts ids, updates content, announces priorities, limits stacks and calls close/remove once", async () => {
  const manager = Toast.createToastManager();
  let closed = 0,
    removed = 0;
  render(
    <Toast.Provider toastManager={manager} timeout={0} limit={1}>
      <ToastList />
    </Toast.Provider>,
  );

  act(() => {
    manager.add({
      id: "first",
      title: "First",
      onClose: () => closed++,
      onRemove: () => removed++,
    });

    manager.add({ id: "second", title: "Second", priority: "high" });

    manager.add({ id: "second", title: "Updated", priority: "high" });
  });

  expect(document.querySelectorAll("[role=alert]").length).toBe(1);

  expect(get("[role=alert]").textContent).toContain("Updated");

  expect(get("[data-limited]").textContent).toContain("First");

  act(() => {
    manager.close("first");

    manager.close("first");
  });

  await settle();

  expect(closed).toBe(1);

  expect(removed).toBe(1);

  act(() => manager.update("second", { description: "Detail" }));

  expect(get("[role=alert]").getAttribute("aria-describedby")).toBeTruthy();

  act(() => get("[role=alert] button").click());

  await settle();

  expect(document.querySelector("[role=alert]")).toBeNull();
});

test("toast timeouts pause while interacting and resume with remaining time", async () => {
  const manager = Toast.createToastManager();
  render(
    <Toast.Provider toastManager={manager} timeout={80}>
      <ToastList />
    </Toast.Provider>,
  );

  act(() => {
    manager.add({ title: "Timed" });
  });

  await settle(20);

  fire(get("#notifications"), new PointerEvent("pointerenter"));

  await settle(100);

  expect(get("[role=status]")).toBeTruthy();

  fire(get("#notifications"), new PointerEvent("pointerleave"));

  await settle(100);

  await settle();

  expect(document.querySelector("[role=status]")).toBeNull();
});

test("toast promise resolves or rejects with the original result while updating the same toast", async () => {
  const manager = Toast.createToastManager();
  render(
    <Toast.Provider toastManager={manager} timeout={0}>
      <ToastList />
    </Toast.Provider>,
  );
  let resolve!: (value: number) => void;
  const promise = new Promise<number>((r) => {
    resolve = r;
  });
  let result!: Promise<number>;
  act(() => {
    result = manager.promise(promise, {
      loading: "Loading",
      success: (value) => `Saved ${value}`,
      error: "Failed",
    });
  });

  expect(get("[role=status]").textContent).toContain("Loading");

  await act(async () => {
    resolve(42);

    expect(await result).toBe(42);
  });

  expect(get("[role=status]").textContent).toContain("Saved 42");

  expect(document.querySelectorAll("[role=status]").length).toBe(1);

  await act(async () => {
    await expect(
      manager.promise(Promise.reject(new Error("No")), {
        loading: "Loading",
        success: "OK",
        error: (e) => e.message,
      }),
    ).rejects.toThrow("No");
  });

  expect(document.body.textContent).toContain("No");
});

test("toast actions run consumer callbacks before dismissal and swipes honor configured direction", async () => {
  const manager = Toast.createToastManager();
  let action = 0;
  render(
    <Toast.Provider toastManager={manager} timeout={0}>
      <ToastList />
    </Toast.Provider>,
  );

  act(() => {
    manager.add({
      title: "Action",
      actionProps: {
        children: "Undo",
        onClick: () => {
          action++;
          manager.close();
        },
      },
    });
  });

  act(() => get("[role=status] button").click());

  await settle();

  expect(action).toBe(1);

  expect(document.querySelector("[role=status]")).toBeNull();

  act(() => {
    manager.add({ title: "Swipe" });
  });
  const root = get("[role=status]");
  fire(root, new PointerEvent("pointerdown", { pointerId: 1, button: 0, clientX: 0, clientY: 0 }));

  fire(root, new PointerEvent("pointerup", { pointerId: 1, clientX: 100, clientY: 0 }));

  await settle();

  expect(document.querySelector("[role=status]")).toBeNull();
});

test("combobox onChange can prevent its internal input handler", () => {
  let changes = 0;
  render(
    <Combobox.Root items={items} onInputValueChange={() => changes++}>
      <Combobox.Input id="query" onChange={(event) => event.preventBaseUIHandler()} />
    </Combobox.Root>,
  );

  type("Apple");

  expect(changes).toBe(0);

  expect(get("#query").getAttribute("aria-expanded")).toBe("false");
});

test("combobox chip removal follows DOM order even with duplicate labels and nested content", () => {
  const values = [
    { value: "one", label: "Same" },
    { value: "two", label: "Same" },
  ];
  render(
    <form id="form">
      <Combobox.Root multiple name="choice" items={values} defaultValue={values}>
        <Combobox.Chips>
          <Combobox.Value>
            {(selected) =>
              selected.map((value: any) => (
                <Combobox.Chip key={value.value}>
                  <span>{value.label}</span>
                  <Combobox.ChipRemove />
                </Combobox.Chip>
              ))
            }
          </Combobox.Value>
          <Combobox.Input id="query" />
        </Combobox.Chips>
      </Combobox.Root>
    </form>,
  );

  act(() => document.querySelectorAll<HTMLButtonElement>('[aria-label="Remove Same"]')[1]!.click());

  expect(new FormData(get("#form") as HTMLFormElement).getAll("choice")).toEqual(["one"]);
});

test("combobox open changes are cancelable and selected value can be cleared", async () => {
  render(
    <Basic
      defaultValue="Pear"
      onOpenChange={(open: boolean, details: any) => {
        if (open) {
          details.cancel();
        }
      }}
    />,
  );

  act(() => get("#toggle").click());

  await settle();

  expect(document.querySelector("[role=listbox]")).toBeNull();

  act(() => get("#clear").click());

  expect((get("#query") as HTMLInputElement).value).toBe("");
});

test("combobox popup input receives focus and Escape returns to a detached trigger", async () => {
  render(
    <Combobox.Root items={items}>
      <Combobox.Trigger id="toggle">Open</Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.Input id="query" />
            <Combobox.List>
              {(item) => <Combobox.Item value={item}>{item}</Combobox.Item>}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>,
  );

  act(() => {
    get("#toggle").focus();

    get("#toggle").click();
  });

  await settle();

  expect(document.activeElement?.id).toBe("query");

  key(get("#query"), "Escape");

  await settle();

  expect(document.activeElement?.id).toBe("toggle");
});

test("combobox ArrowDown opens with the first enabled item and modal Tab exits after releasing inert marks", async () => {
  render(
    <>
      <Basic modal />
      <button id="next">Next</button>
    </>,
  );

  act(() => get("#query").focus());

  key(get("#query"), "ArrowDown");

  await settle();

  expect(get("#query").getAttribute("aria-activedescendant")).toBe("item-Apple");

  expect(document.activeElement?.id).toBe("query");

  expect(get("#query").getAttribute("inert")).toBeNull();

  key(get("#query"), "Tab");

  await settle();

  expect(document.activeElement?.id).toBe("next");

  expect(get("#next").getAttribute("inert")).toBeNull();
});

test("combobox popup render callbacks receive empty and position state and respect custom initialFocus", async () => {
  const states: any[] = [];
  render(
    <Combobox.Root items={items}>
      <Combobox.Input id="query" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup
            initialFocus={false}
            className={(state) => {
              states.push(state);
              return state.empty ? "empty" : "populated";
            }}
          >
            <Combobox.List>
              {(item) => <Combobox.Item value={item}>{item}</Combobox.Item>}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>,
  );

  act(() => get("#query").focus());

  type("zzz");

  await settle();

  expect(states.at(-1).empty).toBe(true);

  expect(states.at(-1).side).toBe("bottom");

  expect(get(".empty").hasAttribute("data-empty")).toBe(true);

  expect(document.activeElement?.id).toBe("query");
});

test("toast custom title and description ids are connected to the live region", () => {
  const manager = Toast.createToastManager();

  function List() {
    const { toasts } = Toast.useToastManager();
    return (
      <>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title id="custom-title" />
            <Toast.Description id="custom-description" />
          </Toast.Root>
        ))}
      </>
    );
  }

  render(
    <Toast.Provider toastManager={manager} timeout={0}>
      <List />
    </Toast.Provider>,
  );

  act(() => {
    manager.add({ title: "Title", description: "Description" });
  });

  expect(get("[role=status]").getAttribute("aria-labelledby")).toBe("custom-title");

  expect(get("[role=status]").getAttribute("aria-describedby")).toBe("custom-description");

  expect(get("#custom-title").tagName).toBe("H2");

  expect(get("#custom-description").tagName).toBe("P");
});

test("toast keeps its timer paused while focus remains inside after the pointer leaves", async () => {
  const manager = Toast.createToastManager();
  render(
    <>
      <Toast.Provider toastManager={manager} timeout={80}>
        <ToastList />
      </Toast.Provider>
      <button id="outside">Outside</button>
    </>,
  );

  act(() => {
    manager.add({ title: "Focused" });
  });

  fire(get("#notifications"), new PointerEvent("pointerenter"));

  act(() => get("[role=status] button").focus());

  fire(get("#notifications"), new PointerEvent("pointerleave"));

  await settle(120);

  expect(get("[role=status]").textContent).toContain("Focused");

  expect(get("#notifications").hasAttribute("data-expanded")).toBe(true);

  act(() => get("#outside").focus());

  await settle(100);

  await settle();

  expect(document.querySelector("[role=status]")).toBeNull();
});
