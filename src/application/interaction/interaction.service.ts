import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';

export class InteractionService {
  constructor(private readonly orchestrator: MadiOrchestrator) {}

  execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    return this.orchestrator.execute(request);
  }
}
