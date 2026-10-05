// Like `parity`, this tooling test requires the upstream checkout; core primitive tests do not.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { matchesAdaptation, parityAdaptations } from "./parity-adaptations";
import { componentShape, compareEntries } from "./parity-shape";
import { referenceComponent } from "./upstream";

const fixture = `
type Props = { variant?: "normal" | "muted"; disabled?: boolean };
function Sample({ variant = "normal", disabled = false, ...props }: Props) {
 return <div data-slot="sample" className="rounded border" {...props}>
  <span className="muted">{variant}</span><button disabled={disabled}>Save</button>
 </div>;
}
`;

const differences = (a: string, b = fixture) => {
  const ours = componentShape(a);
  const upstream = componentShape(b);
  return {
    tokens: compareEntries("tokens", ours.tokens, upstream.tokens),
    props: compareEntries("props", ours.props, upstream.props),
    jsx: compareEntries("jsx", ours.jsx, upstream.jsx),
  };
};

let count = 0;

function check(name: string, run: () => void) {
  run();
  count++;
  console.log(`✓ ${name}`);
}

check("formatting and comments do not change signatures", () =>
  assert.deepEqual(
    differences(fixture.replace("function Sample", "/* comment */ function   Sample")),
    {
      tokens: [],
      props: [],
      jsx: [],
    },
  ),
);

check("removing a duplicated runtime class changes its count", () => {
  const upstream = fixture.replace('className="muted"', 'className="border"');
  const changed = upstream.replace('className="border"', 'className=""');
  assert.ok(differences(changed, upstream).tokens.length);
});

check("moving classes to another element is detected even with identical token counts", () => {
  const changed = fixture
    .replace('className="rounded border"', 'className="muted"')
    .replace('<span className="muted"', '<span className="rounded border"');
  const result = differences(changed);
  assert.equal(result.tokens.length, 0);

  assert.ok(result.jsx.length);
});

check("changed prop types are detected", () =>
  assert.ok(differences(fixture.replace("disabled?: boolean", "disabled?: string")).props.length),
);

check("required and optional props differ", () =>
  assert.ok(differences(fixture.replace("variant?:", "variant:")).props.length),
);

check("changed defaults are detected", () =>
  assert.ok(differences(fixture.replace("disabled = false", "disabled = true")).props.length),
);

check("removed forwarded spreads are detected", () =>
  assert.ok(differences(fixture.replace("{...props}", "")).jsx.length),
);

check("changed tag nesting is detected", () =>
  assert.ok(
    differences(
      fixture.replace(
        '<span className="muted">{variant}</span>',
        '<div><span className="muted">{variant}</span></div>',
      ),
    ).jsx.length,
  ),
);

check("changed child expressions are detected", () =>
  assert.ok(differences(fixture.replace("{variant}", "{disabled}")).jsx.length),
);

check("changed attributes are detected", () =>
  assert.ok(differences(fixture.replace('data-slot="sample"', 'aria-label="sample"')).jsx.length),
);

check("arrow component props and JSX are checked", () => {
  const original = "const Sample = ({size = 1}: {size?: number}) => <div data-size={size} />;";
  assert.ok(differences(original.replace("size = 1", "size = 2"), original).props.length);

  assert.ok(differences(original.replace("data-size", "data-count"), original).jsx.length);
});

check("native prop aliases and type assertions are equivalent", () => {
  const upstream =
    'function Sample(props: React.ComponentProps<"div">) { return <div {...props} />; }';
  const local =
    'function Sample(props: ComponentProps<"div">) { return <div {...(props as JSX.IntrinsicElements["div"])} />; }';
  assert.deepEqual(differences(local, upstream), { tokens: [], props: [], jsx: [] });
});

check("static attribute spreads preserve exact values and order", () => {
  const upstream = "function Sample() { return <input spellCheck={false} {...props} />; }";
  const local = "function Sample() { return <input {...{spellCheck: false}} {...props} />; }";
  assert.equal(differences(local, upstream).jsx.length, 0);

  assert.ok(
    differences(local.replace("spellCheck: false", "spellCheck: true"), upstream).jsx.length,
  );
});

