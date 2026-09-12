import { DefaultAuthorizationPolicy } from '../../application/authorization/default.authorization.policy';

describe('DefaultAuthorizationPolicy', () => {
  it('allows low-risk operations', async () => {
    const policy = new DefaultAuthorizationPolicy();
    await expect(policy.authorize({ capabilityId: 'test', operation: 'read', risk: 'low' })).resolves.toEqual({ decision: 'allowed' });
  });

  it('requires explicit authorization for higher-risk operations', async () => {
    const policy = new DefaultAuthorizationPolicy();
    await expect(policy.authorize({ capabilityId: 'test', operation: 'write', risk: 'high' })).resolves.toMatchObject({ decision: 'required' });
  });
});
