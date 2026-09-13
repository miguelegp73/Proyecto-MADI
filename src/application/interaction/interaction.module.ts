import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { MADI_REASONING_PORT } from '../../core/reasoning/reasoning.token';
import { StubReasoningAdapter } from '../../infrastructure/reasoning/stub.reasoning.adapter';
import { InteractionController } from '../../interfaces/http/interaction.controller';
import { MadiVoiceUiController } from '../../interfaces/http/madi.voice.ui.controller';
import { BasicIntentResolver } from '../../core/intent/intent.resolver';
import { DefaultContextManager } from '../context/default.context.manager';
import { BasicPlanner } from '../planning/basic.planner';
import { BasicCapabilitySelector } from '../../core/capabilities/capability.selector';
import { DefaultAuthorizationPolicy } from '../authorization/default.authorization.policy';
import { InMemoryAuthorizationApprovalService } from '../authorization/in-memory.authorization.approval.service';
import { BasicVerifier } from '../verification/basic.verifier';
import { MadiAgentPipeline } from '../pipeline/madi.agent.pipeline';
import { DefaultMemoryModule, MADI_MEMORY_STORE } from '../memory/default.memory.module';
import { DefaultCapabilitiesModule, MADI_CAPABILITY_EXECUTOR, MADI_CAPABILITY_REGISTRY } from '../capabilities/default.capabilities.module';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiMemoryStore } from '../../core/memory/memory.contract';
import { MadiReasoningEngine } from '../../core/reasoning/reasoning.engine';
import { BasicReasoningEngine } from '../reasoning/basic.reasoning.engine';
import { ResilientReasoningEngine } from '../reasoning/resilient.reasoning.engine';
import { BasicReasoningProvider } from '../../infrastructure/reasoning/basic.reasoning.provider';
import { OpenRouterReasoningProvider } from '../../infrastructure/reasoning/openrouter.reasoning.provider';
import { ApplicationInterfaceGateway } from '../interface/madi.interface.gateway';
import { NaturalResponseComposer } from '../response/natural.response.composer';
import { ConversationModule, MADI_CONVERSATION_MANAGER } from '../conversation/conversation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { MADI_SESSION_MANAGER } from '../../core/authentication/authentication.tokens';
import { MadiSessionManager } from '../../core/authentication/session.contract';
import { MadiConversationManager } from '../../core/conversation/conversation.contract';
import { MadiAuthorizationApprovalService } from '../../core/authorization/authorization.approval.contract';

@Module({
  imports: [DefaultCapabilitiesModule, DefaultMemoryModule, ConversationModule, AuthenticationModule],
  controllers: [InteractionController, MadiVoiceUiController],
  providers: [
    { provide: MADI_REASONING_PORT, useClass: StubReasoningAdapter },
    BasicIntentResolver,
    { provide: DefaultContextManager, useFactory: (memory: MadiMemoryStore) => new DefaultContextManager(memory), inject: [MADI_MEMORY_STORE] },
    BasicPlanner,
    BasicCapabilitySelector,
    { provide: InMemoryAuthorizationApprovalService, useClass: InMemoryAuthorizationApprovalService },
    {
      provide: DefaultAuthorizationPolicy,
      useFactory: (approvals: MadiAuthorizationApprovalService) => new DefaultAuthorizationPolicy(approvals),
      inject: [InMemoryAuthorizationApprovalService],
    },
    BasicVerifier,
    BasicReasoningEngine,
    BasicReasoningProvider,
    OpenRouterReasoningProvider,
    NaturalResponseComposer,
    {
      provide: ResilientReasoningEngine,
      useFactory: (openRouter: OpenRouterReasoningProvider, localProvider: BasicReasoningProvider, fallback: BasicReasoningEngine) => new ResilientReasoningEngine([openRouter, localProvider], fallback),
      inject: [OpenRouterReasoningProvider, BasicReasoningProvider, BasicReasoningEngine],
    },
    {
      provide: MadiAgentPipeline,
      useFactory: (intentResolver: BasicIntentResolver, contextManager: DefaultContextManager, planner: BasicPlanner, registry: MadiCapabilityRegistry, selector: BasicCapabilitySelector, authorization: DefaultAuthorizationPolicy, executor: MadiCapabilityExecutor, verifier: BasicVerifier, memory: MadiMemoryStore, reasoningEngine: MadiReasoningEngine) => new MadiAgentPipeline(intentResolver, contextManager, planner, registry, selector, authorization, executor, verifier, memory, reasoningEngine),
      inject: [BasicIntentResolver, DefaultContextManager, BasicPlanner, MADI_CAPABILITY_REGISTRY, BasicCapabilitySelector, DefaultAuthorizationPolicy, MADI_CAPABILITY_EXECUTOR, BasicVerifier, MADI_MEMORY_STORE, ResilientReasoningEngine],
    },
    MadiOrchestrator,
    {
      provide: InteractionService,
      useFactory: (orchestrator: MadiOrchestrator, composer: NaturalResponseComposer, sessions: MadiSessionManager, conversations: MadiConversationManager) => new InteractionService(orchestrator, composer, sessions, conversations),
      inject: [MadiOrchestrator, NaturalResponseComposer, MADI_SESSION_MANAGER, MADI_CONVERSATION_MANAGER],
    },
    {
      provide: ApplicationInterfaceGateway,
      useFactory: (interactionService: InteractionService) => new ApplicationInterfaceGateway(interactionService),
      inject: [InteractionService],
    },
  ],
  exports: [InteractionService, ApplicationInterfaceGateway, InMemoryAuthorizationApprovalService],
})
export class InteractionModule {}
