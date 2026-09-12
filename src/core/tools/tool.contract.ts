export type MadiToolRisk = 'low' | 'moderate' | 'high';

export interface MadiToolRequest {
  toolId: string;
  operation: string;
  input?: Record<string, unknown>;
  authorizationToken?: string;
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
  risk: MadiToolRisk;
  /** If present, only these operations may be executed through the tool boundary. */
  operations?: readonly string[];
  execute(request: MadiToolRequest): Promise<MadiToolResult>;
}
