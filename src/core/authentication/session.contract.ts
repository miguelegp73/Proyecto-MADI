import { MadiAuthenticationResult } from './authentication.flow.contract';

export type MadiSessionState = 'anonymous' | 'authenticated' | 'expired';

export interface MadiAuthenticatedIdentity {
  userId: string;
  displayName?: string;
  method: 'voice' | 'credential';
}

export interface MadiAuthenticationSession {
  sessionId: string;
  state: MadiSessionState;
  identity?: MadiAuthenticatedIdentity;
  authenticatedAt?: string;
  expiresAt?: string;
}

/** Converts authentication into a session identity without granting permissions. */
export interface MadiSessionManager {
  establish(result: MadiAuthenticationResult): Promise<MadiAuthenticationSession>;
  get(sessionId: string): Promise<MadiAuthenticationSession | undefined>;
  expire(sessionId: string): Promise<void>;
}
