import type { MCPContext, MCPRequest, MCPResponse, MCPTool } from './types';
import { 
  createQueryTool, 
  createFileTool,
  createWriteFileTool,
  createListDirectoryTool,
  createCreateDirectoryTool,
  createSearchFilesTool,
  createFileInfoTool,
  createArtifactsTool,
  createREPLTool,
  createSearchTool,
  createLocalSearchTool
} from './tools';

class MCPContextManager implements MCPContext {
  tools: Map<string, MCPTool>;

  constructor() {
    this.tools = new Map();
    this.initializeTools();
  }

  private initializeTools() {
    const tools = [
      createQueryTool(),
      createFileTool(),
      createWriteFileTool(),
      createListDirectoryTool(),
      createCreateDirectoryTool(),
      createSearchFilesTool(),
      createFileInfoTool(),
      createArtifactsTool(),
      createREPLTool(),
      createSearchTool(),
      createLocalSearchTool()
    ];

    tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const tool = this.tools.get(request.command);
    
    if (!tool) {
      return {
        success: false,
        error: `Unknown command: ${request.command}`
      };
    }

    try {
      return await tool.execute(request.args || {});
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Command execution failed'
      };
    }
  }
}

export const mcpContext = new MCPContextManager();