import { SystemOpenAppCapability } from './system.open.app.capability';

describe('SystemOpenAppCapability', () => {
  const capability = new SystemOpenAppCapability();

  it('requires authorization', () => {
    expect(capability.risk).toBe('high');
    expect(capability.requiresAuthorization).toBe(true);
  });

  it('rejects non-allowlisted applications', async () => {
    await expect(capability.execute({ capabilityId: capability.id, operation: 'execute', input: { application: 'powershell' } }))
      .resolves.toMatchObject({ success: false, error: { code: 'APPLICATION_NOT_ALLOWED' } });
  });
});
