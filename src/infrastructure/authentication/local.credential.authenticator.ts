import { timingSafeEqual } from 'node:crypto';
import { MadiCredentialAuthenticator, MadiCredentialAuthenticationRequest, MadiCredentialAuthenticationResult } from '../../core/authentication/credential.contract';

/** Local bootstrap adapter for v0.1. It is intentionally replaceable by a real identity provider. */
export class LocalCredentialAuthenticator implements MadiCredentialAuthenticator {
  async authenticate(request: MadiCredentialAuthenticationRequest): Promise<MadiCredentialAuthenticationResult> {
    const expected = process.env.MADI_CREDENTIAL_SECRET;
    const expectedType = process.env.MADI_CREDENTIAL_TYPE ?? 'local';
    const userId = process.env.MADI_USER_ID;
    const displayName = process.env.MADI_DISPLAY_NAME;

    if (!expected || !userId) {
      return { authenticated: false, error: { code: 'AUTH_NOT_CONFIGURED', message: 'La credencial local de M.A.D.I. no está configurada.' } };
    }
    if (request.credentialType !== expectedType || !request.credential) {
      return { authenticated: false, error: { code: 'INVALID_CREDENTIAL', message: 'La credencial no es válida.' } };
    }

    const provided = Buffer.from(request.credential);
    const stored = Buffer.from(expected);
    const valid = provided.length === stored.length && timingSafeEqual(provided, stored);
    if (!valid) {
      return { authenticated: false, error: { code: 'INVALID_CREDENTIAL', message: 'La credencial no es válida.' } };
    }

    return { authenticated: true, identity: { userId, displayName, method: 'credential' } };
  }
}
