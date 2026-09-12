export type MadiAuthorizationDecision = 'allowed' | 'denied' | 'required';

export interface MadiAuthorizationRequest {
  capabilityId: string;
  operation: string;
  risk: 'low' | 'moderate' | 'high';
  token?: string;
}

export interface MadiAuthorizationResult {
  decision: MadiAuthorizationDecision;
  reason?: string;
}

export interface MadiAuthorizationPolicy {
  authorize(request: MadiAuthorizationRequest): Promise<MadiAuthorizationResult>;
}
