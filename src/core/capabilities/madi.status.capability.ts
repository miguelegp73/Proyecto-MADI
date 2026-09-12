import {
  MadiCapability,
  MadiCapabilityRequest,
  MadiCapabilityResult,
} from './capability.contract';

export class MadiStatusCapability implements MadiCapability {
  readonly id = 'madi.status';
  readonly name = 'Estado de M.A.D.I.';
  readonly description = 'Devuelve el estado básico y la identidad operativa de M.A.D.I.';
  readonly risk = 'low' as const;
  readonly requiresAuthorization = false;

  async execute(_request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    return {
      success: true,
      output: {
        name: 'M.A.D.I.',
        fullName: 'Módulo Autónomo de Datos e Inteligencia',
        version: '0.1',
        status: 'operational',
        authorizationRequired: false,
      },
    };
  }
}
