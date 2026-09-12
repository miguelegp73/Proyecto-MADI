import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { StubReasoningAdapter } from '../../infrastructure/reasoning/stub.reasoning.adapter';
import { InteractionController } from '../../interfaces/http/interaction.controller';

@Module({
  controllers: [InteractionController],
  providers: [
    StubReasoningAdapter,
    MadiOrchestrator,
    InteractionService,
  ],
  exports: [InteractionService],
})
export class InteractionModule {}
