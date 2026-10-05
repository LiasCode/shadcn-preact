// Adapted from Base UI 1.6.0 floating-ui-react/utils/markOthers (MIT).
// Reference-count attributes so overlapping modal lifetimes restore original values.
const locks = new WeakMap<Element, Map<string, { count: number; original: string | null }>>();

function lock(element: Element, attribute: string, value: string) {
  let attributes = locks.get(element);

  if (!attributes) {
    attributes = new Map();
    locks.set(element, attributes);
  }

  const record = attributes.get(attribute);

  if (record) {
    record.count++;
  } else {
    attributes.set(attribute, { count: 1, original: element.getAttribute(attribute) });

    element.setAttribute(attribute, value);
  }

  let released = false;
  return () => {
    if (released) {
      return;
    }

    released = true;
    const current = attributes.get(attribute);

    if (!current || --current.count) {
      return;
    }

    if (current.original === null) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, current.original);
    }

    attributes.delete(attribute);
  };
}

export function markOthers(
  avoidElements: Element[],
  options: { ariaHidden?: boolean; inert?: boolean; mark?: boolean } = {},
) {
  if (typeof window === "undefined" || !avoidElements[0]) {
    return Object.assign(() => {}, { update: (_elements?: Element[]) => {} });
  }

  const body = avoidElements[0].ownerDocument.body;
  // Keep shadow hosts and their ancestors reachable when the popup lives in a shadow tree.
  function host(element: Element): Element {
    const root = element.getRootNode();
    return "host" in root ? host((root as ShadowRoot).host) : element;
  }

  const locked = new Map<Element, Map<string, () => void>>();

  function update(elements = avoidElements) {
    const allowed = elements.map((element) => (body.contains(element) ? element : host(element)));
    const live = Array.from(body.querySelectorAll("[aria-live]"));
    const desired = new Map<Element, Set<string>>();

    function walk(parent: Element, control: boolean) {
      const targets = control ? allowed.concat(live) : allowed;

      for (const child of parent.children) {
        if (child.tagName === "SCRIPT" || targets.includes(child)) {
          continue;
        }

        if (targets.some((element) => child.contains(element))) {
          walk(child, control);
          continue;
        }

        const attribute = control
          ? options.inert
            ? "inert"
            : "aria-hidden"
          : "data-base-ui-inert";
        let attributes = desired.get(child);

        if (!attributes) {
          desired.set(child, (attributes = new Set()));
        }

        attributes.add(attribute);
      }
    }

    if (options.inert || options.ariaHidden) {
      walk(body, true);
    }

    if (options.mark !== false) {
      walk(body, false);
    }
    // Retain unchanged locks: toggling inert on every DOM mutation invalidates descendant styles.
    for (const [element, attributes] of locked) {
      for (const [attribute, release] of attributes) {
        if (!desired.get(element)?.has(attribute)) {
          release();

          attributes.delete(attribute);
        }
      }

      if (!attributes.size) {
        locked.delete(element);
      }
    }

    for (const [element, attributes] of desired) {
      let current = locked.get(element);

      if (!current) {
        locked.set(element, (current = new Map()));
      }

      for (const attribute of attributes) {
        if (!current.has(attribute)) {
          current.set(
            attribute,
            lock(element, attribute, attribute === "aria-hidden" ? "true" : ""),
          );
        }
      }
    }
  }

  update();
  return Object.assign(
    () => {
      for (const attributes of locked.values()) {
        for (const release of attributes.values()) {
          release();
        }
      }

      locked.clear();
    },
    { update },
  );
}
