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
});
