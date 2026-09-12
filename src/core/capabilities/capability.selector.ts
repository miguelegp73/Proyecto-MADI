import { MadiIntent } from '../intent/intent.contract';
import { MadiCapability } from './capability.contract';

export interface MadiCapabilitySelection {
  capabilityId?: string;
  reason: string;
  confidence: number;
}

export interface MadiCapabilitySelector {
  select(intent: MadiIntent, capabilities: MadiCapability[]): Promise<MadiCapabilitySelection>;
}

export class BasicCapabilitySelector implements MadiCapabilitySelector {
  async select(intent: MadiIntent, capabilities: MadiCapability[]): Promise<MadiCapabilitySelection> {
    if (intent.domain !== 'action') {
      return { reason: 'La intención no requiere una capacidad ejecutable.', confidence: 1 };
    }
    if (capabilities.length === 1) {
      return { capabilityId: capabilities[0].id, reason: 'Única capacidad disponible.', confidence: 0.5 };
    }
    return { reason: 'No existe una selección determinista segura.', confidence: 0 };
  }
}
