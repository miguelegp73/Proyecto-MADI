import { MadiContext } from '../context/context.contract';
import { MadiIntent } from '../intent/intent.contract';
import { MadiInteractionRequest } from '../interaction/interaction.contract';

export interface MadiReasoningInput {
  request: MadiInteractionRequest;
  intent: MadiIntent;
  context: MadiContext;
}

export interface MadiReasoningResult {
  confidence: number;
  inferences: unknown[];
  conclusions: unknown[];
  recommendations: unknown[];
  proposedActions: unknown[];
  warnings?: string[];
}

/** Provider-neutral reasoning boundary. External LLMs must implement this contract later. */
export interface MadiReasoningEngine {
  reason(input: MadiReasoningInput): Promise<MadiReasoningResult>;
}
