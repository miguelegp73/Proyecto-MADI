import { randomUUID } from 'crypto';
import {
  MadiAuthorizationApproval,
  MadiAuthorizationApprovalRequest,
  MadiAuthorizationApprovalService,
} from '../../core/authorization/authorization.approval.contract';

const APPROVAL_TTL_MS = 60_000;

export class InMemoryAuthorizationApprovalService implements MadiAuthorizationApprovalService {
  private readonly approvals = new Map<string, MadiAuthorizationApproval>();

  async create(request: MadiAuthorizationApprovalRequest): Promise<MadiAuthorizationApproval> {
    const approval: MadiAuthorizationApproval = {
      approvalId: randomUUID(),
      sessionId: request.sessionId,
      capabilityId: request.capabilityId,
      operation: request.operation,
      approved: false,
      expiresAt: new Date(Date.now() + APPROVAL_TTL_MS).toISOString(),
    };
    this.approvals.set(approval.approvalId, approval);
    return approval;
  }

  async approve(approvalId: string, sessionId: string): Promise<boolean> {
    const approval = this.approvals.get(approvalId);
    if (!approval || approval.sessionId !== sessionId || this.expired(approval)) return false;
    this.approvals.set(approvalId, { ...approval, approved: true });
    return true;
  }

  async validateAndConsume(token: string, capabilityId: string, operation: string): Promise<boolean> {
    const approval = this.approvals.get(token);
    if (!approval || !approval.approved || approval.capabilityId !== capabilityId || approval.operation !== operation || this.expired(approval)) return false;
    this.approvals.delete(token);
    return true;
  }

  private expired(approval: MadiAuthorizationApproval): boolean {
    return Date.now() >= new Date(approval.expiresAt).getTime();
  }
}
