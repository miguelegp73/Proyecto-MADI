import { MadiContext, MadiContextManager } from '../../core/context/context.contract';
import { MadiMemoryStore } from '../../core/memory/memory.contract';

export class DefaultContextManager implements MadiContextManager {
  constructor(private readonly memory?: MadiMemoryStore) {}

  async build(requestContext?: Record<string, unknown>): Promise<MadiContext> {
    const values = { ...(requestContext ?? {}) };
    const scope = this.scopeFrom(values);

    if (!scope || !this.memory) {
      return { values };
    }

    const memories = await this.memory.recall(scope);

    return {
      values: {
        ...values,
        memory: memories,
      },
    };
  }

  private scopeFrom(values: Record<string, unknown>): string | undefined {
    const conversationId = values.conversationId;
    const sessionId = values.sessionId;
    const userId = values.userId;

    if (typeof conversationId === 'string' && conversationId.trim()) {
      return `conversation:${conversationId}`;
    }

    if (typeof sessionId === 'string' && sessionId.trim()) {
      return `session:${sessionId}`;
    }

    if (typeof userId === 'string' && userId.trim()) {
      return `user:${userId}`;
    }

    return undefined;
  }
}
