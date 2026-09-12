import {
  MadiAvatarAnimationFrame,
  MadiAvatarAnimationGateway,
  MadiAvatarAnimationSequence,
} from '../../core/avatar/avatar.animation.contract';
import { MadiAvatarExpression, MadiAvatarState } from '../../core/avatar/avatar.contract';

/** Small deterministic engine for UI animation. A future renderer can consume the same sequence. */
export class AvatarAnimationEngine implements MadiAvatarAnimationGateway {
  private state: MadiAvatarState = { expression: 'neutral', speaking: false, intensity: 0.2 };

  async applyState(state: MadiAvatarState): Promise<void> {
    this.state = { ...state };
  }

  async play(sequence: MadiAvatarAnimationSequence): Promise<void> {
    if (sequence.durationMs < 0) throw new Error('La duración de la animación no puede ser negativa.');
    for (const frame of sequence.frames) {
      if (frame.timestampMs < 0 || frame.timestampMs > sequence.durationMs) {
        throw new Error('El frame de animación está fuera de la duración declarada.');
      }
    }
  }

  getState(): MadiAvatarState {
    return { ...this.state };
  }

  createSpeechFrame(timestampMs: number, mouthOpen: number, expression: MadiAvatarExpression = 'speaking'): MadiAvatarAnimationFrame {
    return {
      timestampMs,
      expression,
      animation: 'speak',
      mouthOpen: Math.min(1, Math.max(0, mouthOpen)),
      eyeOpen: 1,
      intensity: 1,
    };
  }
}
