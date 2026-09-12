import { VisemeAvatarMapper } from './viseme.avatar.mapper';

describe('VisemeAvatarMapper', () => {
  it('maps vowel visemes to distinct mouth shapes', () => {
    const mapper = new VisemeAvatarMapper();
    const frames = mapper.map({
      durationMs: 300,
      frames: [
        { startMs: 0, endMs: 100, viseme: 'AA' },
        { startMs: 100, endMs: 200, viseme: 'EE' },
        { startMs: 200, endMs: 300, viseme: 'OO' },
      ],
    });

    expect(frames).toHaveLength(3);
    expect(frames[0].mouthOpen).toBeGreaterThan(frames[1].mouthOpen ?? 0);
    expect(frames[1].mouthWide).toBeGreaterThan(frames[2].mouthWide ?? 0);
    expect(frames.every((frame) => frame.animation === 'speak')).toBe(true);
  });

  it('respects frame weight', () => {
    const mapper = new VisemeAvatarMapper();
    const frames = mapper.map({
      durationMs: 100,
      frames: [{ startMs: 0, endMs: 100, viseme: 'AA', weight: 0.5 }],
    });
    expect(frames[0].mouthOpen).toBeCloseTo(0.45);
  });
});
