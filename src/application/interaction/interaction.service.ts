import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';

export class InteractionService {
  handle(request: MadiInteractionRequest): MadiInteractionResponse {
    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      data: [
        {
          type: 'acknowledgement',
          message: 'Solicitud recibida por el núcleo de M.A.D.I. v0.1.',
        },
      ],
    };
  }
}
