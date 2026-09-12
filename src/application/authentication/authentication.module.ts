import { Module } from '@nestjs/common';
import { MadiAuthenticationService } from './madi.authentication.service';
import { InMemorySessionManager } from './in-memory.session.manager';
import { NaturalGreetingService } from './natural.greeting.service';
import { AuthenticatedConversationService } from './authenticated.conversation.service';
import { LocalCredentialAuthenticator } from '../../infrastructure/authentication/local.credential.authenticator';
import { ConversationModule, MADI_CONVERSATION_MANAGER } from '../conversation/conversation.module';
import { MadiConversationManager } from '../../core/conversation/conversation.contract';

export const MADI_AUTHENTICATION = Symbol('MADI_AUTHENTICATION');
export const MADI_SESSION_MANAGER = Symbol('MADI_SESSION_MANAGER');
export const MADI_AUTHENTICATED_CONVERSATION = Symbol('MADI_AUTHENTICATED_CONVERSATION');

@Module({
  imports: [ConversationModule],
  providers: [
    {
      provide: MADI_AUTHENTICATION,
      useFactory: () => new MadiAuthenticationService(
        { recognize: async () => ({ decision: 'unavailable', confidence: 0 }) },
        new LocalCredentialAuthenticator(),
      ),
    },
    { provide: MADI_SESSION_MANAGER, useClass: InMemorySessionManager },
    NaturalGreetingService,
    {
      provide: MADI_AUTHENTICATED_CONVERSATION,
      useFactory: (sessions: InMemorySessionManager, conversations: MadiConversationManager, greeting: NaturalGreetingService) =>
        new AuthenticatedConversationService(sessions, conversations, greeting),
      inject: [MADI_SESSION_MANAGER, MADI_CONVERSATION_MANAGER, NaturalGreetingService],
    },
  ],
  exports: [MADI_AUTHENTICATION, MADI_SESSION_MANAGER, MADI_AUTHENTICATED_CONVERSATION],
})
export class AuthenticationModule {}
