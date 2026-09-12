import { MadiInteractionRequest, MadiInteractionResponse } from '../../core/interaction/interaction.contract';
import {
  MadiInterfaceEvent,
  MadiInterfaceGateway,
} from '../../core/interface/interface.contract';
import { InteractionService } from '../interaction/interaction.service';

/** Adapts text/transcribed voice events to the existing interaction boundary. */
export class ApplicationInterfaceGateway implements MadiInterfaceGateway {
  constructor(private readonly interactionService: InteractionService) {}

  async handle(event: MadiInterfaceEvent): Promise<MadiInteractionResponse | { accepted: true }> {
    if (event.type === 'input.started') return { accepted: true };
    if (event.type !== 'input.received') {
      return { accepted: true };
    }

    const payload = (event.payload ?? {}) as Record<string, unknown>;
    const content = typeof payload.content === 'string' ? payload.content : undefined;
    if (!content) {
      throw new Error('El evento de interfaz requiere payload.content.');
    }

    const request: MadiInteractionRequest = {
      requestId: event.id,
      timestamp: event.timestamp,
      source: {
        applicationId: typeof payload.applicationId === 'string' ? payload.applicationId : 'madi-interface',
        interface: event.interface,
      },
      input: {
        type: event.interface === 'voice' ? 'voice' : 'text',
        content,
      },
      context: typeof payload.context === 'object' && payload.context !== null
        ? payload.context as Record<string, unknown>
        : undefined,
      metadata: typeof payload.metadata === 'object' && payload.metadata !== null
        ? payload.metadata as Record<string, unknown>
        : undefined,
    };

    return this.interactionService.execute(request);
  }
}
