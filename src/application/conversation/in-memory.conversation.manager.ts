import {
  MadiConversationManager,
  MadiConversationSession,
  MadiConversationTurn,
} from '../../core/conversation/conversation.contract';

/** Process-local conversation state. Replaceable by a persistent adapter later. */
export class InMemoryConversationManager implements MadiConversationManager {
  private readonly conversations = new Map<string, MadiConversationSession>();

  async start(sessionId: string): Promise<MadiConversationSession> {
    if (!sessionId.trim()) throw new Error('Se requiere sessionId para iniciar una conversación.');
    const conversation: MadiConversationSession = {
      conversationId: crypto.randomUUID(),
      sessionId,
      state: 'active',
      turns: [],
    };
    this.conversations.set(conversation.conversationId, conversation);
    return conversation;
  }

  async get(conversationId: string): Promise<MadiConversationSession | undefined> {
    return this.conversations.get(conversationId);
  }

  async append(conversationId: string, turn: MadiConversationTurn): Promise<MadiConversationSession> {
    const current = this.conversations.get(conversationId);
    if (!current) throw new Error('Conversación no encontrada.');
    if (current.state !== 'active') throw new Error('La conversación no está activa.');
    if (!turn.content.trim()) throw new Error('No se puede registrar un turno vacío.');

    const updated: MadiConversationSession = {
      ...current,
      turns: [...current.turns, turn],
    };
    this.conversations.set(conversationId, updated);
    return updated;
  }

  async close(conversationId: string): Promise<void> {
    const current = this.conversations.get(conversationId);
    if (!current) return;
    this.conversations.set(conversationId, { ...current, state: 'closed' });
  }
}
