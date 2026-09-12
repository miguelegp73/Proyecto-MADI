import {
  MadiAuthorizationPolicy,
  MadiAuthorizationRequest,
  MadiAuthorizationResult,
} from '../../core/authorization/authorization.contract';

export class DefaultAuthorizationPolicy implements MadiAuthorizationPolicy {
  async authorize(request: MadiAuthorizationRequest): Promise<MadiAuthorizationResult> {
    if (request.token) {
      return { decision: 'allowed' };
    }

    if (request.risk === 'low') {
      return { decision: 'allowed' };
    }

    return {
      decision: 'required',
      reason: 'La operación requiere autorización explícita.',
    };
  }
}
