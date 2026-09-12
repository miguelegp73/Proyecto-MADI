import { MadiAgentPipeline } from './madi.agent.pipeline';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiMemoryStore } from '../../core/memory/memory.contract';

const request = {
  requestId: 'memory-agent-001',
  timestamp: '2026-09-12T19:00:00.000Z',
  source: { applicationId: 'test-app', interface: 'text' },
  input: { type: 'text' as const, content: 'ejecuta prueba' },
  context: { conversationId: 'conv-1' },
};

describe('MadiAgentPipeline memory integration', () => {
  it('persists a completed interaction in its conversation scope', async () => {
    const memory: MadiMemoryStore = {
      remember: jest.fn().mockResolvedValue(undefined),
      recall: jest.fn().mockResolvedValue([]),
    };
    const registry = new MadiCapabilityRegistry();
    registry.register({
      id: 'test.example',
      name: 'Example',
      description: 'Test capability',
      risk: 'low',
      requiresAuthorization: false,
      execute: jest.fn().mockResolvedValue({ success: true, output: { ok: true } }),
    });

    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue({ name: 'action.test', domain: 'action', confidence: 1, requiresClarification: false }) },
      { build: jest.fn().mockResolvedValue({ values: {} }) },
      { plan: jest.fn().mockResolvedValue({ goal: request.input.content, steps: [{ id: 's1', description: 'run', capabilityId: 'test.example', requiresAuthorization: false }] }) },
      registry,
      { select: jest.fn().mockResolvedValue({ capabilityId: 'test.example', reason: 'planned', confidence: 1 }) },
      { authorize: jest.fn().mockResolvedValue({ decision: 'allowed' }) },
      { execute: jest.fn().mockResolvedValue({ success: true, output: { ok: true } }) },
      { verify: jest.fn().mockResolvedValue({ verified: true, reason: 'ok' }) },
      memory,
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('completed');
    expect(memory.remember).toHaveBeenCalledWith(expect.objectContaining({
      id: request.requestId,
      scope: 'conversation:conv-1',
      kind: 'interaction',
      content: request.input.content,
      metadata: expect.objectContaining({ status: 'completed' }),
    }));
  });
});
