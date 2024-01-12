interface ToolArgument {
  type: string;
  description: string;
}

interface ToolArguments {
  type: string;
  default?: any;
  properties: Record<string, ToolArgument>;
  required?: string[];
}

export type ToolData = {
  name: string;
  description: string;
  arguments: ToolArguments;
};
