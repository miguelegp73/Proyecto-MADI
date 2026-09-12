import {
  MadiAuthenticationSession,
  MadiSessionManager,
} from '../../core/authentication/session.contract';
import { MadiAuthenticationResult } from '../../core/authentication/authentication.flow.contract';

/** Minimal process-local session implementation. Replaceable when persistent auth is introduced. */
export class InMemorySessionManager implements MadiSessionManager {
  private readonly sessions = new Map<string, MadiAuthenticationSession>();

  async establish(result: MadiAuthenticationResult): Promise<MadiAuthenticationSession> {
    if (!result.authenticated || !result.identity?.userId) {
      throw new Error('No se puede establecer una sesión sin identidad autenticada.');
    }

    const session: MadiAuthenticationSession = {
      sessionId: crypto.randomUUID(),
      state: 'authenticated',
      identity: result.identity,
      authenticatedAt: new Date().toISOString(),
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  async get(sessionId: string): Promise<MadiAuthenticationSession | undefined> {
    return this.sessions.get(sessionId);
  }

  async expire(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    this.sessions.set(sessionId, { ...session, state: 'expired' });
  }
}
