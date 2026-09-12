import { MadiAvatarAnimationFrame } from '../../core/avatar/avatar.animation.contract';
import { MadiLipSyncTrack, MadiViseme } from '../../core/avatar/lip-sync.contract';

/** Converts provider-neutral visemes into renderer-neutral facial frames. */
export class VisemeAvatarMapper {
  map(track: MadiLipSyncTrack): readonly MadiAvatarAnimationFrame[] {
    return track.frames.map((frame) => {
      const mouth = this.mouth(frame.viseme);
      return {
        timestampMs: frame.startMs,
        expression: 'speaking',
        animation: 'speak',
        mouthOpen: mouth.open * (frame.weight ?? 1),
        mouthWide: mouth.wide,
        eyeOpen: 1,
        intensity: 1,
      };
    });
  }

  private mouth(viseme: MadiViseme): { open: number; wide: number } {
    switch (viseme) {
      case 'AA': return { open: 0.9, wide: 0.45 };
      case 'EE': return { open: 0.45, wide: 0.95 };
      case 'OO': return { open: 0.65, wide: 0.15 };
      case 'PP': return { open: 0.05, wide: 0.25 };
      case 'FF': return { open: 0.3, wide: 0.3 };
      case 'TH': return { open: 0.35, wide: 0.55 };
      case 'CH': return { open: 0.35, wide: 0.7 };
      case 'SS': return { open: 0.18, wide: 0.8 };
      case 'DD':
      case 'KK':
      case 'NN':
      case 'RR': return { open: 0.25, wide: 0.55 };
      default: return { open: 0.02, wide: 0.3 };
    }
  }
}
