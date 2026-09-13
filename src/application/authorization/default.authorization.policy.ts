import { MadiAuthorizationPolicy, MadiAuthorizationRequest, MadiAuthorizationResult } from '../../core/authorization/authorization.contract';
import { MadiAuthorizationApprovalService } from '../../core/authorization/authorization.approval.contract';

export class DefaultAuthorizationPolicy implements MadiAuthorizationPolicy {
  constructor(private readonly approvals?: MadiAuthorizationApprovalService) {}

  async authorize(request: MadiAuthorizationRequest): Promise<MadiAuthorizationResult> {
    if (request.token && this.approvals && await this.approvals.validateAndConsume(request.token, request.capabilityId, request.operation)) {
      return { decision: 'allowed' };
    }
    if (request.risk === 'low') return { decision: 'allowed' };
    return { decision: 'required', reason: 'Necesito tu confirmación antes de realizar esta operación.' };
  }
}
