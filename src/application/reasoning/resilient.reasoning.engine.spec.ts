import { MadiReasoningResult } from '../../core/reasoning/reasoning.engine';
import { MadiReasoningProvider } from '../../core/reasoning/reasoning.provider';
import { ResilientReasoningEngine } from './resilient.reasoning.engine';

const input = {
  request: {
    requestId: 'reasoning-provider-001',
    timestamp: '2026-09-12T19:00:00.000Z',
    source: { applicationId: 'test-app', interface: 'text' as const },
    input: { type: 'text' as const, content: 'prueba' },
  },
  intent: {
    name: 'action.test',
    domain: 'action' as const,
    confidence: 1,
    requiresClarification: false,
  },
  context: { values: {} },
};

const result: MadiReasoningResult = {
  confidence: 1,
  inferences: [],
  conclusions: [{ type: 'provider' }],
  recommendations: [],
  proposedActions: [],
};

function provider(id: string, priority: number, available: boolean, response = result): MadiReasoningProvider {
  return {
    id,
    priority,
    isAvailable: jest.fn().mockResolvedValue(available),
    reason: jest.fn().mockResolvedValue(response),
  };
}

describe('ResilientReasoningEngine', () => {
  it('uses providers by deterministic priority and falls back only when needed', async () => {
    const first = provider('second', 20, true);
    const preferred = provider('first', 10, true);
    const fallback = { reason: jest.fn().mockResolvedValue(result) };

    const engine = new ResilientReasoningEngine([first, preferred], fallback);
    const output = await engine.reason(input);

    expect(preferred.reason).toHaveBeenCalledWith(input);
    expect(first.reason).not.toHaveBeenCalled();
    expect(fallback.reason).not.toHaveBeenCalled();
    expect(output).toEqual(result);
  });

  it('skips unavailable providers and preserves a successful later provider', async () => {
    const unavailable = provider('offline', 10, false);
    const available = provider('online', 20, true);
    const fallback = { reason: jest.fn() };

    const output = await new ResilientReasoningEngine([available, unavailable], fallback).reason(input);

    expect(available.reason).toHaveBeenCalledWith(input);
    expect(output.warnings).toEqual(["Proveedor 'offline' no disponible."]);
    expect(fallback.reason).not.toHaveBeenCalled();
  });

  it('falls back after provider failure and keeps the failure trace', async () => {
    const broken = provider('broken', 10, true);
    (broken.reason as jest.Mock).mockRejectedValue(new Error('timeout'));
    const fallback = { reason: jest.fn().mockResolvedValue(result) };

    const output = await new ResilientReasoningEngine([broken], fallback).reason(input);

    expect(fallback.reason).toHaveBeenCalledWith(input);
    expect(output.warnings).toEqual(["Proveedor 'broken' falló: timeout."]);
  });

  it('uses the safe baseline when there are no providers', async () => {
    const fallback = { reason: jest.fn().mockResolvedValue(result) };

    const output = await new ResilientReasoningEngine([], fallback).reason(input);

    expect(fallback.reason).toHaveBeenCalledWith(input);
    expect(output).toEqual(result);
  });
});
