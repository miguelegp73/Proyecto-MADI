import {
  MadiToolRequest,
  MadiToolResult,
} from './tool.contract';
import { MadiToolRegistry } from './tool.registry';
import {
  MadiAuthorizationPolicy,
} from '../authorization/authorization.contract';

export interface MadiToolExecutor {
  execute(request: MadiToolRequest): Promise<MadiToolResult>;
}

/**
 * Safety boundary for tool execution. Every execution must pass through the
 * explicit registry and authorization policy. This class performs no discovery.
 */
export class RegistryToolExecutor implements MadiToolExecutor {
  constructor(
    private readonly registry: MadiToolRegistry,
    private readonly authorizationPolicy: MadiAuthorizationPolicy,
  ) {}

  async execute(request: MadiToolRequest): Promise<MadiToolResult> {
    if (!request.toolId?.trim()) {
      return this.failure('TOOL_ID_REQUIRED', 'El identificador de la herramienta es obligatorio.');
    }

    if (!request.operation?.trim()) {
      return this.failure('TOOL_OPERATION_REQUIRED', 'La operación de la herramienta es obligatoria.');
    }

    const tool = this.registry.get(request.toolId);
    if (!tool) {
      return this.failure(
        'TOOL_NOT_FOUND',
        `La herramienta '${request.toolId}' no está registrada.`,
      );
    }

    if (tool.operations && !tool.operations.includes(request.operation)) {
      return this.failure(
        'TOOL_OPERATION_NOT_ALLOWED',
        `La operación '${request.operation}' no está permitida para la herramienta '${tool.id}'.`,
      );
    }

    const authorization = await this.authorizationPolicy.authorize({
      capabilityId: tool.id,
      operation: request.operation,
      risk: tool.risk,
      token: request.authorizationToken,
    });

    if (authorization.decision !== 'allowed') {
      return this.failure(
        authorization.decision === 'denied'
          ? 'TOOL_AUTHORIZATION_DENIED'
          : 'TOOL_AUTHORIZATION_REQUIRED',
        authorization.reason ?? 'La operación requiere autorización.',
      );
    }

    try {
      const result = await tool.execute(request);
      return result && typeof result.success === 'boolean'
        ? result
        : this.failure('INVALID_TOOL_RESULT', 'La herramienta devolvió un resultado inválido.');
    } catch (error) {
      return this.failure(
        'TOOL_EXECUTION_ERROR',
        error instanceof Error ? error.message : 'La herramienta produjo un error inesperado.',
      );
    }
  }

  private failure(code: string, message: string): MadiToolResult {
    return { success: false, error: { code, message } };
  }
}
