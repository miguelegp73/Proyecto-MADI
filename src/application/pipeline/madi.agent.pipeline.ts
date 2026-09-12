import { MadiInteractionRequest, MadiInteractionResponse } from '../../core/interaction/interaction.contract';
import { MadiIntentResolver } from '../../core/intent/intent.contract';
import { MadiPlanner } from '../../core/planning/planning.contract';
import { MadiContextManager } from '../../core/context/context.contract';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { MadiCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiCapabilitySelector } from '../../core/capabilities/capability.selector';
import { MadiAuthorizationPolicy } from '../../core/authorization/authorization.contract';
import { MadiVerifier } from '../../core/verification/verification.contract';

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
  ) {}

  async process(request: MadiInteractionRequest): Promise<MadiAgentPipelineResult> {
    const intent = await this.intentResolver.resolve(request.input.content);
    if (intent.requiresClarification) {
      return this.result(request, 'needs_input', { intent, warnings: ['Se requiere aclaración antes de planificar.'] });
    }

    const context = await this.contextManager.build(request.context);
    const plan = await this.planner.plan({ goal: request.input.content, context: context.values });
    const execution: unknown[] = [];

    for (const step of plan.steps) {
      const selection = await this.capabilitySelector.select(intent, this.capabilityRegistry.list(), step.capabilityId);
      if (!selection.capabilityId) {
        return this.result(request, 'failed', { intent, context, plan, execution, warnings: [selection.reason] });
      }

      const capability = this.capabilityRegistry.get(selection.capabilityId);
      if (!capability) {
        return this.result(request, 'failed', { intent, context, plan, execution, warnings: ['La capacidad seleccionada ya no está disponible.'] });
      }

      const authorization = await this.authorizationPolicy.authorize({
        capabilityId: capability.id,
        operation: step.operation ?? 'execute',
        risk: capability.risk,
        token: request.metadata?.authorizationToken as string | undefined,
      });

      if (authorization.decision !== 'allowed') {
        return this.result(request, 'needs_authorization', {
          intent, context, plan, execution,
          authorization: { required: true, reason: authorization.reason },
        });
      }

      const actual = await this.executor.execute({
        capabilityId: capability.id,
        operation: step.operation ?? 'execute',
        input: step.input,
        authorizationToken: request.metadata?.authorizationToken as string | undefined,
      });

      const verification = await this.verifier.verify({
        capabilityId: capability.id,
        operation: step.operation ?? 'execute',
        actual,
      });

      execution.push({ stepId: step.id, capabilityId: capability.id, result: actual, verification });
      if (!verification.verified) {
        return this.result(request, 'failed', { intent, context, plan, execution, warnings: [verification.reason ?? 'La ejecución no pudo verificarse.'] });
      }
    }

    return this.result(request, 'completed', { intent, context, plan, execution });
  }

  private result(request: MadiInteractionRequest, status: MadiInteractionResponse['status'], data: Partial<MadiAgentPipelineResult>): MadiAgentPipelineResult {
    return { requestId: request.requestId, timestamp: new Date().toISOString(), status, ...data };
  }
}
