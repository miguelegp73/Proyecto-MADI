import {
  MadiReasoningEngine,
  MadiReasoningInput,
  MadiReasoningResult,
} from '../../core/reasoning/reasoning.engine';

export class BasicReasoningEngine implements MadiReasoningEngine {
  async reason(input: MadiReasoningInput): Promise<MadiReasoningResult> {
    const { intent, context } = input;

    if (intent.name === 'conversation.greeting') {
      return {
        confidence: intent.confidence,
        inferences: [
          { type: 'intent', value: 'El usuario inició una conversación.' },
        ],
        conclusions: [
          { type: 'conversation', value: 'Corresponde continuar la conversación sin ejecutar capacidades.' },
        ],
        recommendations: [],
        proposedActions: [],
      };
    }

    if (intent.name === 'information.madi.status') {
      return {
        confidence: intent.confidence,
        inferences: [
          { type: 'intent', value: 'El usuario solicita información sobre el estado operativo de M.A.D.I.' },
          { type: 'context_available', value: Object.keys(context.values).length > 0 },
        ],
        conclusions: [
          { type: 'capability', value: 'La capacidad madi.status es adecuada para responder la solicitud.' },
          { type: 'safety', value: 'La consulta es informativa y no requiere una acción externa.' },
        ],
        recommendations: [
          { type: 'next_step', value: 'Ejecutar la capacidad de consulta de estado y verificar su resultado.' },
        ],
        proposedActions: [],
      };
    }

    return {
      confidence: 0,
      inferences: [
        { type: 'uncertain_intent', value: intent.name },
      ],
      conclusions: [],
      recommendations: [
        { type: 'clarification', value: 'Solicitar al usuario que precise qué necesita.' },
      ],
      proposedActions: [],
      warnings: ['El razonamiento base no dispone de evidencia suficiente para clasificar la solicitud.'],
    };
  }
}
