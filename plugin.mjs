import { visit, SKIP } from "unist-util-visit";

/**
 * Perform the redaction transform by wrapping text nodes inside delete nodes
 *
 * @param node - tree to transform
 */
function redactTransformImpl(node, index, parent) {
  console.log("Found redacted", node.type);
  visit(node, "text", (child, childIndex, childParent) => {
    const maybeParent = childParent || parent;
    const maybeIndex = childIndex || index;
    if (maybeParent) {
      maybeParent.children[maybeIndex] = {
        type: "delete",
        children: [child],
      };
    }
    return SKIP;
  });
  return SKIP;
}

/**
 * Locate `redacted` nodes, and redact their text children (recursively)
 *
 * @param node - tree to transform
 */
function redactTransform(node) {
  const test = (child, index, parent) => {
    return (
      child.class &&
      child.class.split(/\s/).some((class_) => class_ === "redacted")
    );
  };
  visit(node, test, (child, index, parent) =>
    redactTransformImpl(child, index, parent),
  );
}

const plugin = {
  name: "Redact text",
  transforms: [
    {
      name: "transform-typography",
      doc: "An example transform that rewrites text with a 'redacted' class to become children of delete",
      stage: "document",
      plugin: (_, utils) => (node) => {
        redactTransform(node);
      },
    },
  ],
};

export default plugin;
