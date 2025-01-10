export interface MCPParameter {
  type: string;
  description: string;
  required?: boolean;
}

export interface MCPParameters {
  [key: string]: MCPParameter;
}

export interface MCPRequest {
  command: string;
  args?: Record<string, any>;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters?: MCPParameters;
  execute: (args: any) => Promise<MCPResponse>;
}

export interface MCPContext {
  tools: Map<string, MCPTool>;
  execute: (request: MCPRequest) => Promise<MCPResponse>;
}

// Available MCP Commands
export type MCPCommand = 
  | 'read-query'
  | 'write-query'
  | 'create-table'
  | 'list-tables'
  | 'describe-table'
  | 'read_file'
  | 'read_multiple_files'
  | 'write_file'
  | 'create_directory'
  | 'list_directory'
  | 'move_file'
  | 'search_files'
  | 'get_file_info'
  | 'list_allowed_directories'
  | 'brave_web_search'
  | 'brave_local_search';