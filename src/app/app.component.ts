// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-machine-list></app-machine-list>
              <app-toast-list></app-toast-list>`,
  styles: []
})
export class AppComponent {}
