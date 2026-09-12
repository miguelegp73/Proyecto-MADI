import { MadiVerifier } from '../../core/verification/verification.contract';
import {
  MadiAgentLoop,
  MadiAgentLoopRequest,
  MadiAgentLoopResult,
  MadiToolAction,
  MadiToolTrace,
} from '../../core/tools/agent.loop.contract';
import { MadiToolExecutor } from '../../core/tools/tool.executor';

const DEFAULT_MAX_STEPS = 8;
const MAX_ALLOWED_STEPS = 32;

/** Executes a finite, explicit sequence of tool actions. It never discovers or invents actions. */
export class BoundedAgentToolLoop implements MadiAgentLoop {
  constructor(
    private readonly executor: MadiToolExecutor,
    private readonly verifier: MadiVerifier,
  ) {}

  async run(request: MadiAgentLoopRequest): Promise<MadiAgentLoopResult> {
    const maxSteps = Math.min(
      Math.max(1, request.maxSteps ?? DEFAULT_MAX_STEPS),
      MAX_ALLOWED_STEPS,
    );
    const trace: MadiToolTrace[] = [];
    const seen = new Set<string>();
    const actions = request.actions ?? [];

    if (actions.length === 0) {
      return { status: 'completed', stepsExecuted: 0, trace };
    }

    for (const action of actions) {
      if (trace.length >= maxSteps) {
        return {
          status: 'limit_reached',
          stepsExecuted: trace.length,
          trace,
          error: { code: 'AGENT_STEP_LIMIT_REACHED', message: 'Se alcanzó el límite de pasos permitido.' },
        };
      }

      const key = this.actionKey(action);
      if (seen.has(key)) {
        return {
          status: 'cycle_detected',
          stepsExecuted: trace.length,
          trace,
          error: { code: 'AGENT_CYCLE_DETECTED', message: 'Se detectó una acción repetida dentro del mismo ciclo.' },
        };
      }
      seen.add(key);

      const result = await this.executor.execute({
        toolId: action.toolId,
        operation: action.operation,
        input: action.input,
        authorizationToken: action.authorizationToken,
      });

      if (!result.success) {
        const blocked = result.error?.code === 'TOOL_AUTHORIZATION_REQUIRED' || result.error?.code === 'TOOL_AUTHORIZATION_DENIED';
        trace.push({
          actionId: action.id,
          toolId: action.toolId,
          operation: action.operation,
          status: blocked ? 'blocked' : 'failed',
          result,
        });
        return {
          status: blocked ? 'needs_authorization' : 'failed',
          stepsExecuted: trace.length,
          trace,
          error: result.error,
        };
      }

      trace.push({
        actionId: action.id,
        toolId: action.toolId,
        operation: action.operation,
        status: 'executed',
        result,
      });

      const verification = await this.verifier.verify({
        capabilityId: action.toolId,
        operation: action.operation,
        expected: action.expected,
        actual: result.output,
      });

      if (!verification.verified) {
        trace[trace.length - 1] = {
          ...trace[trace.length - 1],
          status: 'failed',
        };
        return {
          status: 'failed',
          stepsExecuted: trace.length,
          trace,
          error: {
            code: 'AGENT_RESULT_NOT_VERIFIED',
            message: verification.reason ?? 'El resultado de la herramienta no pudo verificarse.',
          },
        };
      }

      trace[trace.length - 1] = {
        ...trace[trace.length - 1],
        status: 'verified',
      };
    }

    return { status: 'completed', stepsExecuted: trace.length, trace };
  }

  private actionKey(action: MadiToolAction): string {
    return JSON.stringify([action.toolId, action.operation, this.stableValue(action.input ?? {})]);
  }

  private stableValue(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.stableValue(item));
    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((result, key) => {
          result[key] = this.stableValue((value as Record<string, unknown>)[key]);
          return result;
        }, {});
    }
    return value;
  }
}
