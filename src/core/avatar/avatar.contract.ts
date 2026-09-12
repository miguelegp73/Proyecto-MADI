export type MadiAvatarExpression = 'neutral' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'concerned' | 'error';

export interface MadiAvatarState {
  expression: MadiAvatarExpression;
  speaking: boolean;
  intensity?: number;
  speechProgress?: number;
}

export interface MadiAvatarGateway {
  setState(state: MadiAvatarState): Promise<void>;
}
