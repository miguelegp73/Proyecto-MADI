import { BasicAuthorizationPolicy } from './basic.authorization.policy';

describe('BasicAuthorizationPolicy', () => {
  const policy = new BasicAuthorizationPolicy();

  it('allows low-risk operations', async () => {
    await expect(
      policy.authorize({ capabilityId: 'x', operation: 'run', risk: 'low' }),
    ).resolves.toMatchObject({ decision: 'allowed' });
  });

  it('requires authorization for protected operations without a token', async () => {
    await expect(
      policy.authorize({ capabilityId: 'x', operation: 'run', risk: 'high' }),
    ).resolves.toMatchObject({ decision: 'required' });
  });

  it('allows a protected operation with a token', async () => {
    await expect(
      policy.authorize({ capabilityId: 'x', operation: 'run', risk: 'high', token: 'ok' }),
    ).resolves.toMatchObject({ decision: 'allowed' });
  });
});
