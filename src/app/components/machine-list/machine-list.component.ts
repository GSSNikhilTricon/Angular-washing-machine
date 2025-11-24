// src/app/components/machine-list/machine-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Machine } from '../../models/machine.model';
import { MachineService } from '../../services/machine.service';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  machines$!: Observable<Machine[]>;

  // modal state
  showReserveModal = false;
  modalMachineId?: number;

  constructor(public ms: MachineService) {}

  ngOnInit(): void {
    this.machines$ = this.ms.machines$;
  }

  openReserve(machineId: number) {
    this.modalMachineId = machineId;
    this.showReserveModal = true;
  }

  closeModal() {
    this.showReserveModal = false;
    this.modalMachineId = undefined;
  }
}
