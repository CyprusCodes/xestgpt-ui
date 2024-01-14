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

export type UIFunctionArguments<AIProvidedParams> = {
  functionArgs: AIProvidedParams;
  previousRunResults: string;
  captureResults: (result: string) => void;
};

export enum MessageRole {
  FUNCTION = "function",
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

type MessageRoleExceptFunctions = Exclude<MessageRole, MessageRole.FUNCTION>;

interface GenericMessage {
  unuseful: boolean;
  hiddenFromUser: boolean;
  message?: string;
  role: MessageRoleExceptFunctions;
}

export interface ToolDetails {
  args: any,
  name: string
  confirmed?: boolean,
  runAt?: string,
  output?: string
}

interface ToolMessage {
  unuseful: boolean;
  hiddenFromUser: boolean;
  message?: string;
  role: MessageRole.FUNCTION;
  tool: ToolDetails
}

export type Message = GenericMessage | ToolMessage;


export type ToolTreeData = ToolTreeDataType;
