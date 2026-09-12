import { MadiAuthenticationResult } from '../../core/authentication/authentication.flow.contract';
import { MadiSessionManager, MadiAuthenticationSession } from '../../core/authentication/session.contract';
import { MadiConversationManager, MadiConversationSession } from '../../core/conversation/conversation.contract';
import { NaturalGreetingService } from './natural.greeting.service';

export interface MadiAuthenticatedConversationResult {
  session: MadiAuthenticationSession;
  conversation: MadiConversationSession;
  greeting?: string;
}

/** Starts a conversation only from an authenticated identity. */
export class AuthenticatedConversationService {
  constructor(
    private readonly sessions: MadiSessionManager,
    private readonly conversations: MadiConversationManager,
    private readonly greeting: NaturalGreetingService,
  ) {}

  async start(result: MadiAuthenticationResult): Promise<MadiAuthenticatedConversationResult> {
    const session = await this.sessions.establish(result);
    const conversation = await this.conversations.start(session.sessionId);
    const greeting = await this.greeting.greet(session);

    return {
      session,
      conversation,
      greeting: greeting.shouldGreet ? greeting.message : undefined,
    };
  }
}
