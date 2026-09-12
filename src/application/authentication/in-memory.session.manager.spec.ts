import { InMemorySessionManager } from './in-memory.session.manager';
import { MadiAuthenticationResult } from '../../core/authentication/authentication.flow.contract';

describe('InMemorySessionManager', () => {
  it('creates an authenticated session only from an authenticated identity', async () => {
    const manager = new InMemorySessionManager();
    const result: MadiAuthenticationResult = {
      authenticated: true,
      method: 'voice',
      identity: { userId: 'miguel', method: 'voice' },
    };

    const session = await manager.establish(result);

    expect(session.state).toBe('authenticated');
    expect(session.identity).toEqual({ userId: 'miguel', method: 'voice' });
    expect(await manager.get(session.sessionId)).toEqual(session);
  });

  it('rejects unauthenticated results', async () => {
    const manager = new InMemorySessionManager();

    await expect(manager.establish({ authenticated: false })).rejects.toThrow(
      'No se puede establecer una sesión sin identidad autenticada.',
    );
  });

  it('expires an existing session without deleting its trace', async () => {
    const manager = new InMemorySessionManager();
    const session = await manager.establish({
      authenticated: true,
      method: 'credential',
      identity: { userId: 'miguel', method: 'credential' },
    });

    await manager.expire(session.sessionId);

    expect((await manager.get(session.sessionId))?.state).toBe('expired');
  });
});
