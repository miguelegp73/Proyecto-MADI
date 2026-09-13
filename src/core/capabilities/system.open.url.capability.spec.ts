import { SystemOpenUrlCapability } from './system.open.url.capability';

describe('SystemOpenUrlCapability', () => {
  const capability = new SystemOpenUrlCapability();

  it('accepts explicit HTTP and HTTPS URLs', async () => {
    await expect(capability.execute({
      capabilityId: capability.id,
      operation: 'execute',
      input: { url: 'https://example.com/path' },
    })).resolves.toEqual({
      success: true,
      output: { openUrl: 'https://example.com/path' },
    });
  });

  it('rejects missing or malformed URLs', async () => {
    await expect(capability.execute({
      capabilityId: capability.id,
      operation: 'execute',
      input: {},
    })).resolves.toMatchObject({ success: false, error: { code: 'INVALID_URL' } });

    await expect(capability.execute({
      capabilityId: capability.id,
      operation: 'execute',
      input: { url: 'not-a-url' },
    })).resolves.toMatchObject({ success: false, error: { code: 'INVALID_URL' } });
  });

  it('rejects non-web protocols', async () => {
    await expect(capability.execute({
      capabilityId: capability.id,
      operation: 'execute',
      input: { url: 'file:///C:/secret.txt' },
    })).resolves.toMatchObject({
      success: false,
      error: { code: 'URL_PROTOCOL_NOT_ALLOWED' },
    });
  });
});
