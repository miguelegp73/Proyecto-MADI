import {
  MadiReasoningEngine,
  MadiReasoningInput,
  MadiReasoningResult,
} from '../../core/reasoning/reasoning.engine';
import { MadiReasoningProvider } from '../../core/reasoning/reasoning.provider';

/**
 * Tries available external providers in deterministic priority order and
 * preserves the safe baseline when none can answer.
 */
export class ResilientReasoningEngine implements MadiReasoningEngine {
  constructor(
    private readonly providers: MadiReasoningProvider[],
    private readonly fallback: MadiReasoningEngine,
  ) {}

  async reason(input: MadiReasoningInput): Promise<MadiReasoningResult> {
    const orderedProviders = [...this.providers].sort(
      (left, right) => left.priority - right.priority || left.id.localeCompare(right.id),
    );
    const providerWarnings: string[] = [];

    for (const provider of orderedProviders) {
      try {
        if (!(await provider.isAvailable())) {
          providerWarnings.push(`Proveedor '${provider.id}' no disponible.`);
          continue;
        }

        const result = await provider.reason(input);
        return providerWarnings.length > 0
          ? { ...result, warnings: [...providerWarnings, ...(result.warnings ?? [])] }
          : result;
      } catch (error) {
        providerWarnings.push(
          `Proveedor '${provider.id}' falló: ${error instanceof Error ? error.message : 'error desconocido'}.`,
        );
      }
    }

    const fallbackResult = await this.fallback.reason(input);
    return providerWarnings.length > 0
      ? {
          ...fallbackResult,
          warnings: [...providerWarnings, ...(fallbackResult.warnings ?? [])],
        }
      : fallbackResult;
  }
}
