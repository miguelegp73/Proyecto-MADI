import { InteractionService } from './interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';

describe('InteractionService', () => {
  it('delegates the interaction to the orchestrator', async () => {
    const orchestrator = {
      execute: jest.fn().mockResolvedValue({
        requestId: 'test-request-001',
        timestamp: '2026-09-12T16:00:00.000Z',
        status: 'completed',
      }),
    } as unknown as MadiOrchestrator;

    const service = new InteractionService(orchestrator);
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

    const response = await service.execute(request);

    expect(orchestrator.execute).toHaveBeenCalledWith(request);
    expect(response).toMatchObject({
      requestId: 'test-request-001',
      status: 'completed',
    });
  });
});
