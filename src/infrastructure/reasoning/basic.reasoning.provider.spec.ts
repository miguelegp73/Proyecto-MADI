import { BasicReasoningProvider } from './basic.reasoning.provider';

describe('BasicReasoningProvider', () => {
  it('is always available without network or credentials', async () => {
    const provider = new BasicReasoningProvider();
    await expect(provider.isAvailable()).resolves.toBe(true);
  });

  it('delegates reasoning to the local baseline engine', async () => {
    const engine = { reason: jest.fn().mockResolvedValue({ confidence: 1, inferences: [], conclusions: [], recommendations: [], proposedActions: [] }) };
    const provider = new BasicReasoningProvider(engine as never);
    const input = {
      request: { requestId: '1', timestamp: '2026-09-12T19:00:00.000Z', source: { applicationId: 'test', interface: 'text' as const }, input: { type: 'text' as const, content: 'hola' } },
      intent: { name: 'conversation.greeting', domain: 'conversation' as const, confidence: 1, requiresClarification: false },
      context: { values: {} },
    };

    await provider.reason(input);
    expect(engine.reason).toHaveBeenCalledWith(input);
  });
});
