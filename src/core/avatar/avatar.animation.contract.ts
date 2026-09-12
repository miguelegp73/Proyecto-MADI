import { MadiAvatarExpression, MadiAvatarState } from './avatar.contract';

export type MadiAvatarAnimation =
  | 'idle'
  | 'blink'
  | 'listen'
  | 'think'
  | 'speak'
  | 'happy'
  | 'concerned'
  | 'error';

export interface MadiAvatarAnimationFrame {
  timestampMs: number;
  expression: MadiAvatarExpression;
  animation: MadiAvatarAnimation;
  mouthOpen?: number;
  mouthWide?: number;
  eyeOpen?: number;
  browOffset?: number;
  intensity?: number;
}

export interface MadiAvatarAnimationSequence {
  durationMs: number;
  frames: readonly MadiAvatarAnimationFrame[];
}

/** Provider/renderer-neutral boundary for future phoneme/viseme lip-sync. */
export interface MadiAvatarAnimationGateway {
  applyState(state: MadiAvatarState): Promise<void>;
  play(sequence: MadiAvatarAnimationSequence): Promise<void>;
}
