import { MadiAgentPipelineResult } from '../pipeline/madi.agent.pipeline';

/** Converts structured pipeline output into a short user-facing response without becoming an LLM. */
export class NaturalResponseComposer {
  compose(result: MadiAgentPipelineResult): string {
    if (result.status === 'needs_authorization') return result.authorization?.reason ?? 'Necesito tu autorización para realizar esa operación.';
    if (result.status === 'needs_input') return 'Necesito un poco más de información para ayudarte.';
    if (result.status === 'failed') return result.error?.message ?? 'No pude completar la solicitud.';

    const intent = result.intent as { name?: string } | undefined;
    if (intent?.name === 'conversation.greeting') return '¡Hola! ¿En qué puedo ayudarte?';

    const execution = Array.isArray(result.execution) ? result.execution : [];
    const output = execution.length ? (execution[execution.length - 1] as { result?: { output?: unknown } })?.result?.output : undefined;
    if (output && typeof output === 'object') {
      const value = output as Record<string, unknown>;
      if (typeof value.text === 'string') return value.text;
      if (typeof value.status === 'string' && typeof value.name === 'string') return `${value.name} está ${value.status}.`;
    }

    const conclusions = result.conclusions ?? [];
    const first = conclusions[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && typeof (first as { value?: unknown }).value === 'string') return (first as { value: string }).value;

    return result.status === 'completed' ? 'Listo.' : 'La solicitud fue procesada.';
  }
}
