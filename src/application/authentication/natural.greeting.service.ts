import {
  MadiGreetingResult,
  MadiGreetingService,
} from '../../core/authentication/greeting.contract';
import { MadiAuthenticationSession } from '../../core/authentication/session.contract';

/** Natural first-session greeting. It intentionally does not authorize actions. */
export class NaturalGreetingService implements MadiGreetingService {
  async greet(session: MadiAuthenticationSession): Promise<MadiGreetingResult> {
    if (session.state !== 'authenticated' || !session.identity?.userId) {
      return { shouldGreet: false };
    }

    const name = session.identity.displayName?.trim();
    return {
      shouldGreet: true,
      message: name
        ? `¡Hola ${name}! Bienvenido. ¿En qué puedo ayudarte?`
        : '¡Hola! Bienvenido. ¿En qué puedo ayudarte?',
    };
  }
}
