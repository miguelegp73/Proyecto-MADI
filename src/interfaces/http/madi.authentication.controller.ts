import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MadiAuthenticationService } from '../../application/authentication/madi.authentication.service';
import { AuthenticatedConversationService } from '../../application/authentication/authenticated.conversation.service';
import { MadiCredentialAuthenticationRequest } from '../../core/authentication/credential.contract';

@Controller('madi/auth')
export class MadiAuthenticationController {
  constructor(
    private readonly authentication: MadiAuthenticationService,
    private readonly conversations: AuthenticatedConversationService,
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
