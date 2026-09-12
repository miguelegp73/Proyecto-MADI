import { Inject, Optional } from '@nestjs/common';
import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiReasoningPort } from '../../core/reasoning/reasoning.port';
import { MADI_REASONING_PORT } from '../../core/reasoning/reasoning.token';
import { MadiAgentPipeline } from '../pipeline/madi.agent.pipeline';

export class MadiOrchestrator {
  constructor(
    @Inject(MADI_REASONING_PORT)
    private readonly reasoning: MadiReasoningPort,
    @Optional()
    private readonly agentPipeline?: MadiAgentPipeline,
  ) {}

  async execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    if (this.agentPipeline) {
      return this.agentPipeline.process(request);
    }

    const result = await this.reasoning.reason(request);

    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      ...result,
    };
  }
}
