import { MadiIntent, MadiIntentResolver } from './intent.contract';

export class BasicIntentResolver implements MadiIntentResolver {
  async resolve(input: string): Promise<MadiIntent> {
    const normalized = input.trim().toLowerCase();

    if (!normalized) {
      return {
        name: 'unknown.empty',
        domain: 'unknown',
        confidence: 1,
        requiresClarification: true,
      };
    }

    if (/^(hola|buenas|buen día|buenas tardes|buenas noches)\b/.test(normalized)) {
      return {
        name: 'conversation.greeting',
        domain: 'conversation',
        confidence: 0.99,
        requiresClarification: false,
      };
    }

    return {
      name: 'unknown.unclassified',
      domain: 'unknown',
      confidence: 0,
      requiresClarification: true,
    };
  }
}
