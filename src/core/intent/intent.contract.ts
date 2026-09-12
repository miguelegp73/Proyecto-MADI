export type MadiIntentDomain =
  | 'conversation'
  | 'information'
  | 'analysis'
  | 'action'
  | 'unknown';

export interface MadiIntent {
  name: string;
  domain: MadiIntentDomain;
  confidence: number;
  requiresClarification: boolean;
}

export interface MadiIntentResolver {
  resolve(input: string): Promise<MadiIntent>;
}
