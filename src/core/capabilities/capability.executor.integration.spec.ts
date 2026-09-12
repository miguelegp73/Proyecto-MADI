import { MadiCapability } from './capability.contract';
import { RegistryCapabilityExecutor } from './capability.executor';
import { MadiCapabilityRegistry } from './capability.registry';

describe('Capability execution boundary', () => {
  it('keeps execution behind the registry and capability contract', async () => {
    const registry = new MadiCapabilityRegistry();
    const capability: MadiCapability = {
      id: 'pc.example',
      name: 'PC Example',
      description: 'Non-real execution boundary test',
      risk: 'moderate',
      requiresAuthorization: false,
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    registry.register(capability);
    const executor = new RegistryCapabilityExecutor(registry);

    await executor.execute({ capabilityId: 'pc.example', operation: 'test' });

    expect(capability.execute).toHaveBeenCalledWith({
      capabilityId: 'pc.example',
      operation: 'test',
    });
  });
});
