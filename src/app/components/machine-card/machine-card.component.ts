// src/app/components/machine-card/machine-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Machine } from '../../models/machine.model';
import { MachineService } from '../../services/machine.service';

@Component({
  selector: 'app-machine-card',
  templateUrl: './machine-card.component.html',
  styleUrls: ['./machine-card.component.css']
})
export class MachineCardComponent {
  @Input() machine!: Machine;
  @Output() reserve = new EventEmitter<number>();

  constructor(private ms: MachineService) {}

  getRemainingMinutes(): number | null {
    if (!this.machine.endTime) return null;
    const end = new Date(this.machine.endTime).getTime();
    const diff = Math.max(0, end - Date.now());
    return Math.ceil(diff / 1000);
  }

  onReserveClick() {
    this.reserve.emit(this.machine.id);
  }

  cancelFromQueue(name: string) {
    this.ms.cancelFromQueue(this.machine.id, name);
  }

  adminSkip() {
    this.ms.skipCurrent(this.machine.id);
  }
}
