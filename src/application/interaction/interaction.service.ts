import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { NaturalResponseComposer } from '../response/natural.response.composer';

export class InteractionService {
  constructor(
    private readonly orchestrator: MadiOrchestrator,
    private readonly responseComposer?: NaturalResponseComposer,
  ) {}

  async execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    const response = await this.orchestrator.execute(request);
    if (!this.responseComposer || response.responseText) return response;

    return {
      ...response,
      responseText: this.responseComposer.compose(response as typeof response & { intent?: unknown; execution?: unknown[] }),
    };
  }
}
