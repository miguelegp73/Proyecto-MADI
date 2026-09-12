import { MadiVoiceUiController } from './madi.voice.ui.controller';

describe('MadiVoiceUiController', () => {
  it('renders the dynamic browser voice interface without changing core contracts', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('M.A.D.I.');
    expect(html).toContain('SpeechRecognition');
    expect(html).toContain('speechSynthesis');
    expect(html).toContain('/interactions');
    expect(html).toContain('es-AR');
    expect(html).toContain('class="avatar listening"');
    expect(html).toContain('class="head"');
    expect(html).toContain('class="eye l"');
    expect(html).toContain('class="eye r"');
    expect(html).toContain('class="mouth"');
    expect(html).toContain('speechTimer');
  });

  it('renders natural wake activation and explicitly keeps it separate from authentication', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('En espera — di “M.A.D.I.”');
    expect(html).toContain('Escuchando a M.A.D.I.…');
    expect(html).toContain('function isWakePhrase');
    expect(html).toContain('function activate');
    expect(html).toContain('Activación natural');
  });
});
