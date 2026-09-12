import { MadiAuthenticationSession } from './session.contract';

export interface MadiGreetingResult {
  shouldGreet: boolean;
  message?: string;
}

/** Produces a natural first-session greeting without granting permissions. */
export interface MadiGreetingService {
  greet(session: MadiAuthenticationSession): Promise<MadiGreetingResult>;
}
