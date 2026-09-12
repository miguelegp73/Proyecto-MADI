export interface MadiVerificationRequest {
  capabilityId: string;
  operation: string;
  expected?: unknown;
  actual: unknown;
}

export interface MadiVerificationResult {
  verified: boolean;
  reason?: string;
}

export interface MadiVerifier {
  verify(request: MadiVerificationRequest): Promise<MadiVerificationResult>;
}
