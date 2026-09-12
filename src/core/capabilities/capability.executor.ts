import { MadiCapabilityRequest, MadiCapabilityResult } from './capability.contract';
import { MadiCapabilityRegistry } from './capability.registry';

export interface MadiCapabilityExecutor {
  execute(request: MadiCapabilityRequest): Promise<MadiCapabilityResult>;
}

export class RegistryCapabilityExecutor implements MadiCapabilityExecutor {
  constructor(private readonly registry: MadiCapabilityRegistry) {}

  async execute(request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    const capability = this.registry.get(request.capabilityId);

    if (!capability) {
      return {
        success: false,
        error: {
          code: 'CAPABILITY_NOT_FOUND',
          message: `La capacidad '${request.capabilityId}' no está registrada.`,
        },
      };
    }

    if (capability.requiresAuthorization && !request.authorizationToken) {
      return {
        success: false,
        error: {
          code: 'AUTHORIZATION_REQUIRED',
          message: `La capacidad '${request.capabilityId}' requiere autorización.`,
        },
      };
    }

    return capability.execute(request);
  }
}
