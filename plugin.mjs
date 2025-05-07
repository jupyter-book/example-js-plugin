import { visit } from "unist-util-visit";

const plugin = {
  name: "Strong to emphasis",
  transforms: [
    {
      name: "transform-typography",
      doc: "An example transform that rewrites bold text as text with emphasis.",
      stage: "document",
      plugin: (_, utils) => (node) => {
        const test = (node, index, parent) => {
          return (
            parent &&
            parent.type === "div" &&
            parent.class?.includes("redact") &&
            node.type === "paragraph"
          );
        };
        visit(node, test, (node) => {
          node.children = [{ type: "delete", children: node.children }];
        });
      },
    },
  ],
};

export default plugin;
