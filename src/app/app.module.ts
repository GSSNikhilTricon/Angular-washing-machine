// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MachineListComponent } from './components/machine-list/machine-list.component';
import { MachineCardComponent } from './components/machine-card/machine-card.component';
import { ReserveModalComponent } from './components/reserve-modal/reserve-modal.component';
import { ToastListComponent } from './components/toast-list/toast-list.component';
import { CardStyleDirective } from './directives/card-style.directive';

@NgModule({
  declarations: [
    AppComponent,
    MachineListComponent,
    MachineCardComponent,
    ReserveModalComponent,
    ToastListComponent,
    CardStyleDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
