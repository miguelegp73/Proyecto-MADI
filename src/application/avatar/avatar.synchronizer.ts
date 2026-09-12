import { MadiAvatarGateway, MadiAvatarState } from '../../core/avatar/avatar.contract';

/** Coordinates avatar state with voice lifecycle without coupling to a renderer. */
export class AvatarSpeechSynchronizer {
  constructor(private readonly avatar: MadiAvatarGateway) {}

  listening(): Promise<void> {
    return this.avatar.setState({ expression: 'listening', speaking: false, intensity: 0.5 });
  }

  thinking(): Promise<void> {
    return this.avatar.setState({ expression: 'thinking', speaking: false, intensity: 0.5 });
  }

  speaking(progress = 0): Promise<void> {
    const state: MadiAvatarState = {
      expression: 'speaking',
      speaking: true,
      intensity: 1,
      speechProgress: Math.min(1, Math.max(0, progress)),
    };
    return this.avatar.setState(state);
  }

  completed(): Promise<void> {
    return this.avatar.setState({ expression: 'neutral', speaking: false, intensity: 0.2, speechProgress: 1 });
  }

  error(): Promise<void> {
    return this.avatar.setState({ expression: 'error', speaking: false, intensity: 0.8 });
  }
}
