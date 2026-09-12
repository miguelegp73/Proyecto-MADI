import { MadiAgentPipeline } from './madi.agent.pipeline';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';

const request: MadiInteractionRequest = {
  requestId: 'pipeline-reasoning-001',
  timestamp: '2026-09-12T19:00:00.000Z',
  source: { applicationId: 'test-app', interface: 'text' },
  input: { type: 'text', content: '¿Cuál es el estado de M.A.D.I.?' },
};

describe('MadiAgentPipeline reasoning integration', () => {
  it('runs reasoning before planning and exposes the reasoning result', async () => {
    const reasoning = {
      reason: jest.fn().mockResolvedValue({
        confidence: 0.98,
        inferences: [{ type: 'test' }],
        conclusions: [{ type: 'test-conclusion' }],
        recommendations: [],
        proposedActions: [],
      }),
    };
    const plan = jest.fn().mockResolvedValue({ goal: request.input.content, steps: [] });

    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue({ name: 'information.test', domain: 'information', confidence: 1, requiresClarification: false }) },
      { build: jest.fn().mockResolvedValue({ values: {} }) },
      { plan },
      new MadiCapabilityRegistry(),
      { select: jest.fn() },
      { authorize: jest.fn() },
      { execute: jest.fn() },
      { verify: jest.fn() },
      undefined,
      reasoning,
    );

    const result = await pipeline.process(request);

    expect(reasoning.reason).toHaveBeenCalledWith(
      expect.objectContaining({ request, intent: expect.any(Object), context: { values: {} } }),
    );
    expect(plan).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({ reasoning: expect.objectContaining({ confidence: 0.98 }) }),
      }),
    );
    expect(result.reasoning?.confidence).toBe(0.98);
    expect(result.status).toBe('completed');
  });
});
