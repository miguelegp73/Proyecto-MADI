import { MadiAvatarGateway } from '../../core/avatar/avatar.contract';
import { AvatarSpeechSynchronizer } from './avatar.synchronizer';

describe('AvatarSpeechSynchronizer', () => {
  it('maps voice lifecycle to provider-neutral avatar states', async () => {
    const avatar: MadiAvatarGateway = { setState: jest.fn().mockResolvedValue(undefined) };
    const sync = new AvatarSpeechSynchronizer(avatar);

    await sync.listening();
    await sync.thinking();
    await sync.speaking(0.4);
    await sync.completed();

    expect(avatar.setState).toHaveBeenNthCalledWith(1, expect.objectContaining({ expression: 'listening', speaking: false }));
    expect(avatar.setState).toHaveBeenNthCalledWith(2, expect.objectContaining({ expression: 'thinking', speaking: false }));
    expect(avatar.setState).toHaveBeenNthCalledWith(3, expect.objectContaining({ expression: 'speaking', speaking: true, speechProgress: 0.4 }));
    expect(avatar.setState).toHaveBeenNthCalledWith(4, expect.objectContaining({ expression: 'neutral', speaking: false }));
  });

  it('clamps speech progress to the valid range', async () => {
    const avatar: MadiAvatarGateway = { setState: jest.fn().mockResolvedValue(undefined) };
    const sync = new AvatarSpeechSynchronizer(avatar);
    await sync.speaking(4);
    expect(avatar.setState).toHaveBeenCalledWith(expect.objectContaining({ speechProgress: 1 }));
  });
});
