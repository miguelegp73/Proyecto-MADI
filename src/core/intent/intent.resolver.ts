import { MadiIntent, MadiIntentResolver } from './intent.contract';

export class BasicIntentResolver implements MadiIntentResolver {
  async resolve(input: string): Promise<MadiIntent> {
    const normalized = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[.,!?;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) return { name: 'unknown.empty', domain: 'unknown', confidence: 1, requiresClarification: true };
    if (/^(hola|buenas|buen dia|buenas tardes|buenas noches)\b/.test(normalized)) return { name: 'conversation.greeting', domain: 'conversation', confidence: 0.99, requiresClarification: false };
    if (/\b(que hora es|hora actual|hora)\b/.test(normalized)) return { name: 'information.time', domain: 'information', confidence: 0.96, requiresClarification: false };
    if (/\b(que puedes hacer|tus capacidades|tus funciones|que sabes hacer)\b/.test(normalized)) return { name: 'information.madi.capabilities', domain: 'information', confidence: 0.97, requiresClarification: false };
    if (/\b(estado|status)\b.*\b(madi|m a d i)\b|\b(madi|m a d i)\b.*\b(estado|status)\b/.test(normalized)) return { name: 'information.madi.status', domain: 'information', confidence: 0.98, requiresClarification: false };

    if (/\b(abrir|abre|abri|inicia|iniciar|ejecuta|ejecutar|lanza|lanzar)\b/.test(normalized)) {
      const hasUrl = /\bhttps?:\/\/[^\s]+/i.test(input);
      const app = normalized.match(/\b(calculadora|notepad|bloc de notas|paint|explorador|explorer)\b/);
      if (app && !hasUrl) return { name: 'action.open-app', domain: 'action', confidence: 0.95, requiresClarification: false };
      return { name: 'action.open-url', domain: 'action', confidence: hasUrl ? 0.98 : 0.82, requiresClarification: !hasUrl };
    }

    return { name: 'unknown.unclassified', domain: 'unknown', confidence: 0, requiresClarification: true };
  }
}
