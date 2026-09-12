import { MadiOrchestrator } from './madi.orchestrator';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import { MadiReasoningPort } from '../../core/reasoning/reasoning.port';

describe('MadiOrchestrator', () => {
  it('delegates reasoning without knowing the provider', async () => {
    const reasoning: MadiReasoningPort = {
      reason: jest.fn().mockResolvedValue({
        status: 'completed',
        conclusions: [{ text: 'Análisis completado.' }],
      }),
    };

    const orchestrator = new MadiOrchestrator(reasoning);
    const request: MadiInteractionRequest = {
      requestId: 'orchestrator-test-001',
      timestamp: '2026-09-12T19:00:00.000Z',
      source: {
        applicationId: 'test-app',
        interface: 'text',
      },
      input: {
        type: 'text',
        content: 'Analiza esta situación.',
      },
    };

    const response = await orchestrator.execute(request);

    expect(reasoning.reason).toHaveBeenCalledWith(request);
    expect(response).toMatchObject({
      requestId: request.requestId,
      status: 'completed',
      conclusions: [{ text: 'Análisis completado.' }],
    });
  });
});
