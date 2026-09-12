export interface MadiToolRequest {
  toolId: string;
  operation: string;
  input?: Record<string, unknown>;
}

export interface MadiToolResult {
  success: boolean;
  output?: unknown;
  error?: { code: string; message: string };
}

/** Provider- and application-neutral contract for future tools. */
export interface MadiTool {
  id: string;
  name: string;
  description: string;
  risk: 'low' | 'moderate' | 'high';
  execute(request: MadiToolRequest): Promise<MadiToolResult>;
}
