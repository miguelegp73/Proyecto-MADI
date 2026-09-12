import { MadiAgentPipeline } from './madi.agent.pipeline';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapability } from '../../core/capabilities/capability.contract';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';

const request: MadiInteractionRequest = {
  requestId: 'agent-001',
  timestamp: '2026-09-12T19:00:00.000Z',
  source: { applicationId: 'test-app', interface: 'text' },
  input: { type: 'text', content: 'ejecuta prueba' },
};

const intent = {
  name: 'action.test',
  domain: 'action' as const,
  confidence: 1,
  requiresClarification: false,
};

function capability(requiresAuthorization = false): MadiCapability {
  return {
    id: 'test.example',
    name: 'Example',
    description: 'Test capability',
    risk: requiresAuthorization ? 'high' : 'low',
    requiresAuthorization,
    execute: jest.fn().mockResolvedValue({ success: true, output: { ok: true } }),
  };
}

function createPipeline(overrides: Partial<ConstructorParameters<typeof MadiAgentPipeline>[0]> = {}) {
  const registry = new MadiCapabilityRegistry();
  return {
    registry,
    pipeline: new MadiAgentPipeline(
      overrides as never,
      {} as never,
      {} as never,
      registry,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    ),
  };
}

describe('MadiAgentPipeline', () => {
  it('requests clarification before building context or executing', async () => {
    const context = { build: jest.fn() };
    const executor = { execute: jest.fn() };
    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue({ ...intent, requiresClarification: true }) },
      context,
      { plan: jest.fn() },
      new MadiCapabilityRegistry(),
      { select: jest.fn() },
      { authorize: jest.fn() },
      executor,
      { verify: jest.fn() },
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('needs_input');
    expect(context.build).not.toHaveBeenCalled();
    expect(executor.execute).not.toHaveBeenCalled();
  });

  it('executes a planned capability and verifies its output', async () => {
    const registry = new MadiCapabilityRegistry();
    const cap = capability();
    registry.register(cap);
    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue(intent) },
      { build: jest.fn().mockResolvedValue({ values: { session: 'x' } }) },
      { plan: jest.fn().mockResolvedValue({ goal: request.input.content, steps: [{ id: 's1', description: 'run', capabilityId: 'test.example', operation: 'run', expected: { ok: true }, requiresAuthorization: false }] }) },
      registry,
      { select: jest.fn().mockResolvedValue({ capabilityId: 'test.example', reason: 'planned', confidence: 1 }) },
      { authorize: jest.fn().mockResolvedValue({ decision: 'allowed' }) },
      { execute: jest.fn().mockResolvedValue({ success: true, output: { ok: true } }) },
      { verify: jest.fn().mockResolvedValue({ verified: true, reason: 'ok' }) },
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('completed');
    expect(result.execution).toHaveLength(1);
  });

  it('stops before execution when authorization is required', async () => {
    const registry = new MadiCapabilityRegistry();
    registry.register(capability(true));
    const execute = jest.fn();
    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue(intent) },
      { build: jest.fn().mockResolvedValue({ values: {} }) },
      { plan: jest.fn().mockResolvedValue({ goal: 'x', steps: [{ id: 's1', description: 'run', capabilityId: 'test.example', operation: 'run', requiresAuthorization: true }] }) },
      registry,
      { select: jest.fn().mockResolvedValue({ capabilityId: 'test.example', reason: 'planned', confidence: 1 }) },
      { authorize: jest.fn().mockResolvedValue({ decision: 'required', reason: 'Confirmación requerida' }) },
      { execute },
      { verify: jest.fn() },
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('needs_authorization');
    expect(execute).not.toHaveBeenCalled();
  });

  it('reports capability execution failure without verifying it', async () => {
    const registry = new MadiCapabilityRegistry();
    registry.register(capability());
    const verify = jest.fn();
    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue(intent) },
      { build: jest.fn().mockResolvedValue({ values: {} }) },
      { plan: jest.fn().mockResolvedValue({ goal: 'x', steps: [{ id: 's1', description: 'run', capabilityId: 'test.example', requiresAuthorization: false }] }) },
      registry,
      { select: jest.fn().mockResolvedValue({ capabilityId: 'test.example', reason: 'planned', confidence: 1 }) },
      { authorize: jest.fn().mockResolvedValue({ decision: 'allowed' }) },
      { execute: jest.fn().mockResolvedValue({ success: false, error: { code: 'TEST_FAILURE', message: 'falló' } }) },
      { verify },
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('failed');
    expect(result.error?.code).toBe('TEST_FAILURE');
    expect(verify).not.toHaveBeenCalled();
  });

  it('reports verification failure after successful execution', async () => {
    const registry = new MadiCapabilityRegistry();
    registry.register(capability());
    const pipeline = new MadiAgentPipeline(
      { resolve: jest.fn().mockResolvedValue(intent) },
      { build: jest.fn().mockResolvedValue({ values: {} }) },
      { plan: jest.fn().mockResolvedValue({ goal: 'x', steps: [{ id: 's1', description: 'run', capabilityId: 'test.example', requiresAuthorization: false }] }) },
      registry,
      { select: jest.fn().mockResolvedValue({ capabilityId: 'test.example', reason: 'planned', confidence: 1 }) },
      { authorize: jest.fn().mockResolvedValue({ decision: 'allowed' }) },
      { execute: jest.fn().mockResolvedValue({ success: true, output: { ok: false } }) },
      { verify: jest.fn().mockResolvedValue({ verified: false, reason: 'resultado inesperado' }) },
    );

    const result = await pipeline.process(request);

    expect(result.status).toBe('failed');
    expect(result.error?.code).toBe('VERIFICATION_FAILED');
  });
});
