import { MadiVoiceUiController } from './madi.voice.ui.controller';

describe('MadiVoiceUiController lip-sync integration hooks', () => {
  it('keeps the current speech animation boundary explicit and renderer-side', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('speechTimer');
    expect(html).toContain('speechSynthesis');
    expect(html).toContain('class="mouth"');
  });

  it('exposes a stable avatar target and speech/listening state transitions', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('id="avatar"');
    expect(html).toContain("setState('speaking'");
    expect(html).toContain("setState('listening',active?'Escuchando a M.A.D.I.…':'En espera — di “M.A.D.I.”')");
  });
});
