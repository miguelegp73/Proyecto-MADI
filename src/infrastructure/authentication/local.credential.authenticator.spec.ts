import { LocalCredentialAuthenticator } from './local.credential.authenticator';

describe('LocalCredentialAuthenticator', () => {
  const previous = process.env;

  beforeEach(() => {
    process.env = { ...previous };
    process.env.MADI_CREDENTIAL_TYPE = 'local';
    process.env.MADI_CREDENTIAL_SECRET = 'secret-123';
    process.env.MADI_USER_ID = 'miguel';
    process.env.MADI_DISPLAY_NAME = 'Miguel';
  });

  afterAll(() => {
    process.env = previous;
  });

  it('authenticates the configured credential', async () => {
    const result = await new LocalCredentialAuthenticator().authenticate({
      credentialType: 'local',
      credential: 'secret-123',
    });
    expect(result.authenticated).toBe(true);
    expect(result.identity).toEqual({ userId: 'miguel', displayName: 'Miguel', method: 'credential' });
  });

  it('rejects an invalid credential', async () => {
    const result = await new LocalCredentialAuthenticator().authenticate({
      credentialType: 'local',
      credential: 'wrong',
    });
    expect(result.authenticated).toBe(false);
    expect(result.error?.code).toBe('INVALID_CREDENTIAL');
  });
});
