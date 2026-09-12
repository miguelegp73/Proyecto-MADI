import { InteractionService } from './interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';

describe('InteractionService', () => {
  it('returns a response linked to the original request', () => {
    const service = new InteractionService();
    const request: MadiInteractionRequest = {
      requestId: 'test-request-001',
      timestamp: '2026-09-12T16:00:00.000Z',
      source: {
        applicationId: 'test-app',
        interface: 'text',
      },
      input: {
        type: 'text',
        content: 'Hola M.A.D.I.',
      },
    };

    expect(service.handle(request)).toMatchObject({
      requestId: 'test-request-001',
      status: 'completed',
      data: [
        {
          type: 'acknowledgement',
          message: 'Solicitud recibida por el núcleo de M.A.D.I. v0.1.',
        },
      ],
    });
  });
});
