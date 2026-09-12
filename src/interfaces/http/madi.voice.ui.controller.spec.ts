import { MadiVoiceUiController } from './madi.voice.ui.controller';

describe('MadiVoiceUiController', () => {
  it('renders a browser voice interface without changing the core contracts', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('M.A.D.I.');
    expect(html).toContain('SpeechRecognition');
    expect(html).toContain('speechSynthesis');
    expect(html).toContain('/interactions');
    expect(html).toContain('es-AR');
  });

  it('renders natural wake activation and standby behavior', () => {
    const html = new MadiVoiceUiController().render();
    expect(html).toContain('En espera — di “M.A.D.I.”');
    expect(html).toContain('Escuchando a M.A.D.I.…');
    expect(html).toContain('function isWakePhrase');
    expect(html).toContain('function activate');
    expect(html).toContain('La activación no autentica al usuario');
  });
});
