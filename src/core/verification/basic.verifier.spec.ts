import { BasicVerifier } from './basic.verifier';

describe('BasicVerifier', () => {
  const verifier = new BasicVerifier();
  it('verifies when expected and actual results match', async () => {
    await expect(verifier.verify({ capabilityId: 'x', operation: 'run', expected: { ok: true }, actual: { ok: true } })).resolves.toMatchObject({ verified: true });
  });
  it('detects a mismatch', async () => {
    await expect(verifier.verify({ capabilityId: 'x', operation: 'run', expected: { ok: true }, actual: { ok: false } })).resolves.toMatchObject({ verified: false });
  });
});
