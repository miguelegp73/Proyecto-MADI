import {
  MadiCapability,
  MadiCapabilityRequest,
  MadiCapabilityResult,
} from './capability.contract';

/** Produces a browser-open instruction for a trusted interface. Authorization is mandatory. */
export class SystemOpenUrlCapability implements MadiCapability {
  readonly id = 'system.open-url';
  readonly name = 'Abrir sitio web';
  readonly description = 'Solicita abrir una URL HTTP o HTTPS explícita en la interfaz de M.A.D.I.';
  readonly risk = 'high' as const;
  readonly requiresAuthorization = true;

  async execute(request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    const value = request.input?.url;
    if (typeof value !== 'string' || !value.trim()) {
      return { success: false, error: { code: 'INVALID_URL', message: 'Debes indicar una URL.' } };
    }

    let url: URL;
    try {
      url = new URL(value.trim());
    } catch {
      return { success: false, error: { code: 'INVALID_URL', message: 'La URL indicada no es válida.' } };
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return {
        success: false,
        error: { code: 'URL_PROTOCOL_NOT_ALLOWED', message: 'Solo se permiten URLs HTTP y HTTPS.' },
      };
    }

    return { success: true, output: { openUrl: url.toString() } };
  }
}
