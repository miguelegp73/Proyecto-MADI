import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the M.A.D.I. health contract', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'madi',
      version: '0.1.0',
    });
  });
});
