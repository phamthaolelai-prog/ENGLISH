
export type AppTab = 'vocab' | 'sentence';

export type ToastType = 'ok' | 'warn' | 'bad';

export interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export interface Unit {
  name: string;
  vocab: string[];
  topicChips: string[];
  qs: string[];
  builderType: 'country' | 'routine' | 'week' | 'party' | 'ability';
}

export interface Data {
  units: { [key: number]: Unit };
  days: string[];
  countries: string[];
  routines: string[];
  partyEat: string[];
  partyDrink: string[];
  abilities: string[];
}
