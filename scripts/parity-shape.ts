import { tsMorph } from "./upstream";
const ts = tsMorph.ts;
type AstNode = InstanceType<typeof tsMorph.Node>["compilerNode"];

export type ComponentShape = {
  tokens: Map<string, number>;
  props: Map<string, string>;
  jsx: Map<string, string>;
};

/** AST signatures ignore formatting and native type assertions, retaining values and order. */
function canonical(node: AstNode): string {
  if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node) || ts.isParenthesizedExpression(node))
    return canonical(node.expression);
  if (
    ts.isQualifiedName(node) &&
    node.left.getText() === "React" &&
    /^ComponentProps(?:WithRef)?$/.test(node.right.text)
  )
    return "Identifier:ComponentProps";
  if (ts.isJsxAttributes(node)) {
    const attributes: string[] = [];
    for (const attribute of node.properties) {
      if (ts.isJsxSpreadAttribute(attribute)) {
        let expression = attribute.expression;
        while (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression))
          expression = expression.expression;
        if (
          ts.isObjectLiteralExpression(expression) &&
          expression.properties.every((property: AstNode) => ts.isPropertyAssignment(property))
        ) {
          attributes.push(
            ...expression.properties.map(
              (property: AstNode) => `attribute:${canonical(property.name)}=${canonical(property.initializer)}`,
            ),
          );
          continue;
        }
        attributes.push(`spread:${canonical(expression)}`);
      } else
        attributes.push(
          `attribute:${canonical(attribute.name)}=${attribute.initializer ? canonical(ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression : attribute.initializer) : "true"}`,
        );
    }
    return attributes.join("|");
  }
  if (ts.isIdentifier(node)) return `Identifier:${node.text}`;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return `string:${JSON.stringify(node.text)}`;
  if (ts.isJsxText(node)) return node.text.trim() ? `text:${node.text.trim().replace(/\s+/g, " ")}` : "";
  const children: string[] = [];
  ts.forEachChild(node, (child: AstNode) => {
    const value = canonical(child);
    if (value) children.push(value);
  });
  const value =
    ts.isNumericLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)
      ? JSON.stringify(node.text)
      : "";
  return `${ts.SyntaxKind[node.kind]}${value}[${children.join("|")}]`;
}

export function componentShape(source: string, filename = "component.tsx"): ComponentShape {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const tokens = new Map<string, number>();
  const props = new Map<string, string>();
  const jsx = new Map<string, string>();
  const visit = (node: AstNode) => {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node))
      props.set(`type ${node.name.text}`, canonical(node));
    // Runtime literals are checked separately from type declarations and assertions.
    if (ts.isTypeNode(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      const importLiteral = ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent);
      const guard =
        ts.isBinaryExpression(parent) && (ts.isTypeOfExpression(parent.left) || ts.isTypeOfExpression(parent.right));
      if (!importLiteral && !guard)
        for (const token of node.text.split(/\s+/).filter(Boolean)) tokens.set(token, (tokens.get(token) ?? 0) + 1);
    }
    const fn = ts.isFunctionDeclaration(node)
      ? node
      : ts.isVariableDeclaration(node) &&
          node.initializer &&
          (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
        ? node.initializer
        : null;
    if (fn && node.name && ts.isIdentifier(node.name)) {
      const name = node.name.text;
      props.set(
        name,
        [
          ...(fn.typeParameters ?? []).map((parameter: AstNode) => canonical(parameter)),
          ...fn.parameters.map((parameter: AstNode) => canonical(parameter)),
          ...(fn.type ? [canonical(fn.type)] : []),
        ].join(" | "),
      );
      const tree: string[] = [];
      const collect = (child: AstNode) => {
        if (ts.isJsxOpeningElement(child) || ts.isJsxSelfClosingElement(child)) {
          tree.push(
            `${ts.isJsxSelfClosingElement(child) ? "leaf" : "open"} ${canonical(child.tagName)} ${canonical(child.attributes)}`,
          );
        } else if (ts.isJsxClosingElement(child)) tree.push(`close ${canonical(child.tagName)}`);
        else if (ts.isJsxOpeningFragment(child)) tree.push("fragment");
        else if (ts.isJsxClosingFragment(child)) tree.push("/fragment");
        else if (ts.isJsxText(child) && child.text.trim()) tree.push(`text ${child.text.trim().replace(/\s+/g, " ")}`);
        else if (ts.isJsxExpression(child) && child.expression && !ts.isJsxAttribute(child.parent))
          tree.push(`expression ${canonical(child.expression)}`);
        if (ts.isCallExpression(child) && ts.isIdentifier(child.expression) && child.expression.text === "useRender")
          tree.push(`render ${canonical(child)}`);
        ts.forEachChild(child, collect);
      };
      if (fn.body) collect(fn.body);
      if (tree.length) jsx.set(name, tree.join("\n"));
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return { tokens, props, jsx };
}

export function compareEntries(
  label: string,
  ours: Map<string, string | number>,
  upstream: Map<string, string | number>,
): string[] {
  const problems: string[] = [];
  for (const [name, value] of upstream) {
    if (!ours.has(name)) problems.push(`${label}: missing ${name}`);
    else if (ours.get(name) !== value) problems.push(`${label}: changed ${name}`);
  }
  for (const name of ours.keys()) if (!upstream.has(name)) problems.push(`${label}: extra ${name}`);
  return problems;
}