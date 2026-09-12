import { MadiCapability, MadiCapabilityRequest, MadiCapabilityResult } from './capability.contract';
import { MadiCapabilityRegistry } from './capability.registry';

export class MadiCapabilitiesCapability implements MadiCapability {
  readonly id = 'madi.capabilities';
  readonly name = 'Capacidades de M.A.D.I.';
  readonly description = 'Lista las capacidades actualmente registradas en el núcleo.';
  readonly risk = 'low' as const;
  readonly requiresAuthorization = false;

  constructor(private readonly registry: MadiCapabilityRegistry) {}

  async execute(_request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    return {
      success: true,
      output: this.registry.list().map((capability) => ({
        id: capability.id,
        name: capability.name,
        description: capability.description,
        risk: capability.risk,
        requiresAuthorization: capability.requiresAuthorization,
      })),
    };
  }
}
