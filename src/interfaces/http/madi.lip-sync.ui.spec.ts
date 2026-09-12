import { MadiVoiceUiController } from './madi.voice.ui.controller';

describe('MadiVoiceUiController lip-sync integration hooks', () => {
  it('keeps the current speech animation boundary explicit and renderer-side', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('speechTimer');
    expect(html).toContain('speechSynthesis');
    expect(html).toContain('class="mouth"');
  });

  it('exposes a stable target for future viseme application without changing the interaction API', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('id="avatar"');
    expect(html).toContain("setState('speaking'");
    expect(html).toContain("setState(active?'listening'");
  });
});
