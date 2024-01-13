import type { DataNode } from "antd/es/tree";

interface ToolArgument {
  type: string;
  description: string;
  default?: any;
}

interface ToolArguments {
  type: string;
  default?: any;
  properties: Record<string, ToolArgument>;
  required?: string[];
}

export enum FunctionType {
  UI = "ui",
  BACKEND = "backend",
}

export type ToolData = {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  subsubcategory?: string;
  functionType: FunctionType;
  dangerous: boolean;
  arguments: ToolArguments;
};

interface ToolTreeDataType extends DataNode {
  metadata?: ToolData;
  children?: ToolTreeDataType[];
}

export type ToolTreeData = ToolTreeDataType;
