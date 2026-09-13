export interface MadiAuthorizationApprovalRequest {
  sessionId: string;
  capabilityId: string;
  operation: string;
}

export interface MadiAuthorizationApproval {
  approvalId: string;
  sessionId: string;
  capabilityId: string;
  operation: string;
  approved: boolean;
  expiresAt: string;
}

export interface MadiAuthorizationApprovalService {
  create(request: MadiAuthorizationApprovalRequest): Promise<MadiAuthorizationApproval>;
  approve(approvalId: string, sessionId: string): Promise<boolean>;
  validateAndConsume(token: string, capabilityId: string, operation: string): Promise<boolean>;
}
