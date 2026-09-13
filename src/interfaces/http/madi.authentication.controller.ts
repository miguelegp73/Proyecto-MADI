import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { MadiAuthenticationFlow } from '../../core/authentication/authentication.flow.contract';
import { MadiCredentialAuthenticationRequest } from '../../core/authentication/credential.contract';
import { MADI_AUTHENTICATION, MADI_AUTHENTICATED_CONVERSATION } from '../../application/authentication/authentication.module';
import { AuthenticatedConversationService } from '../../application/authentication/authenticated.conversation.service';

@Controller('madi/auth')
export class MadiAuthenticationController {
  constructor(
    @Inject(MADI_AUTHENTICATION) private readonly authentication: MadiAuthenticationFlow,
    @Inject(MADI_AUTHENTICATED_CONVERSATION) private readonly conversations: AuthenticatedConversationService,
  ) {}

  @Post('credential')
  async credential(@Body() request: MadiCredentialAuthenticationRequest) {
    if (!request || typeof request.credentialType !== 'string' || typeof request.credential !== 'string') {
      throw new BadRequestException('credentialType y credential son obligatorios.');
    }

    const result = await this.authentication.authenticateByCredential(request);
    if (!result.authenticated) {
      return { authenticated: false, error: result.credential?.error };
    }

    const started = await this.conversations.start(result);
    return {
      authenticated: true,
      method: result.method,
      sessionId: started.session.sessionId,
      conversationId: started.conversation.conversationId,
      greeting: started.greeting,
    };
  }
}
