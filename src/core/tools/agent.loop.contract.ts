import { MadiToolResult } from './tool.contract';

export type MadiAgentLoopStatus =
  | 'completed'
  | 'failed'
  | 'needs_authorization'
  | 'limit_reached'
  | 'cycle_detected';

export interface MadiToolAction {
  id: string;
  toolId: string;
  operation: string;
  input?: Record<string, unknown>;
  expected?: unknown;
  authorizationToken?: string;
}

export type MadiToolTraceStatus =
  | 'executed'
  | 'failed'
  | 'blocked'
  | 'verified';

export interface MadiToolTrace {
  actionId: string;
  toolId: string;
  operation: string;
  status: MadiToolTraceStatus;
  result?: MadiToolResult;
}

export interface MadiAgentLoopRequest {
  actions: readonly MadiToolAction[];
  maxSteps?: number;
}

export interface MadiAgentLoopResult {
  status: MadiAgentLoopStatus;
  stepsExecuted: number;
  trace: readonly MadiToolTrace[];
  error?: { code: string; message: string };
}

export interface MadiAgentLoop {
  run(request: MadiAgentLoopRequest): Promise<MadiAgentLoopResult>;
}
