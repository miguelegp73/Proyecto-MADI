import { DefaultContextManager } from './default.context.manager';
import { MadiMemoryStore } from '../../core/memory/memory.contract';

describe('DefaultContextManager', () => {
  it('preserves request context without inventing additional data', async () => {
    const manager = new DefaultContextManager();

    await expect(manager.build({ source: 'test' })).resolves.toEqual({ values: { source: 'test' } });
  });

  it('loads scoped recent memory into context', async () => {
    const memory: MadiMemoryStore = {
      remember: jest.fn(),
      recall: jest.fn().mockResolvedValue([
        {
          id: 'm1',
          scope: 'conversation:conv-1',
          kind: 'interaction',
          content: 'Recordatorio',
          timestamp: '2026-09-12T18:00:00.000Z',
        },
      ]),
    };
    const manager = new DefaultContextManager(memory);

    const result = await manager.build({ conversationId: 'conv-1' });

    expect(memory.recall).toHaveBeenCalledWith('conversation:conv-1');
    expect(result.values.memory).toEqual([
      expect.objectContaining({ id: 'm1', content: 'Recordatorio' }),
    ]);
  });
});
