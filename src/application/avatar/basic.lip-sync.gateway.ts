import {
  MadiLipSyncGateway,
  MadiLipSyncInput,
  MadiLipSyncTrack,
  MadiViseme,
} from '../../core/avatar/lip-sync.contract';

/** Safe baseline until a TTS provider exposes real phoneme/viseme timing. */
export class BasicLipSyncGateway implements MadiLipSyncGateway {
  async createTrack(input: MadiLipSyncInput): Promise<MadiLipSyncTrack> {
    const text = input.text.trim();
    if (!text) return { durationMs: 0, frames: [] };

    const tokens = [...text].filter((char) => /[\p{L}\p{N}]/u.test(char));
    const frameDuration = 90;
    const frames = tokens.map((char, index) => ({
      startMs: index * frameDuration,
      endMs: (index + 1) * frameDuration,
      viseme: this.mapCharacter(char),
      weight: 1,
    }));

    return { durationMs: frames.length * frameDuration, frames };
  }

  private mapCharacter(char: string): MadiViseme {
    const value = char.toLowerCase();
    if ('ae'.includes(value)) return 'AA';
    if ('i'.includes(value)) return 'EE';
    if ('ou'.includes(value)) return 'OO';
    if ('pbm'.includes(value)) return 'PP';
    if ('fv'.includes(value)) return 'FF';
    if ('td'.includes(value)) return 'DD';
    if ('kgcq'.includes(value)) return 'KK';
    if ('ch'.includes(value)) return 'CH';
    if ('szx'.includes(value)) return 'SS';
    if ('nr'.includes(value)) return 'NN';
    return 'sil';
  }
}
