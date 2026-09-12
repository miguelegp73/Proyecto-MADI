import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiReasoningPort } from '../../core/reasoning/reasoning.port';

export class MadiOrchestrator {
  constructor(private readonly reasoning: MadiReasoningPort) {}

  async execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    const result = await this.reasoning.reason(request);

    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      ...result,
    };
  }
}
