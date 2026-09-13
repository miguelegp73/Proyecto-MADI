import {
  MadiAvatarAnimationFrame,
  MadiAvatarAnimationGateway,
} from '../../core/avatar/avatar.animation.contract';
import { MadiAvatarExpression } from '../../core/avatar/avatar.contract';
import { MadiLipSyncGateway, MadiLipSyncInput, MadiLipSyncTrack, MadiViseme } from '../../core/avatar/lip-sync.contract';

/** Converts provider-neutral visemes into renderer-neutral facial animation frames. */
export class AvatarLipSyncService {
  constructor(
    private readonly lipSync: MadiLipSyncGateway,
    private readonly animation: MadiAvatarAnimationGateway,
  ) {}

  async speak(input: MadiLipSyncInput, expression: MadiAvatarExpression = 'speaking'): Promise<MadiLipSyncTrack> {
    const track = await this.lipSync.createTrack(input);
    const frames = track.frames.map((frame) => this.toAnimationFrame(frame.startMs, frame.endMs, frame.viseme, frame.weight, expression));
    await this.animation.play({ durationMs: track.durationMs, frames });
    return track;
  }

  private toAnimationFrame(
    startMs: number,
    endMs: number,
    viseme: MadiViseme,
    weight: number | undefined,
    expression: MadiAvatarExpression,
  ): MadiAvatarAnimationFrame {
    const mouth = this.mouthFor(viseme) * (weight ?? 1);
    return {
      timestampMs: startMs,
      expression,
      animation: 'speak',
      mouthOpen: Math.min(1, Math.max(0, mouth)),
      mouthWide: this.widthFor(viseme),
      intensity: 1,
    };
  }

  private mouthFor(viseme: MadiViseme): number {
    switch (viseme) {
      case 'sil': return 0;
      case 'PP': return 0.12;
      case 'FF': return 0.2;
      case 'TH': return 0.28;
      case 'DD': return 0.3;
      case 'KK': return 0.32;
      case 'CH': return 0.38;
      case 'SS': return 0.25;
      case 'NN': return 0.18;
      case 'RR': return 0.28;
      case 'AA': return 0.82;
      case 'EE': return 0.52;
      case 'OO': return 0.68;
    }
  }

  private widthFor(viseme: MadiViseme): number {
    switch (viseme) {
      case 'EE':
      case 'SS': return 0.85;
      case 'OO':
      case 'PP': return 0.25;
      default: return 0.5;
    }
  }
}
