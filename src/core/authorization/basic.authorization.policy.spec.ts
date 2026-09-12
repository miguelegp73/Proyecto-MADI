import { BasicAuthorizationPolicy } from './basic.authorization.policy';

describe('BasicAuthorizationPolicy', () => {
  const policy = new BasicAuthorizationPolicy();
  it('allows operations without additional authorization', async () => {
    await expect(policy.decide({ capabilityId: 'x', operation: 'run', risk: 'low', requiresAuthorization: false })).resolves.toMatchObject({ allowed: true });
  });
  it('denies protected operations without a token', async () => {
    await expect(policy.decide({ capabilityId: 'x', operation: 'run', risk: 'high', requiresAuthorization: true })).resolves.toMatchObject({ allowed: false });
  });
  it('allows a protected operation with a token', async () => {
    await expect(policy.decide({ capabilityId: 'x', operation: 'run', risk: 'high', requiresAuthorization: true, authorizationToken: 'ok' })).resolves.toMatchObject({ allowed: true });
  });
});
