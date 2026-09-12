import { MadiCapability, MadiCapabilityRequest, MadiCapabilityResult } from './capability.contract';

export class MadiTimeCapability implements MadiCapability {
  readonly id = 'system.time';
  readonly name = 'Hora local';
  readonly description = 'Obtiene la hora local del proceso sin depender de un proveedor externo.';
  readonly risk = 'low' as const;
  readonly requiresAuthorization = false;

  async execute(_request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    const now = new Date();
    return { success: true, output: { iso: now.toISOString(), text: new Intl.DateTimeFormat('es-AR', { timeStyle: 'medium' }).format(now) } };
  }
}
