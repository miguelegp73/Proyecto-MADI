import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiSessionManager } from '../../core/authentication/session.contract';
import { MadiConversationManager } from '../../core/conversation/conversation.contract';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { NaturalResponseComposer } from '../response/natural.response.composer';

/** Executes interactions and, when an authenticated conversation is supplied, carries its bounded history and identity scope. */
export class InteractionService {
  constructor(
    private readonly orchestrator: MadiOrchestrator,
    private readonly responseComposer?: NaturalResponseComposer,
    private readonly sessions?: MadiSessionManager,
    private readonly conversations?: MadiConversationManager,
  ) {}

  async execute(request: MadiInteractionRequest): Promise<MadiInteractionResponse> {
    const conversationId = this.readMetadataString(request, 'conversationId');
    const sessionId = this.readMetadataString(request, 'sessionId');
    const conversation = await this.resolveConversation(sessionId, conversationId);
    const requestWithHistory = conversation
      ? this.withConversationHistory(
          request,
          conversation.turns,
          conversation.conversationId,
          conversation.sessionId,
          (await this.sessions!.get(conversation.sessionId))!.identity!.userId,
        )
      : request;

    if (conversation) {
      await this.conversations!.append(conversation.conversationId, {
        requestId: request.requestId,
        timestamp: request.timestamp,
        role: 'user',
        content: request.input.content,
      });
    }

    const response = await this.orchestrator.execute(requestWithHistory);
    const completed = !this.responseComposer || response.responseText
      ? response
      : {
          ...response,
          responseText: this.responseComposer.compose(response as typeof response & { intent?: unknown; execution?: unknown[] }),
        };

    if (conversation && completed.responseText) {
      await this.conversations!.append(conversation.conversationId, {
        requestId: response.requestId,
        timestamp: completed.timestamp,
        role: 'assistant',
        content: completed.responseText,
      });
    }

    return completed;
  }

  private async resolveConversation(sessionId?: string, conversationId?: string) {
    if (!sessionId || !conversationId || !this.sessions || !this.conversations) return undefined;

    const session = await this.sessions.get(sessionId);
    if (!session || session.state !== 'authenticated' || !session.identity?.userId) {
      throw new Error('La sesión de M.A.D.I. no está autenticada o ya no es válida.');
    }

    const conversation = await this.conversations.get(conversationId);
    if (!conversation || conversation.sessionId !== sessionId || conversation.state !== 'active') {
      throw new Error('La conversación de M.A.D.I. no es válida para la sesión indicada.');
    }

    return conversation;
  }

  private withConversationHistory(
    request: MadiInteractionRequest,
    turns: readonly { role: 'user' | 'assistant'; content: string }[],
    conversationId: string,
    sessionId: string,
    userId: string,
  ): MadiInteractionRequest {
    return {
      ...request,
      context: {
        ...(request.context ?? {}),
        conversationId,
        sessionId,
        userId,
        conversation: {
          turns: turns.slice(-12).map((turn) => ({ role: turn.role, content: turn.content })),
        },
      },
    };
  }

  private readMetadataString(request: MadiInteractionRequest, key: string): string | undefined {
    const value = request.metadata?.[key];
    return typeof value === 'string' && value.trim() ? value : undefined;
  }
}
