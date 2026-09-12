import { BasicVerifier } from '../../application/verification/basic.verifier';

describe('BasicVerifier', () => {
  it('verifies matching expected and actual results', async () => {
    const verifier = new BasicVerifier();
    await expect(verifier.verify({ capabilityId: 'test', operation: 'read', expected: { ok: true }, actual: { ok: true } })).resolves.toEqual({ verified: true });
  });

  it('rejects a mismatching result', async () => {
    const verifier = new BasicVerifier();
    await expect(verifier.verify({ capabilityId: 'test', operation: 'read', expected: { ok: true }, actual: { ok: false } })).resolves.toMatchObject({ verified: false });
  });
});
