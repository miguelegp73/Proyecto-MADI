import { MadiPipeline } from './madi.pipeline';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiIntentResolver } from '../../core/intent/intent.contract';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';

describe('MadiPipeline', () => {
  const request: MadiInteractionRequest = {
    requestId: 'pipeline-001', timestamp: '2026-09-12T19:00:00.000Z',
    source: { applicationId: 'test-app', interface: 'text' },
    input: { type: 'text', content: 'Hola M.A.D.I.' },
  };

  it('resolves intent and exposes capabilities without executing them', async () => {
    const resolver: MadiIntentResolver = { resolve: jest.fn().mockResolvedValue({ name: 'conversation.greeting', domain: 'conversation', confidence: 0.99, requiresClarification: false }) };
    const registry = new MadiCapabilityRegistry();
    const executor: MadiCapabilityExecutor = { execute: jest.fn() };
    const result = await new MadiPipeline(resolver, registry, executor).process(request);
    expect(resolver.resolve).toHaveBeenCalledWith(request.input.content);
    expect(executor.execute).not.toHaveBeenCalled();
    expect(result.status).toBe('completed');
    expect(result.intent).toEqual(expect.objectContaining({ name: 'conversation.greeting' }));
  });

  it('requests clarification for an unresolved intent', async () => {
    const resolver: MadiIntentResolver = { resolve: jest.fn().mockResolvedValue({ name: 'unknown.unclassified', domain: 'unknown', confidence: 0, requiresClarification: true }) };
    const result = await new MadiPipeline(resolver, new MadiCapabilityRegistry(), { execute: jest.fn() }).process({ ...request, input: { type: 'text', content: '...' } });
    expect(result.status).toBe('needs_input');
  });
});
