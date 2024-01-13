import { ToolData, ToolTreeData } from "../types";

function parseToolDataIntoTreeFormat(data: ToolData[]): ToolTreeData[] {
  const tree: ToolTreeData[] = [];

  data.forEach((item) => {
    const { category, subcategory } = item;

    // Find or create the category node
    let categoryNode = tree.find((node) => node.title === category);
    if (!categoryNode) {
      categoryNode = {
        title: category,
        key: `0-${tree.length}`,
        children: [],
      };
      tree.push(categoryNode);
    }

    if (categoryNode && categoryNode.children) {
      // Find or create the subcategory node
      let subcategoryNode = categoryNode.children.find(
        (node) => node.title === subcategory
      );
      if (!subcategoryNode) {
        subcategoryNode = {
          title: subcategory,
          key: `${categoryNode.key}-${categoryNode.children.length}`,
          children: [],
        };
        categoryNode.children.push(subcategoryNode);
      }

      if (subcategoryNode && subcategoryNode.children) {
        // create the tool node
        const subsubcategoryNode = {
          title: item.name,
          key: `${subcategoryNode.key}-${subcategoryNode.children.length}`,
          metadata: {
            name: item.name,
            description: item.description,
            category: item.category,
            subcategory: item.subcategory,
            subsubcategory: item.subsubcategory,
            functionType: item.functionType,
            dangerous: item.dangerous,
            arguments: item.arguments,
          },
        };
        subcategoryNode.children.push(subsubcategoryNode);
      }
    }
  });

  console.log(tree);
  return tree;
}

export default parseToolDataIntoTreeFormat;
