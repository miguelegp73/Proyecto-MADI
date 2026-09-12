import { BasicReasoningEngine } from './basic.reasoning.engine';

const request = {
  requestId: 'reasoning-001',
  timestamp: '2026-09-12T19:00:00.000Z',
  source: { applicationId: 'test-app', interface: 'text' },
  input: { type: 'text' as const, content: '¿Cuál es el estado de M.A.D.I.?' },
};

describe('BasicReasoningEngine', () => {
  const engine = new BasicReasoningEngine();

  it('reasons about the M.A.D.I. status intent without using an external provider', async () => {
    const result = await engine.reason({
      request,
      intent: {
        name: 'information.madi.status',
        domain: 'information',
        confidence: 0.98,
        requiresClarification: false,
      },
      context: { values: { conversationId: 'c1' } },
    });

    expect(result.confidence).toBe(0.98);
    expect(result.conclusions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'capability', value: expect.stringContaining('madi.status') }),
      ]),
    );
    expect(result.proposedActions).toEqual([]);
  });

  it('does not invent an action for a greeting', async () => {
    const result = await engine.reason({
      request: { ...request, input: { ...request.input, content: 'Hola M.A.D.I.' } },
      intent: {
        name: 'conversation.greeting',
        domain: 'conversation',
        confidence: 0.99,
        requiresClarification: false,
      },
      context: { values: {} },
    });

    expect(result.proposedActions).toEqual([]);
    expect(result.recommendations).toEqual([]);
  });

  it('keeps uncertainty explicit for an unclassified intent', async () => {
    const result = await engine.reason({
      request,
      intent: {
        name: 'unknown.unclassified',
        domain: 'unknown',
        confidence: 0,
        requiresClarification: true,
      },
      context: { values: {} },
    });

    expect(result.confidence).toBe(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.recommendations).toEqual([
      { type: 'clarification', value: 'Solicitar al usuario que precise qué necesita.' },
    ]);
  });
});
