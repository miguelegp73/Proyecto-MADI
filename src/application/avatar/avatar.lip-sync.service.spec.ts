import { AvatarLipSyncService } from './avatar.lip-sync.service';
import { MadiAvatarAnimationGateway } from '../../core/avatar/avatar.animation.contract';
import { MadiLipSyncGateway } from '../../core/avatar/lip-sync.contract';

describe('AvatarLipSyncService', () => {
  it('converts visemes into bounded speech animation frames', async () => {
    const animation: MadiAvatarAnimationGateway = {
      applyState: jest.fn(),
      play: jest.fn().mockResolvedValue(undefined),
    };
    const lipSync: MadiLipSyncGateway = {
      createTrack: jest.fn().mockResolvedValue({
        durationMs: 180,
        frames: [
          { startMs: 0, endMs: 90, viseme: 'AA' },
          { startMs: 90, endMs: 180, viseme: 'PP' },
        ],
      }),
    };

    const service = new AvatarLipSyncService(lipSync, animation);
    const track = await service.speak({ text: 'AP', language: 'es-AR' });

    expect(track.durationMs).toBe(180);
    expect(animation.play).toHaveBeenCalledWith({
      durationMs: 180,
      frames: [
        expect.objectContaining({ timestampMs: 0, animation: 'speak', mouthOpen: 0.82 }),
        expect.objectContaining({ timestampMs: 90, animation: 'speak', mouthOpen: 0.12 }),
      ],
    });
  });

  it('applies explicit frame weight', async () => {
    const animation: MadiAvatarAnimationGateway = {
      applyState: jest.fn(),
      play: jest.fn().mockResolvedValue(undefined),
    };
    const lipSync: MadiLipSyncGateway = {
      createTrack: jest.fn().mockResolvedValue({
        durationMs: 90,
        frames: [{ startMs: 0, endMs: 90, viseme: 'AA', weight: 2 }],
      }),
    };

    await new AvatarLipSyncService(lipSync, animation).speak({ text: 'a' });

    expect(animation.play).toHaveBeenCalledWith({
      durationMs: 90,
      frames: [expect.objectContaining({ mouthOpen: 1 })],
    });
  });
});
