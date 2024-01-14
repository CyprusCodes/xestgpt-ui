import React, { useMemo, useState } from "react";
import { Input, Tree, Tooltip, Checkbox } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import uniq from "lodash.uniq";

import "./tool-selector.css";
import { ToolData, ToolTreeData } from "../../types";
import ToolInformationModal from "./ToolInformationModal";

const { Search } = Input;

const computeParentKeys = (key: string): string[] => {
  const ids = key.split("-");

  return (
    ids
      .map((element, index) => {
        if (index > 0) {
          const ancestors = ids.slice(0, index);
          return `${ancestors.join("-")}-${element}`;
        }

        return `${element}`;
      })
      // dont return the key itself
      .filter((k) => k !== key)
  );
};

const findPathBetweenKeys = (
  data: ToolTreeData[],
  startKey: React.Key,
  endKey: React.Key
): React.Key[] => {
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
    return result.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );
  } else {
    return [];
  }
};

const findNodeByKey = (
  currentData: ToolTreeData[],
  targetKey: React.Key
): ToolTreeData | undefined => {
  for (const node of currentData) {
    if (node.key === targetKey) {
      return node;
    }

    if (node.children?.length) {
      const foundInChildren = node.children
        .map((c) => findNodeByKey([c], targetKey))
        .find(Boolean);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
};

const findAllChildrenKeys = (
  data: ToolTreeData[],
  targetKey: React.Key
): string[] => {
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

const getParentKey = (key: React.Key, tree: ToolTreeData[]): React.Key => {
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

interface ToolSelectorProps {
  initialToolTree: ToolTreeData[];
  setSelectedTools: React.Dispatch<any>;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  initialToolTree,
  setSelectedTools,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [checkedKeys, setCheckedKeysInternal] = useState<
    React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }
  >([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedToolData, setSelectedToolData] = useState<ToolData>();
  const [visibleTooltips, setVisibleTooltips] = useState<
    Record<string, boolean>
  >({});
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const setCheckedKeys = (data: any) => {
    setCheckedKeysInternal(data);

    const allKeysComprehensive = data.map((k: any) =>
      findAllChildrenKeys(initialToolTree, k)
    );
    const allKeysFlattened = uniq(allKeysComprehensive.flat());
    const toolsChecked = allKeysFlattened
      .map((k) => findNodeByKey(initialToolTree, k as React.Key))
      .filter((v) => v?.metadata);
    setSelectedTools(toolsChecked);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys: React.Key[] = [];

    const traverseAndExpand = (data: ToolTreeData[] | undefined) => {
      if (data) {
        for (const item of data) {
          if (
            String(item.title || "")
              .toLowerCase()
              .indexOf(value.toLowerCase()) > -1
          ) {
            const parentKey = getParentKey(item.key, initialToolTree);
            newExpandedKeys.push(parentKey);
            traverseAndExpand(item.children);
          } else {
            traverseAndExpand(item.children);
          }
        }
      }
    };

    traverseAndExpand(initialToolTree);
    const newExpandedKeysWithParents = newExpandedKeys.map((k) =>
      computeParentKeys(String(k))
    );

    // todo: we might need unique keys here, but it's fine for now
    setExpandedKeys([...newExpandedKeysWithParents.flat(), ...newExpandedKeys]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: ToolTreeData[]): ToolTreeData[] =>
      data.map((item: ToolTreeData) => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const matchedStr = strTitle.substring(
          index,
          index + searchValue.length
        );
        const afterStr = strTitle.slice(index + searchValue.length);

        let showInfoIcon = <></>;
        if (item.metadata) {
          const tooltipKey = String(item.key);
          const tooltipVisible = visibleTooltips[tooltipKey];
          showInfoIcon = (
            <Tooltip
              title="show tool details"
              trigger={"hover"}
              open={tooltipVisible}
            >
              <span
                onClick={(el: any) => {
                  el.stopPropagation();
                  setSelectedToolData(item.metadata);
                  setVisibleTooltips({
                    ...visibleTooltips,
                    [tooltipKey]: false,
                  });
                }}
                onMouseEnter={(e: any) => {
                  setVisibleTooltips({
                    ...visibleTooltips,
                    [tooltipKey]: true,
                  });
                }}
                onMouseLeave={(e: any) => {
                  setVisibleTooltips({
                    ...visibleTooltips,
                    [tooltipKey]: false,
                  });
                }}
              >
                <InfoCircleOutlined
                  style={{ marginLeft: 8, color: "#1890ff" }}
                />
              </span>
            </Tooltip>
          );
        }

        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <strong>
                <span className="site-tree-search-value">{matchedStr}</span>
              </strong>
              {afterStr}
              {showInfoIcon}
            </span>
          ) : (
            <span>
              {strTitle}
              {showInfoIcon}
            </span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(initialToolTree);
  }, [initialToolTree, searchValue, visibleTooltips]);

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
        const [topMostParentKey] = allCheckedParents.sort(
          (a: React.Key, b: React.Key) => {
            const depthA = String(a).split("-").length;
            const depthB = String(b).split("-").length;

            return depthA - depthB;
          }
        );

        const allChildren = findAllChildrenKeys(
          initialToolTree,
          topMostParentKey
        );
        const prunedCheckedKeys = checkedKeysArr.filter(
          (key) => !allChildren.includes(String(key))
        );

        const pathsBetween = findPathBetweenKeys(
          initialToolTree,
          topMostParentKey,
          node.key
        );
        const allChildrenExceptPathsInBetween = allChildren.filter(
          (cKey) => !pathsBetween.includes(cKey)
        );

        return setCheckedKeys([
          ...prunedCheckedKeys,
          ...allChildrenExceptPathsInBetween,
        ]);
      }

      const isToolChecked = checkedKeysArr.includes(node.key);
      if (isToolChecked) {
        return setCheckedKeys([
          ...checkedKeysArr.filter((k) => k !== node.key),
        ]);
      }

      // tool is not checked, neither any of its parents
      // add the tool to checked list
      return setCheckedKeys([...checkedKeysArr, node.key]);
    }
  };

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      />
      <Checkbox
        style={{ marginLeft: "24px", marginBottom: "4px" }}
        checked={selectAll}
        onClick={() => {
          const newSelectAll = !selectAll;
          setSelectAll(newSelectAll);
          if (newSelectAll) {
            const topLevelKeys = initialToolTree.map(t => t.key);
            setCheckedKeys(topLevelKeys);
          } else {
            setCheckedKeys([]);
          }
        }}
      >
        <span style={{ paddingLeft: "4px" }}>Select/Deselect All Tools</span>
      </Checkbox>
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
      <ToolInformationModal
        toolData={selectedToolData}
        visible={Boolean(selectedToolData)}
        onClose={() => {
          setSelectedToolData(undefined);
        }}
      ></ToolInformationModal>
    </div>
  );
};

export default ToolSelector;
