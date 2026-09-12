import { InMemoryMemoryStore } from './in-memory.memory.store';

describe('InMemoryMemoryStore', () => {
  it('stores and recalls entries by scope, newest first', async () => {
    const store = new InMemoryMemoryStore();

    await store.remember({
      id: 'm1',
      scope: 'conversation-1',
      kind: 'interaction',
      content: 'Primera interacción',
      timestamp: '2026-09-12T18:00:00.000Z',
    });
    await store.remember({
      id: 'm2',
      scope: 'conversation-1',
      kind: 'interaction',
      content: 'Segunda interacción',
      timestamp: '2026-09-12T18:01:00.000Z',
    });
    await store.remember({
      id: 'other',
      scope: 'conversation-2',
      kind: 'interaction',
      content: 'Otra conversación',
      timestamp: '2026-09-12T18:02:00.000Z',
    });

    await expect(store.recall('conversation-1')).resolves.toEqual([
      expect.objectContaining({ id: 'm2' }),
      expect.objectContaining({ id: 'm1' }),
    ]);
  });

  it('respects the recall limit', async () => {
    const store = new InMemoryMemoryStore();

    for (let index = 1; index <= 3; index += 1) {
      await store.remember({
        id: `m${index}`,
        scope: 'session-1',
        kind: 'note',
        content: `Nota ${index}`,
        timestamp: `2026-09-12T18:0${index}:00.000Z`,
      });
    }

    await expect(store.recall('session-1', 2)).resolves.toHaveLength(2);
    await expect(store.recall('session-1', 0)).resolves.toEqual([]);
  });
});
