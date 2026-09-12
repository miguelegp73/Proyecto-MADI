import { MadiVoiceUiController } from './madi.voice.ui.controller';

describe('MadiVoiceUiController avatar interface', () => {
  it('renders the definitive dynamic avatar presentation layer', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('class="avatar listening"');
    expect(html).toContain('class="head"');
    expect(html).toContain('class="eye l"');
    expect(html).toContain('class="eye r"');
    expect(html).toContain('class="mouth"');
    expect(html).toContain('function setState');
    expect(html).toContain('function speak');
    expect(html).toContain('speechSynthesis');
    expect(html).toContain('speechTimer');
    expect(html).toContain('class="halo"');
  });

  it('keeps the voice and activation interface available', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('SpeechRecognition');
    expect(html).toContain('function isWakePhrase');
    expect(html).toContain('function activate');
    expect(html).toContain('/interactions');
  });
});
