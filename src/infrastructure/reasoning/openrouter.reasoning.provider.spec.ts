import { OpenRouterReasoningProvider } from './openrouter.reasoning.provider';

describe('OpenRouterReasoningProvider', () => {
  const originalKey = process.env.OPENROUTER_API_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    jest.restoreAllMocks();
  });

  it('is unavailable without an API key', async () => {
    delete process.env.OPENROUTER_API_KEY;
    const provider = new OpenRouterReasoningProvider();
    await expect(provider.isAvailable()).resolves.toBe(false);
  });

  it('parses a valid provider response', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const provider = new OpenRouterReasoningProvider();
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        confidence: 0.9,
        inferences: ['fact'],
        conclusions: ['conclusion'],
        recommendations: ['recommendation'],
        proposedActions: [],
        warnings: [],
      }) } }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    const result = await provider.reason({
      request: { requestId: 'r1', timestamp: '2026-09-12T00:00:00Z', source: { applicationId: 'test', interface: 'text' }, input: { type: 'text', content: 'Hola' } },
      intent: { name: 'conversation.greeting', confidence: 1, entities: {} },
      context: { values: {}, source: 'test', timestamp: '2026-09-12T00:00:00Z' },
    });

    expect(result.confidence).toBe(0.9);
    expect(result.conclusions).toEqual(['conclusion']);
  });
});
