import { AuthenticatedConversationService } from './authenticated.conversation.service';
import { MadiSessionManager } from '../../core/authentication/session.contract';
import { MadiConversationManager } from '../../core/conversation/conversation.contract';
import { NaturalGreetingService } from './natural.greeting.service';

describe('AuthenticatedConversationService', () => {
  it('establishes a session, starts a conversation and produces a natural greeting', async () => {
    const sessions: MadiSessionManager = {
      establish: jest.fn().mockResolvedValue({
        sessionId: 'session-1',
        state: 'authenticated',
        identity: { userId: 'miguel', displayName: 'Miguel', method: 'voice' },
      }),
      get: jest.fn(),
      expire: jest.fn(),
    };
    const conversations: MadiConversationManager = {
      start: jest.fn().mockResolvedValue({
        conversationId: 'conversation-1',
        sessionId: 'session-1',
        state: 'new',
        turns: [],
      }),
      get: jest.fn(),
      append: jest.fn(),
      close: jest.fn(),
    };

    const service = new AuthenticatedConversationService(
      sessions,
      conversations,
      new NaturalGreetingService(),
    );

    const result = await service.start({
      authenticated: true,
      method: 'voice',
      identity: { userId: 'miguel', method: 'voice' },
    });

    expect(sessions.establish).toHaveBeenCalledTimes(1);
    expect(conversations.start).toHaveBeenCalledWith('session-1');
    expect(result.greeting).toBe('¡Hola! Bienvenido. ¿En qué puedo ayudarte?');
  });
});
