import { SystemOpenAppCapability } from './system.open.app.capability';

describe('SystemOpenAppCapability', () => {
  const capability = new SystemOpenAppCapability();

  it('does not require session authorization for allowlisted local applications', () => {
    expect(capability.risk).toBe('low');
    expect(capability.requiresAuthorization).toBe(false);
  });

  it('rejects non-allowlisted applications', async () => {
    await expect(capability.execute({ capabilityId: capability.id, operation: 'execute', input: { application: 'powershell' } }))
      .resolves.toMatchObject({ success: false, error: { code: 'APPLICATION_NOT_ALLOWED' } });
  });
});