check("generic prop parameters are checked", () => {
  const upstream = "function Sample<T extends string>(props: {value:T}) {return <div />;}";
  assert.ok(
    differences(upstream.replace("extends string", "extends number"), upstream).props.length,
  );
});

check("render utility props are checked without JSX", () => {
  const upstream =
    'function Sample() { return useRender({defaultTagName:"span",props:{className:"muted",role:"status"}}); }';
  const changed = upstream.replace('role:"status"', 'title:"status"');
  const result = differences(changed, upstream);
  assert.equal(result.tokens.length, 0);

  assert.ok(result.jsx.length);
});

check("template expressions ignore formatting but retain content", () => {
  const upstream = "function Sample({value}: Props) {return <span>{`${value}: result`}</span>;}";
  assert.equal(differences(upstream.replace("${value}", "${ value }"), upstream).jsx.length, 0);

  assert.ok(differences(upstream.replace("result", "other"), upstream).jsx.length);
});
const chart = componentShape(
  readFileSync(resolve(import.meta.dirname, "../registry/ui/chart.tsx"), "utf8"),
);
const upstreamChart = componentShape(await referenceComponent("chart"));
const adaptation = parityAdaptations[0]!;
const local = chart.props.get(adaptation.member);
const upstream = upstreamChart.props.get(adaptation.member);
check("documented adaptation matches both exact signatures", () =>
  assert.ok(matchesAdaptation(local, upstream, adaptation)),
);

check("adaptation cannot hide another local change", () =>
  assert.equal(matchesAdaptation(`${local} changed`, upstream, adaptation), false),
);

check("adaptation cannot hide upstream drift", () =>
  assert.equal(matchesAdaptation(local, `${upstream} changed`, adaptation), false),
);

check("missing adaptation declarations fail", () =>
  assert.equal(matchesAdaptation(undefined, upstream, adaptation), false),
);

// Prove CLI exit codes using owned temporary copies, without mutating the real registry.
const fixtureDir = mkdtempSync(join(tmpdir(), "shadcn-preact-parity-tests-"));

try {
  const registryDir = resolve(import.meta.dirname, "../registry/ui");

  for (const file of readdirSync(registryDir).filter((file) => file.endsWith(".tsx"))) {
    copyFileSync(join(registryDir, file), join(fixtureDir, file));
  }

  const checkCLI = (
    name: string,
    file: string,
    mutate: (source: string) => string | null,
    message: string,
  ) => {
    check(name, () => {
      const path = join(fixtureDir, file);
      const original = readFileSync(path, "utf8");

      try {
        const changed = mutate(original);

        if (changed === null) {
          rmSync(path);
        } else {
          writeFileSync(path, changed);
        }

        const result = spawnSync(process.execPath, [resolve(import.meta.dirname, "parity.ts")], {
          env: { ...process.env, PARITY_REGISTRY_DIR: fixtureDir },
          encoding: "utf8",
        });
        assert.equal(result.status, 1, result.stdout + result.stderr);

        assert.ok(result.stdout.includes(message), result.stdout + result.stderr);
      } finally {
        writeFileSync(path, original);
      }
    });
  };

  checkCLI(
    "CLI fails on a missing wrapper",
    "kbd.tsx",
    () => null,
    "kbd: missing upstream component",
  );

  checkCLI(
    "CLI fails on retired primitives",
    "kbd.tsx",
    (source) => source.replace('from "./lib/utils"', 'from "./share/utils"'),
    "kbd: still uses retired primitives",
  );

  checkCLI(
    "CLI fails on a missing export",
    "kbd.tsx",
    (source) => source.replace("export { Kbd, KbdGroup }", "export { Kbd }"),
    "missing export KbdGroup",
  );

  checkCLI(
    "CLI fails on changed prop declarations",
    "kbd.tsx",
    (source) =>
      source.replace(
        'ComponentProps<"div">',
        'ComponentProps<"div"> & { requiredNewProp: boolean }',
      ),
    "props: changed KbdGroup",
  );
} finally {
  rmSync(fixtureDir, { recursive: true, force: true });
}

console.log(`${count} parity regression checks passed.`);
