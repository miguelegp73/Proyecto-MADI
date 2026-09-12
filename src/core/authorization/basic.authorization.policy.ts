import { MadiAuthorizationRequest, MadiAuthorizationDecision, MadiAuthorizationPolicy } from './authorization.contract';

export class BasicAuthorizationPolicy implements MadiAuthorizationPolicy {
  async decide(request: MadiAuthorizationRequest): Promise<MadiAuthorizationDecision> {
    if (!request.requiresAuthorization) {
      return { allowed: true, reason: 'La operación no requiere autorización adicional.' };
    }
    if (request.authorizationToken) {
      return { allowed: true, reason: 'Se recibió un token de autorización.' };
    }
    return { allowed: false, reason: 'La operación requiere autorización.' };
  }
}
