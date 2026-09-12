import { MadiCapability } from './capability.contract';
import { MadiCapabilityRegistry } from './capability.registry';

describe('MadiCapabilityRegistry', () => {
  const capability: MadiCapability = {
    id: 'test.example',
    name: 'Example',
    description: 'Test capability',
    risk: 'low',
    requiresAuthorization: false,
    execute: jest.fn(),
  };

  it('registers and retrieves a capability by id', () => {
    const registry = new MadiCapabilityRegistry();

    registry.register(capability);

    expect(registry.has('test.example')).toBe(true);
    expect(registry.get('test.example')).toBe(capability);
  });

  it('lists registered capabilities', () => {
    const registry = new MadiCapabilityRegistry();

    registry.register(capability);

    expect(registry.list()).toEqual([capability]);
  });

  it('rejects duplicate capability ids', () => {
    const registry = new MadiCapabilityRegistry();

    registry.register(capability);

    expect(() => registry.register(capability)).toThrow(
      "La capacidad 'test.example' ya está registrada.",
    );
  });
});
