import React, { useMemo, useState } from "react";
import { Input, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import "./tool-selector.css";
import { ToolData } from "../../types";

const { Search } = Input;

interface ToolTreeData extends DataNode {
  metadata?: ToolData;
  children?: ToolTreeData[];
}

const computeParentKeys = (key: string): string[] => {
  const ids = key.split("-");

  return ids
    .map((element, index) => {
      if (index > 0) {
        const ancestors = ids.slice(0, index);
        return `${ancestors.join("-")}-${element}`;
      }

      return `${element}`;
    })
    // dont return the key itself
    .filter((k) => k !== key);
};

const findPathBetweenKeys = (data: ToolTreeData[], startKey: React.Key, endKey: React.Key): React.Key[] => {
  const result: React.Key[] = [];

  const findPath = (currentData: ToolTreeData[], path: React.Key[] = []) => {
    for (const node of currentData) {
      const newPath: React.Key[] = [...path, node.key];

      if (node.key === startKey || node.key === endKey) {
        result.push(...newPath);
      }

      if (node.children) {
        findPath(node.children, newPath);
      }
    }
  };

  findPath(data);

  const startIndex = result.indexOf(String(startKey));
  const endIndex = result.indexOf(String(endKey));

  if (startIndex !== -1 && endIndex !== -1) {
    return result.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
  } else {
    return [];
  }
};

const findAllChildrenKeys = (data: ToolTreeData[], targetKey: React.Key): string[] => {
  const result: string[] = [];

  const traverse = (node: ToolTreeData | undefined) => {
    if (!node) {
      return;
    }

    result.push(node.key as string);

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  };

  const findTargetNode = (currentData: ToolTreeData[]) => {
    for (const node of currentData) {
      if (node.key === targetKey) {
        traverse(node);
      }

      if (node.children) {
        findTargetNode(node.children);
      }
    }
  };

  findTargetNode(data);

  return result;
};

const defaultData: ToolTreeData[] = [
  {
    title: "CRM",
    key: "0-0",
    metadata: {
      name: "read_file_at_path",
      description: "Read file content at a given path",
      arguments: {
        type: "object",
        default: {},
        properties: {
          path: {
            type: "string",
            description: "the directory path to show contents",
          },
        },
        required: ["path"],
      },
    },
    children: [
      {
        title: "Mailchimp",
        key: "0-0-0",
        children: [
          {
            title: "get_list_of_mailchimp_subscribers",
            key: "0-0-0-0",
          },
          {
            title: "send_email_to_mailing_list",
            key: "0-0-0-1",
          },
          {
            title: "get_list_of_mailing_lists",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "Salesforce",
        key: "0-0-1",
        children: [
          {
            title: "get_list_of_leads",
            key: "0-0-1-0",
          },
          {
            title: "get_list_of_opportunities",
            key: "0-0-1-1",
          },
          {
            title: "get_list_of_tasks",
            key: "0-0-1-2",
          },
        ],
      },
      {
        title: "lets go",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "Logistics Hub",
    key: "0-1",
    children: [
      {
        title: "Parcels",
        key: "0-1-0",
        children: [
          {
            title: "get_list_of_parcels_customers",
            key: "0-1-0-0",
          },
          {
            title: "get_list_parcels_scheduled_for_today",
            key: "0-1-0-1",
          },
          {
            title: "get_invoices",
            key: "0-1-0-2",
            metadata: {
              name: "read_file_at_path",
              description: "Read file content at a given path",
              arguments: {
                type: "object",
                default: {},
                properties: {
                  path: {
                    type: "string",
                    description: "the directory path to show contents",
                  },
                },
                required: ["path"],
              },
            },
          },
        ],
      },
      {
        title: "Storage",
        key: "0-1-1",
        children: [
          {
            title: "get_total_space_occupied",
            key: "0-1-1-0",
          },
          {
            title: "show_inbound_deliveries_for_today",
            key: "0-1-1-1",
          },
        ],
      },
      {
        title: "Something else",
        key: "0-1-2",
      },
    ],
  },
  {
    title: "Internal APIs",
    key: "0-2",
  },
];

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const ToolSelector: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [checkedKeys, setCheckedKeys] = useState<
    React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }
  >(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys: React.Key[] = [];

    const traverseAndExpand = (data: DataNode[] | undefined) => {
      if (data) {
        for (const item of data) {
          if (
            String(item.title || "")
              .toLowerCase()
              .indexOf(value.toLowerCase()) > -1
          ) {
            const parentKey = getParentKey(item.key, defaultData);
            newExpandedKeys.push(parentKey);
            traverseAndExpand(item.children);
          } else {
            traverseAndExpand(item.children);
          }
        }
      }
    };

    traverseAndExpand(defaultData);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const matchedStr = strTitle.substring(
          index,
          index + searchValue.length
        );
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <strong>
                <span className="site-tree-search-value">{matchedStr}</span>
              </strong>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);

  const onCheck = (
    checkedKeysValue:
      | React.Key[]
      | { checked: React.Key[]; halfChecked: React.Key[] }
  ): void => {
    setCheckedKeys(checkedKeysValue);
  };

  // be careful when changing this method, as it's doing lots of clever logic
  // if the selected node is a category, then expand or collapse
  // it the selected node is a tool, then select or deselect
  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    const { node } = info;
    setSelectedKeys(selectedKeysValue);

    // Check if the selected node is a category (assuming category nodes have children)
    if (node.children && node.children.length > 0) {
      const isThisCategoryExpanded = expandedKeys.includes(node.key);

      // If it's a category, expand or collapse it
      const newExpandedKeys = isThisCategoryExpanded
        ? expandedKeys.filter((key) => key !== node.key)
        : [...expandedKeys, node.key];

      setExpandedKeys(newExpandedKeys);
    } else {
      // If it's a tool, select or deselect it
      const checkedKeysArr = checkedKeys as React.Key[];

      const parentKeys = computeParentKeys(node.key);
      // filter all checked parents of the tool key
      const allCheckedParents = checkedKeysArr.filter((key) => {
        return parentKeys.some((pKey) => pKey === key);
      });

      const areAnyOfTheParentCategoriesChecked = allCheckedParents.length > 0;
      if (areAnyOfTheParentCategoriesChecked) {
        const [topMostParentKey] = allCheckedParents.sort((a: React.Key, b: React.Key) => {
          const depthA = String(a).split("-").length;
          const depthB = String(b).split("-").length;
        
          return depthA - depthB;
        });

        const allChildren = findAllChildrenKeys(defaultData, topMostParentKey);
        const prunedCheckedKeys = checkedKeysArr.filter(key => !allChildren.includes(String(key)));

        const pathsBetween = findPathBetweenKeys(defaultData, topMostParentKey, node.key);
        const allChildrenExceptPathsInBetween = allChildren.filter(cKey => !pathsBetween.includes(cKey))
        
        return setCheckedKeys([...prunedCheckedKeys, ...allChildrenExceptPathsInBetween])
      }

      const isToolChecked = checkedKeysArr.includes(node.key);
      if (isToolChecked) {
        return setCheckedKeys([...checkedKeysArr.filter(k => k !== node.key)]);
      }

      // tool is not checked, neither any of its parents
      // add the tool to checked list
      return setCheckedKeys([...checkedKeysArr, node.key])
    }
  };

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        checkable
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
      />
    </div>
  );
};

export default ToolSelector;
