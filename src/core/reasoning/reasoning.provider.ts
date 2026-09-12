import {
  MadiReasoningInput,
  MadiReasoningResult,
} from './reasoning.engine';

/**
 * Provider-neutral contract for external reasoning systems.
 * Concrete adapters (Gemini, OpenRouter, local models, etc.) belong outside core.
 */
export interface MadiReasoningProvider {
  readonly id: string;
  readonly priority: number;

  isAvailable(): Promise<boolean>;
  reason(input: MadiReasoningInput): Promise<MadiReasoningResult>;
}
