import { MadiCapability } from './capability.contract';

export class MadiCapabilityRegistry {
  private readonly capabilities = new Map<string, MadiCapability>();

  register(capability: MadiCapability): void {
    if (this.capabilities.has(capability.id)) {
      throw new Error(`La capacidad '${capability.id}' ya está registrada.`);
    }

    this.capabilities.set(capability.id, capability);
  }

  get(capabilityId: string): MadiCapability | undefined {
    return this.capabilities.get(capabilityId);
  }

  has(capabilityId: string): boolean {
    return this.capabilities.has(capabilityId);
  }

  list(): MadiCapability[] {
    return [...this.capabilities.values()];
  }
}
