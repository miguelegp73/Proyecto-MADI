import {
  MadiReasoningInput,
  MadiReasoningResult,
} from '../../core/reasoning/reasoning.engine';
import { MadiReasoningProvider } from '../../core/reasoning/reasoning.provider';

interface OpenRouterChatResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
}

/** Optional OpenRouter adapter. It is inert until OPENROUTER_API_KEY is configured. */
export class OpenRouterReasoningProvider implements MadiReasoningProvider {
  readonly id = 'openrouter';
  readonly priority = 100;

  private readonly apiKey = process.env.OPENROUTER_API_KEY;
  private readonly model = process.env.MADI_OPENROUTER_MODEL ?? 'openrouter/free';
  private readonly baseUrl = process.env.MADI_OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey);
  }

  async reason(input: MadiReasoningInput): Promise<MadiReasoningResult> {
    if (!(await this.isAvailable())) {
      throw new Error('OPENROUTER_API_KEY no está configurada.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'Eres el motor de razonamiento de M.A.D.I. (Módulo Autónomo de Datos e Inteligencia).',
              'No ejecutes acciones. Analiza y devuelve únicamente JSON válido.',
              'Diferencia hechos, inferencias, conclusiones y recomendaciones.',
              'No inventes datos. Si falta información, indícalo en warnings.',
              'Respeta que propuesta y ejecución son cosas diferentes.',
              'Devuelve exactamente las claves: confidence, inferences, conclusions, recommendations, proposedActions, warnings.',
              'confidence debe ser un número entre 0 y 1; los demás campos son arrays.',
            ].join(' '),
          },
          {
            role: 'user',
            content: JSON.stringify({
              request: input.request,
              intent: input.intent,
              context: input.context,
            }),
          },
        ],
      }),
    });

    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`OpenRouter respondió HTTP ${response.status}: ${raw.slice(0, 300)}`);
    }

    let payload: OpenRouterChatResponse;
    try {
      payload = JSON.parse(raw) as OpenRouterChatResponse;
    } catch {
      throw new Error('OpenRouter devolvió una respuesta no JSON.');
    }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter no devolvió contenido de razonamiento.');
    }

    return this.parseResult(content);
  }

  private parseResult(content: string): MadiReasoningResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('El modelo no devolvió el JSON de razonamiento esperado.');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('El resultado de razonamiento no es un objeto.');
    }

    const value = parsed as Record<string, unknown>;
    const confidence = typeof value.confidence === 'number' ? value.confidence : 0;
    if (confidence < 0 || confidence > 1) {
      throw new Error('La confianza del razonamiento está fuera de rango.');
    }

    const arrayOf = (key: string): unknown[] => Array.isArray(value[key]) ? value[key] : [];

    return {
      confidence,
      inferences: arrayOf('inferences'),
      conclusions: arrayOf('conclusions'),
      recommendations: arrayOf('recommendations'),
      proposedActions: arrayOf('proposedActions'),
      warnings: arrayOf('warnings').map(String),
    };
  }
}
