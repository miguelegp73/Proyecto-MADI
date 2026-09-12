import { MadiTimeCapability } from './madi.time.capability';

describe('MadiTimeCapability', () => {
  it('returns a valid current timestamp and localized text', async () => {
    const result = await new MadiTimeCapability().execute({ capabilityId: 'system.time', operation: 'execute' });
    expect(result.success).toBe(true);
    expect(result.output).toEqual(expect.objectContaining({ iso: expect.any(String), text: expect.any(String) }));
    expect(() => new Date((result.output as { iso: string }).iso)).not.toThrow();
  });
});
