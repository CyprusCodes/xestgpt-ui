import React, { useState } from "react";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";

const treeData: DataNode[] = [
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
      {
        title: "0-0-2",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "0-1",
    key: "0-1",
    children: [
      { title: "0-1-0-0", key: "0-1-0-0" },
      { title: "0-1-0-1", key: "0-1-0-1" },
      { title: "0-1-0-2", key: "0-1-0-2" },
    ],
  },
  {
    title: "0-2",
    key: "0-2",
  },
];

const ToolSelector = ({ tools }: any) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    tools.map((t: any) => t.name)
  );
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(tools.map((t: any) => t.name));
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };

  console.log(expandedKeys, "huh?")

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={tools.map((t: any) => {
        return {
          title: t.name,
          key: t.name,
        };
      })}
    />
  );
};

export default ToolSelector;
