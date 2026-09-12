import { NaturalGreetingService } from './natural.greeting.service';

describe('NaturalGreetingService', () => {
  const service = new NaturalGreetingService();

  it('greets a newly authenticated user by display name', async () => {
    const result = await service.greet({
      sessionId: 'session-1',
      state: 'authenticated',
      identity: { userId: 'miguel', displayName: 'Miguel', method: 'voice' },
      authenticatedAt: '2026-09-12T22:00:00.000Z',
    });

    expect(result).toEqual({
      shouldGreet: true,
      message: '¡Hola Miguel! Bienvenido. ¿En qué puedo ayudarte?',
    });
  });

  it('uses a neutral greeting when display name is unavailable', async () => {
    const result = await service.greet({
      sessionId: 'session-2',
      state: 'authenticated',
      identity: { userId: 'user-2', method: 'credential' },
    });

    expect(result.message).toBe('¡Hola! Bienvenido. ¿En qué puedo ayudarte?');
  });

  it('does not greet anonymous or expired sessions', async () => {
    await expect(service.greet({ sessionId: 'anonymous', state: 'anonymous' }))
      .resolves.toEqual({ shouldGreet: false });
    await expect(service.greet({ sessionId: 'expired', state: 'expired' }))
      .resolves.toEqual({ shouldGreet: false });
  });
});
