import { InMemoryConversationManager } from './in-memory.conversation.manager';

describe('InMemoryConversationManager', () => {
  it('starts and appends conversation turns', async () => {
    const manager = new InMemoryConversationManager();
    const conversation = await manager.start('session-1');

    await manager.append(conversation.conversationId, {
      requestId: 'r1', timestamp: '2026-09-12T22:00:00.000Z', role: 'user', content: 'Hola M.A.D.I.',
    });
    const updated = await manager.append(conversation.conversationId, {
      requestId: 'r2', timestamp: '2026-09-12T22:00:01.000Z', role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte?',
    });

    expect(updated.state).toBe('active');
    expect(updated.turns).toHaveLength(2);
  });

  it('rejects empty turns and rejects appending after close', async () => {
    const manager = new InMemoryConversationManager();
    const conversation = await manager.start('session-1');

    await expect(manager.append(conversation.conversationId, {
      requestId: 'r1', timestamp: new Date().toISOString(), role: 'user', content: '   ',
    })).rejects.toThrow('turno vacío');

    await manager.close(conversation.conversationId);
    await expect(manager.append(conversation.conversationId, {
      requestId: 'r2', timestamp: new Date().toISOString(), role: 'user', content: 'Hola',
    })).rejects.toThrow('no está activa');
  });
});
