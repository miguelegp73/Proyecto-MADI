import {
  MadiInteractionRequest,
  MadiInteractionResponse,
} from '../../core/interaction/interaction.contract';
import { MadiIntentResolver } from '../../core/intent/intent.contract';
import { MadiPlanner } from '../../core/planning/planning.contract';
import { MadiContextManager } from '../../core/context/context.contract';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiCapabilitySelector } from '../../core/capabilities/capability.selector';
import { MadiAuthorizationPolicy } from '../../core/authorization/authorization.contract';
import { MadiVerifier } from '../../core/verification/verification.contract';
import { MadiMemoryStore } from '../../core/memory/memory.contract';

export interface MadiAgentPipelineResult extends MadiInteractionResponse {
  intent?: unknown;
  context?: unknown;
  plan?: unknown;
  execution?: unknown[];
}

export class MadiAgentPipeline {
  constructor(
    private readonly intentResolver: MadiIntentResolver,
    private readonly contextManager: MadiContextManager,
    private readonly planner: MadiPlanner,
    private readonly capabilityRegistry: MadiCapabilityRegistry,
    private readonly capabilitySelector: MadiCapabilitySelector,
    private readonly authorizationPolicy: MadiAuthorizationPolicy,
    private readonly executor: MadiCapabilityExecutor,
    private readonly verifier: MadiVerifier,
    private readonly memory?: MadiMemoryStore,
  ) {}

  async process(request: MadiInteractionRequest): Promise<MadiAgentPipelineResult> {
    try {
      const intent = await this.intentResolver.resolve(request.input.content);
      if (intent.requiresClarification) {
        const result = this.result(request, 'needs_input', {
          intent,
          warnings: ['Se requiere aclaración antes de planificar.'],
        });
        await this.rememberInteraction(request, result);
        return result;
      }

      const context = await this.contextManager.build(request.context);
      const plan = await this.planner.plan({
        goal: request.input.content,
        context: { ...context.values, intent },
      });
      const execution: unknown[] = [];

      for (const step of plan.steps) {
        if (!step.capabilityId) {
          const result = this.result(request, 'failed', {
            intent,
            context,
            plan,
            execution,
            error: {
              code: 'CAPABILITY_NOT_SELECTED',
              message: `El paso '${step.id}' no define una capacidad ejecutable.`,
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }

        const selection = await this.capabilitySelector.select(
          intent,
          this.capabilityRegistry.list(),
          step.capabilityId,
        );

        if (!selection.capabilityId) {
          const result = this.result(request, 'failed', {
            intent,
            context,
            plan,
            execution,
            error: {
              code: 'CAPABILITY_SELECTION_FAILED',
              message: selection.reason,
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }

        const capability = this.capabilityRegistry.get(selection.capabilityId);
        if (!capability) {
          const result = this.result(request, 'failed', {
            intent,
            context,
            plan,
            execution,
            error: {
              code: 'CAPABILITY_NOT_FOUND',
              message: `La capacidad '${selection.capabilityId}' no está disponible.`,
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }

        const operation = step.operation ?? 'execute';
        const authorization = await this.authorizationPolicy.authorize({
          capabilityId: capability.id,
          operation,
          risk: capability.risk,
          token: request.metadata?.authorizationToken as string | undefined,
        });

        if (authorization.decision !== 'allowed') {
          const result = this.result(request, 'needs_authorization', {
            intent,
            context,
            plan,
            execution,
            authorization: {
              required: true,
              reason: authorization.reason,
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }

        const actual = await this.executor.execute({
          capabilityId: capability.id,
          operation,
          input: step.input,
          authorizationToken: request.metadata?.authorizationToken as string | undefined,
        });

        if (!actual.success) {
          execution.push({ stepId: step.id, capabilityId: capability.id, result: actual });
          const result = this.result(request, 'failed', {
            intent,
            context,
            plan,
            execution,
            error: actual.error ?? {
              code: 'CAPABILITY_EXECUTION_FAILED',
              message: 'La capacidad no pudo completar la operación.',
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }

        const verification = await this.verifier.verify({
          capabilityId: capability.id,
          operation,
          expected: step.expected,
          actual: actual.output,
        });

        execution.push({
          stepId: step.id,
          capabilityId: capability.id,
          result: actual,
          verification,
        });

        if (!verification.verified) {
          const result = this.result(request, 'failed', {
            intent,
            context,
            plan,
            execution,
            error: {
              code: 'VERIFICATION_FAILED',
              message: verification.reason ?? 'La ejecución no pudo verificarse.',
            },
          });
          await this.rememberInteraction(request, result);
          return result;
        }
      }

      const result = this.result(request, 'completed', { intent, context, plan, execution });
      await this.rememberInteraction(request, result);
      return result;
    } catch (error) {
      const result = this.result(request, 'failed', {
        error: {
          code: 'PIPELINE_ERROR',
          message: error instanceof Error ? error.message : 'Error inesperado en el pipeline.',
        },
      });
      await this.rememberInteraction(request, result);
      return result;
    }
  }

  private async rememberInteraction(
    request: MadiInteractionRequest,
    response: MadiAgentPipelineResult,
  ): Promise<void> {
    if (!this.memory) {
      return;
    }

    const scope = this.scopeFromRequest(request);
    if (!scope) {
      return;
    }

    await this.memory.remember({
      id: request.requestId,
      scope,
      kind: 'interaction',
      content: request.input.content,
      timestamp: request.timestamp,
      metadata: {
        status: response.status,
        intent: response.intent,
      },
    });
  }

  private scopeFromRequest(request: MadiInteractionRequest): string | undefined {
    const context = request.context ?? {};
    const conversationId = context.conversationId;
    const sessionId = context.sessionId;
    const userId = context.userId;

    if (typeof conversationId === 'string' && conversationId.trim()) {
      return `conversation:${conversationId}`;
    }

    if (typeof sessionId === 'string' && sessionId.trim()) {
      return `session:${sessionId}`;
    }

    if (typeof userId === 'string' && userId.trim()) {
      return `user:${userId}`;
    }

    return undefined;
  }

  private result(
    request: MadiInteractionRequest,
    status: MadiInteractionResponse['status'],
    data: Partial<MadiAgentPipelineResult>,
  ): MadiAgentPipelineResult {
    return {
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      status,
      ...data,
    };
  }
}
