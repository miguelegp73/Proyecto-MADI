import {
  MadiAuthorizationPolicy,
  MadiAuthorizationRequest,
  MadiAuthorizationResult,
} from './authorization.contract';

export class BasicAuthorizationPolicy implements MadiAuthorizationPolicy {
  async authorize(
    request: MadiAuthorizationRequest,
  ): Promise<MadiAuthorizationResult> {
    if (request.risk === 'low') {
      return {
        decision: 'allowed',
        reason: 'La operación de bajo riesgo no requiere autorización adicional.',
      };
    }

    if (request.token) {
      return {
        decision: 'allowed',
        reason: 'Se recibió un token de autorización.',
      };
    }

    return {
      decision: 'required',
      reason: 'La operación requiere autorización explícita.',
    };
  }
}
