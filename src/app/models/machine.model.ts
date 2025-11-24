export type MachineStatus = 'free' | 'busy';

export interface Machine {
  id: number;
  name: string;
  status: MachineStatus;
  currentUser?: string;
  endTime?: string;
  queue: string[];
  slotDurationMinutes?: number;
}
