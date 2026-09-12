import { MadiInteractionRequest, MadiInteractionResponse } from '../../core/interaction/interaction.contract';
import { MadiIntentResolver } from '../../core/intent/intent.contract';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';

export interface MadiPipelineResult extends MadiInteractionResponse {
  intent?: unknown;
  plan?: unknown;
  execution?: unknown[];
}

export class MadiPipeline {
  constructor(
    private readonly intentResolver: MadiIntentResolver,
    private readonly capabilityRegistry: MadiCapabilityRegistry,
    private readonly capabilityExecutor: MadiCapabilityExecutor,
  ) {}

  async process(request: MadiInteractionRequest): Promise<MadiPipelineResult> {
    const intent = await this.intentResolver.resolve(request.input.content);

    if (intent.requiresClarification) {
      return {
        requestId: request.requestId,
        timestamp: new Date().toISOString(),
        status: 'needs_input',
        intent,
        warnings: ['La intención no pudo determinarse con suficiente confianza.'],
      };
    }

    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      intent,
      plan: { goal: request.input.content, steps: [] },
      execution: [],
      data: [{
        type: 'pipeline_ready',
        registeredCapabilities: this.capabilityRegistry.list().map((c) => c.id),
        executionBoundary: this.capabilityExecutor.constructor.name,
        executionPolicy: 'no-automatic-execution',
      }],
    };
  }
}
