import { MadiCapability } from './capability.contract';
import { RegistryCapabilityExecutor } from './capability.executor';
import { MadiCapabilityRegistry } from './capability.registry';

describe('RegistryCapabilityExecutor', () => {
  const createRegistry = (requiresAuthorization = false) => {
    const registry = new MadiCapabilityRegistry();
    const capability: MadiCapability = {
      id: 'test.example',
      name: 'Example',
      description: 'Test capability',
      risk: requiresAuthorization ? 'high' : 'low',
      requiresAuthorization,
      execute: jest.fn().mockResolvedValue({ success: true, output: 'ok' }),
    };
    registry.register(capability);
    return { registry, capability };
  };

  it('rejects an unknown capability', async () => {
    const executor = new RegistryCapabilityExecutor(new MadiCapabilityRegistry());

    await expect(executor.execute({ capabilityId: 'missing', operation: 'run' })).resolves.toEqual({
      success: false,
      error: {
        code: 'CAPABILITY_NOT_FOUND',
        message: "La capacidad 'missing' no está registrada.",
      },
    });
  });

  it('requires authorization before executing a protected capability', async () => {
    const { registry, capability } = createRegistry(true);
    const executor = new RegistryCapabilityExecutor(registry);

    await expect(executor.execute({ capabilityId: 'test.example', operation: 'run' })).resolves.toMatchObject({
      success: false,
      error: { code: 'AUTHORIZATION_REQUIRED' },
    });
    expect(capability.execute).not.toHaveBeenCalled();
  });

  it('executes an authorized capability', async () => {
    const { registry, capability } = createRegistry(true);
    const executor = new RegistryCapabilityExecutor(registry);

    await expect(
      executor.execute({
        capabilityId: 'test.example',
        operation: 'run',
        authorizationToken: 'authorized',
      }),
    ).resolves.toEqual({ success: true, output: 'ok' });
    expect(capability.execute).toHaveBeenCalledTimes(1);
  });
});
