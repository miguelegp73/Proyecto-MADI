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
import { DefaultMemoryModule, MADI_MEMORY_STORE } from '../memory/default.memory.module';
import {
  DefaultCapabilitiesModule,
  MADI_CAPABILITY_EXECUTOR,
  MADI_CAPABILITY_REGISTRY,
} from '../capabilities/default.capabilities.module';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiMemoryStore } from '../../core/memory/memory.contract';
import { MadiReasoningEngine } from '../../core/reasoning/reasoning.engine';
import { BasicReasoningEngine } from '../reasoning/basic.reasoning.engine';
import { ResilientReasoningEngine } from '../reasoning/resilient.reasoning.engine';
import { BasicReasoningProvider } from '../../infrastructure/reasoning/basic.reasoning.provider';
import { ApplicationInterfaceGateway } from '../interface/madi.interface.gateway';

@Module({
  imports: [DefaultCapabilitiesModule, DefaultMemoryModule],
  controllers: [InteractionController],
  providers: [
    {
      provide: MADI_REASONING_PORT,
      useClass: StubReasoningAdapter,
    },
    BasicIntentResolver,
    {
      provide: DefaultContextManager,
      useFactory: (memory: MadiMemoryStore) => new DefaultContextManager(memory),
      inject: [MADI_MEMORY_STORE],
    },
    BasicPlanner,
    BasicCapabilitySelector,
    DefaultAuthorizationPolicy,
    BasicVerifier,
    BasicReasoningEngine,
    BasicReasoningProvider,
    {
      provide: ResilientReasoningEngine,
      useFactory: (localProvider: BasicReasoningProvider, fallback: BasicReasoningEngine) =>
        new ResilientReasoningEngine([localProvider], fallback),
      inject: [BasicReasoningProvider, BasicReasoningEngine],
    },
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
        memory: MadiMemoryStore,
        reasoningEngine: MadiReasoningEngine,
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
          memory,
          reasoningEngine,
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
        MADI_MEMORY_STORE,
        ResilientReasoningEngine,
      ],
    },
    MadiOrchestrator,
    InteractionService,
    {
      provide: ApplicationInterfaceGateway,
      useFactory: (interactionService: InteractionService) =>
        new ApplicationInterfaceGateway(interactionService),
      inject: [InteractionService],
    },
  ],
  exports: [InteractionService, ApplicationInterfaceGateway],
})
export class InteractionModule {}
