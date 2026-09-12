import { Module } from '@nestjs/common';
import { InMemoryConversationManager } from './in-memory.conversation.manager';

export const MADI_CONVERSATION_MANAGER = Symbol('MADI_CONVERSATION_MANAGER');

@Module({
  providers: [{ provide: MADI_CONVERSATION_MANAGER, useClass: InMemoryConversationManager }],
  exports: [MADI_CONVERSATION_MANAGER],
})
export class ConversationModule {}
