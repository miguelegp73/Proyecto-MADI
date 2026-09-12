export interface MadiWakePhraseMatcher {
  matches(text: string): boolean;
}

/**
 * A wake phrase is any natural utterance addressed to M.A.D.I.; the exact
 * wording is intentionally not fixed to one greeting.
 */
export const DEFAULT_MADI_WAKE_VARIANTS = [
  'm.a.d.i.',
  'madi',
  'hola m.a.d.i.',
  'buen dia m.a.d.i.',
  'buenas tardes m.a.d.i.',
  'buenas noches m.a.d.i.',
] as const;
