// src/app/components/reserve-modal/reserve-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MachineService } from '../../services/machine.service';

@Component({
  selector: 'app-reserve-modal',
  templateUrl: './reserve-modal.component.html',
  styleUrls: ['./reserve-modal.component.css']
})
export class ReserveModalComponent {
  @Input() machineId!: number;
  @Output() close = new EventEmitter<void>();

  name = '';
  minutes = 30;

  busy = false;

  constructor(private ms: MachineService) {}

  submit() {
    if (!this.name || this.name.trim().length === 0) return alert('Enter name');
    if (this.minutes <= 0) return alert('Duration must be > 0');

    this.busy = true;
    this.ms.reserve(this.machineId, this.name.trim(), Math.floor(this.minutes));
    this.busy = false;
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }
}
