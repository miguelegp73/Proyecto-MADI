export type InteractionInputType = 'text' | 'voice' | 'structured';

export type InteractionStatus =
  | 'completed'
  | 'needs_input'
  | 'needs_authorization'
  | 'rejected'
  | 'failed';

export interface MadiInteractionSource {
  applicationId: string;
  interface: string;
}

export interface MadiInteractionRequest {
  requestId: string;
  timestamp: string;
  source: MadiInteractionSource;
  input: {
    type: InteractionInputType;
    content: string;
  };
  context?: Record<string, unknown>;
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

export interface MadiInteractionResponse {
  requestId: string;
  timestamp: string;
  status: InteractionStatus;
  data?: unknown[];
  inferences?: unknown[];
  conclusions?: unknown[];
  recommendations?: unknown[];
  proposedActions?: unknown[];
  authorization?: {
    required: boolean;
    reason?: string;
  };
  sources?: unknown[];
  warnings?: string[];
  error?: {
    code: string;
    message: string;
  };
}
