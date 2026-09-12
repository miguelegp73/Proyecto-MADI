import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { MADI_REASONING_PORT } from '../../core/reasoning/reasoning.token';
import { StubReasoningAdapter } from '../../infrastructure/reasoning/stub.reasoning.adapter';
import { InteractionController } from '../../interfaces/http/interaction.controller';

@Module({
  controllers: [InteractionController],
  providers: [
    {
      provide: MADI_REASONING_PORT,
      useClass: StubReasoningAdapter,
    },
    MadiOrchestrator,
    InteractionService,
  ],
  exports: [InteractionService],
})
export class InteractionModule {}
