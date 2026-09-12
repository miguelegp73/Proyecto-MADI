import { BasicIntentResolver } from './intent.resolver';

describe('BasicIntentResolver', () => {
  it('recognizes a M.A.D.I. status request', async () => {
    const resolver = new BasicIntentResolver();

    await expect(resolver.resolve('¿Cuál es el estado de M.A.D.I.?')).resolves.toMatchObject({
      name: 'information.madi.status',
      domain: 'information',
      requiresClarification: false,
    });
  });
});
