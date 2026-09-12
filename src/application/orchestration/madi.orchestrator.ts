import { Inject } from '@nestjs/common';
import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiReasoningPort } from '../../core/reasoning/reasoning.port';
import { MADI_REASONING_PORT } from '../../core/reasoning/reasoning.token';

export class MadiOrchestrator {
  constructor(
    @Inject(MADI_REASONING_PORT)
    private readonly reasoning: MadiReasoningPort,
  ) {}

  async execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    const result = await this.reasoning.reason(request);

    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      ...result,
    };
  }
}
