import { DefaultContextManager } from '../../application/context/default.context.manager';

describe('DefaultContextManager', () => {
  it('preserves request context without inventing additional data', async () => {
    const manager = new DefaultContextManager();
    await expect(manager.build({ source: 'test' })).resolves.toEqual({ values: { source: 'test' } });
  });
});
