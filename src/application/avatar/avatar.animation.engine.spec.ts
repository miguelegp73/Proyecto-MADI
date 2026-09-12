import { AvatarAnimationEngine } from './avatar.animation.engine';

describe('AvatarAnimationEngine', () => {
  it('stores avatar state without coupling to a renderer', async () => {
    const engine = new AvatarAnimationEngine();
    await engine.applyState({ expression: 'thinking', speaking: false, intensity: 0.6 });
    expect(engine.getState()).toEqual({ expression: 'thinking', speaking: false, intensity: 0.6 });
  });

  it('creates bounded speech frames for future lip-sync renderers', () => {
    const engine = new AvatarAnimationEngine();
    expect(engine.createSpeechFrame(120, 1.8)).toMatchObject({
      timestampMs: 120,
      animation: 'speak',
      expression: 'speaking',
      mouthOpen: 1,
    });
    expect(engine.createSpeechFrame(240, -1).mouthOpen).toBe(0);
  });

  it('rejects invalid animation timelines', async () => {
    const engine = new AvatarAnimationEngine();
    await expect(engine.play({ durationMs: 100, frames: [{ timestampMs: 101, expression: 'speaking', animation: 'speak' }] })).rejects.toThrow();
  });
});
