import { spawn } from 'node:child_process';
import { MadiCapability, MadiCapabilityRequest, MadiCapabilityResult } from './capability.contract';

const APPLICATIONS: Record<string, { command: string; args: string[]; label: string }> = {
  calculator: { command: 'calc.exe', args: [], label: 'Calculadora' },
  notepad: { command: 'notepad.exe', args: [], label: 'Bloc de notas' },
  paint: { command: 'mspaint.exe', args: [], label: 'Paint' },
  explorer: { command: 'explorer.exe', args: [], label: 'Explorador de archivos' },
};

/** Opens one of the explicitly allowlisted local Windows applications without session authentication. */
export class SystemOpenAppCapability implements MadiCapability {
  readonly id = 'system.open-app';
  readonly name = 'Abrir aplicación';
  readonly description = 'Abre una aplicación local de Windows de una lista segura y explícita.';
  readonly risk = 'low' as const;
  readonly requiresAuthorization = false;

  async execute(request: MadiCapabilityRequest): Promise<MadiCapabilityResult> {
    const application = request.input?.application;
    if (typeof application !== 'string' || !APPLICATIONS[application]) {
      return {
        success: false,
        error: {
          code: 'APPLICATION_NOT_ALLOWED',
          message: 'La aplicación solicitada no está en la lista de aplicaciones permitidas.',
        },
      };
    }

    if (process.platform !== 'win32') {
      return {
        success: false,
        error: {
          code: 'PLATFORM_NOT_SUPPORTED',
          message: 'La apertura de aplicaciones locales está implementada para Windows en M.A.D.I. v0.1.',
        },
      };
    }

    const target = APPLICATIONS[application];
    const child = spawn(target.command, target.args, { detached: true, stdio: 'ignore', windowsHide: false });
    child.unref();

    return {
      success: true,
      output: { openedApplication: application, label: target.label },
    };
  }
}
