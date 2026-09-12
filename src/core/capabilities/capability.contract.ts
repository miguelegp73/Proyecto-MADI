export type MadiCapabilityRisk = 'low' | 'moderate' | 'high';

export interface MadiCapabilityRequest {
  capabilityId: string;
  operation: string;
  input?: Record<string, unknown>;
  authorizationToken?: string;
}

export interface MadiCapabilityResult {
  success: boolean;
  output?: unknown;
  error?: {
    code: string;
    message: string;
  };
}

export interface MadiCapability {
  id: string;
  name: string;
  description: string;
  risk: MadiCapabilityRisk;
  requiresAuthorization: boolean;
  execute(request: MadiCapabilityRequest): Promise<MadiCapabilityResult>;
}
