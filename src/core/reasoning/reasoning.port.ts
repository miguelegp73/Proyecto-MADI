import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../interaction/interaction.contract';

export interface MadiReasoningPort {
  reason(request: MadiInteractionRequest): Promise<MadiReasoningResult>;
}

export interface MadiReasoningResult {
  status: MadiInteractionResponse['status'];
  data?: unknown[];
  inferences?: unknown[];
  conclusions?: unknown[];
  recommendations?: unknown[];
  proposedActions?: unknown[];
  authorization?: MadiInteractionResponse['authorization'];
  sources?: unknown[];
  warnings?: string[];
  error?: MadiInteractionResponse['error'];
}
