import { MadiStatusCapability } from './madi.status.capability';

describe('MadiStatusCapability', () => {
  it('returns the operational identity without authorization', async () => {
    const capability = new MadiStatusCapability();

    const result = await capability.execute({
      capabilityId: capability.id,
      operation: 'execute',
    });

    expect(result.success).toBe(true);
    expect(result.output).toMatchObject({
      name: 'M.A.D.I.',
      fullName: 'Módulo Autónomo de Datos e Inteligencia',
      version: '0.1',
      status: 'operational',
      authorizationRequired: false,
    });
  });
});
