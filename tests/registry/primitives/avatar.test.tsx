import { expect, test } from "bun:test";

import { Avatar } from "@registry/ui/primitives/avatar";
import { useState } from "preact/hooks";

import { act, fire, render, settle } from "../../utils";

test("avatar keeps the fallback while loading and switches to the loaded image", async () => {
  const image = document.createElement("img");
  const restoreImage = mockImages(() => image);
  const statuses: string[] = [];

  try {
    const container = render(
      <Avatar.Root>
        <Avatar.Image
          src="/avatar.png"
          alt="Profile"
          onLoadingStatusChange={(status) => statuses.push(status)}
        />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(container.textContent).toBe("AB");

    expect(container.querySelector("img")).toBeNull();

    fire(image, new Event("load"));

    await settle();

    expect(container.querySelector("img")?.getAttribute("src")).toBe("/avatar.png");

    expect(container.querySelector("img")?.getAttribute("alt")).toBe("Profile");

    expect(container.textContent).toBe("");

    expect(statuses).toEqual(["loading", "loaded"]);
  } finally {
    restoreImage();
  }
});

test("avatar shows the fallback when the image fails", () => {
  const image = document.createElement("img");
  const restoreImage = mockImages(() => image);
  const statuses: string[] = [];

  try {
    const container = render(
      <Avatar.Root>
        <Avatar.Image
          src="/missing.png"
          onLoadingStatusChange={(status) => statuses.push(status)}
        />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
    );
    fire(image, new Event("error"));

    expect(statuses).toEqual(["loading", "error"]);

    expect(container.textContent).toBe("AB");

    expect(container.querySelector("img")).toBeNull();
  } finally {
    restoreImage();
  }
});

test("a delayed fallback appears only after its delay", async () => {
  const container = render(
    <Avatar.Root>
      <Avatar.Fallback delay={20}>AB</Avatar.Fallback>
    </Avatar.Root>,
  );
  expect(container.textContent).toBe("");

  await settle(40);

  expect(container.textContent).toBe("AB");
});

test("late load events from an old source cannot replace the current fallback", () => {
  const images: HTMLImageElement[] = [];
  const restoreImage = mockImages(() => {
    const image = document.createElement("img");
    images.push(image);
    return image;
  });

  try {
    // Changing the component's source tears down the old preloader.
    const source = { current: "/first.png" };

    let rerender: () => void = () => {};

    function Subject() {
      const [, setVersion] = useState(0);
      rerender = () => setVersion((version) => version + 1);
      return (
        <Avatar.Root>
          <Avatar.Image src={source.current} />
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      );
    }

    const container = render(<Subject />);
    source.current = "/second.png";
    act(rerender);

    expect(images.length).toBe(2);

    fire(images[0]!, new Event("load"));

    expect(container.querySelector("img")).toBeNull();

    expect(container.textContent).toBe("AB");
  } finally {
    restoreImage();
  }
});

// happy-dom marks unrequested images complete. Preloaders stay pending until the test dispatches load/error.
function mockImages(create: () => HTMLImageElement) {
  const previousImage = window.Image;
  Object.defineProperty(window, "Image", {
    configurable: true,
    value: function Image() {
      const image = create();
      Object.defineProperty(image, "complete", { value: false });
      return image;
    },
  });
  return () => Object.defineProperty(window, "Image", { configurable: true, value: previousImage });
}
