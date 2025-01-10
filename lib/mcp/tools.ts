import type { MCPTool, MCPResponse } from './types';

// Query Tool
export const createQueryTool = (): MCPTool => ({
  name: 'read-query',
  description: 'Execute a SELECT query on the SQLite database',
  parameters: {
    query: { type: 'string', description: 'SQL query to execute' }
  },
  async execute(args: { query: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: args.query })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Query execution failed'
      };
    }
  }
});

// File Tools
export const createFileTool = (): MCPTool => ({
  name: 'read_file',
  description: 'Read file contents',
  parameters: {
    path: { type: 'string', description: 'File path to read' }
  },
  async execute(args: { path: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: args.path })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File read failed'
      };
    }
  }
});

export const createWriteFileTool = (): MCPTool => ({
  name: 'write_file',
  description: 'Write content to a file',
  parameters: {
    path: { type: 'string', description: 'File path to write to' },
    content: { type: 'string', description: 'Content to write' }
  },
  async execute(args: { path: string, content: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File write failed'
      };
    }
  }
});

export const createListDirectoryTool = (): MCPTool => ({
  name: 'list_directory',
  description: 'List directory contents',
  parameters: {
    path: { type: 'string', description: 'Directory path to list' }
  },
  async execute(args: { path: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Directory listing failed'
      };
    }
  }
});

export const createCreateDirectoryTool = (): MCPTool => ({
  name: 'create_directory',
  description: 'Create a new directory',
  parameters: {
    path: { type: 'string', description: 'Directory path to create' }
  },
  async execute(args: { path: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/create_dir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Directory creation failed'
      };
    }
  }
});

export const createSearchFilesTool = (): MCPTool => ({
  name: 'search_files',
  description: 'Search for files matching a pattern',
  parameters: {
    path: { type: 'string', description: 'Base path to start search' },
    pattern: { type: 'string', description: 'Search pattern to match' }
  },
  async execute(args: { path: string, pattern: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File search failed'
      };
    }
  }
});

export const createFileInfoTool = (): MCPTool => ({
  name: 'get_file_info',
  description: 'Get detailed file information',
  parameters: {
    path: { type: 'string', description: 'File path to get info for' }
  },
  async execute(args: { path: string }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/fs/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File info retrieval failed'
      };
    }
  }
});

// Search Tools
export const createSearchTool = (): MCPTool => ({
  name: 'brave_web_search',
  description: 'Search the web using Brave Search',
  parameters: {
    query: { type: 'string', description: 'Search query' },
    count: { type: 'number', description: 'Number of results (optional)' },
    offset: { type: 'number', description: 'Result offset (optional)' }
  },
  async execute(args: { query: string, count?: number, offset?: number }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/brave_web_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Web search failed'
      };
    }
  }
});

export const createLocalSearchTool = (): MCPTool => ({
  name: 'brave_local_search',
  description: 'Search for local businesses and places',
  parameters: {
    query: { type: 'string', description: 'Local search query' },
    count: { type: 'number', description: 'Number of results (optional)' }
  },
  async execute(args: { query: string, count?: number }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/brave_local_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Local search failed'
      };
    }
  }
});

// REPL Tool
export const createREPLTool = (): MCPTool => ({
  name: 'repl',
  description: 'Execute code in the analysis environment',
  parameters: {
    code: { type: 'string', description: 'Code to execute' }
  },
  async execute(args: { 
    code: string,
    files?: Array<{
      name: string,
      content: string | ArrayBuffer
    }>
  }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/repl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: args.code,
          files: args.files?.map(file => ({
            name: file.name,
            content: file.content instanceof ArrayBuffer 
              ? Buffer.from(file.content).toString('base64')
              : file.content
          }))
        })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'REPL execution failed'
      };
    }
  }
});

// Artifacts Tool
export const createArtifactsTool = (): MCPTool => ({
  name: 'artifacts',
  description: 'Create and manage artifacts',
  parameters: {
    command: { type: 'string', description: 'Artifact command (create, update, etc)' },
    id: { type: 'string', description: 'Artifact identifier' }
  },
  async execute(args: { 
    command: string,
    id: string,
    type?: string,
    content?: string,
    language?: string,
    title?: string,
    old_str?: string,
    new_str?: string,
    files?: Array<{
      name: string,
      content: string | ArrayBuffer
    }>
  }): Promise<MCPResponse> {
    try {
      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...args,
          files: args.files?.map(file => ({
            name: file.name,
            content: file.content instanceof ArrayBuffer 
              ? Buffer.from(file.content).toString('base64')
              : file.content
          }))
        })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Artifact operation failed'
      };
    }
  }
});