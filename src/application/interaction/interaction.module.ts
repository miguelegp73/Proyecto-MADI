import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { MADI_REASONING_PORT } from '../../core/reasoning/reasoning.token';
import { StubReasoningAdapter } from '../../infrastructure/reasoning/stub.reasoning.adapter';
import { InteractionController } from '../../interfaces/http/interaction.controller';
import { BasicIntentResolver } from '../../core/intent/intent.resolver';
import { DefaultContextManager } from '../context/default.context.manager';
import { BasicPlanner } from '../planning/basic.planner';
import { BasicCapabilitySelector } from '../../core/capabilities/capability.selector';
import { DefaultAuthorizationPolicy } from '../authorization/default.authorization.policy';
import { BasicVerifier } from '../verification/basic.verifier';
import { MadiAgentPipeline } from '../pipeline/madi.agent.pipeline';
import {
  DefaultCapabilitiesModule,
  MADI_CAPABILITY_EXECUTOR,
  MADI_CAPABILITY_REGISTRY,
} from '../capabilities/default.capabilities.module';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';

@Module({
  imports: [DefaultCapabilitiesModule],
  controllers: [InteractionController],
  providers: [
    {
      provide: MADI_REASONING_PORT,
      useClass: StubReasoningAdapter,
    },
    BasicIntentResolver,
    DefaultContextManager,
    BasicPlanner,
    BasicCapabilitySelector,
    DefaultAuthorizationPolicy,
    BasicVerifier,
    {
      provide: MadiAgentPipeline,
      useFactory: (
        intentResolver: BasicIntentResolver,
        contextManager: DefaultContextManager,
        planner: BasicPlanner,
        registry: MadiCapabilityRegistry,
        selector: BasicCapabilitySelector,
        authorization: DefaultAuthorizationPolicy,
        executor: MadiCapabilityExecutor,
        verifier: BasicVerifier,
      ) =>
        new MadiAgentPipeline(
          intentResolver,
          contextManager,
          planner,
          registry,
          selector,
          authorization,
          executor,
          verifier,
        ),
      inject: [
        BasicIntentResolver,
        DefaultContextManager,
        BasicPlanner,
        MADI_CAPABILITY_REGISTRY,
        BasicCapabilitySelector,
        DefaultAuthorizationPolicy,
        MADI_CAPABILITY_EXECUTOR,
        BasicVerifier,
      ],
    },
    MadiOrchestrator,
    InteractionService,
  ],
  exports: [InteractionService],
})
export class InteractionModule {}
