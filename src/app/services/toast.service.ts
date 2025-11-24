import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts$.asObservable();

  private counter = 0;

  show(message: string, durationMs = 3000) {
    const toast: Toast = { message, id: this.counter++ };
    const current = this._toasts$.value;
    this._toasts$.next([...current, toast]);

    setTimeout(() => this.remove(toast.id), durationMs);
  }

  remove(id: number) {
    this._toasts$.next(this._toasts$.value.filter(t => t.id !== id));
  }
}
