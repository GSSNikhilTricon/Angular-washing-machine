// src/app/services/machine.service.ts
import { ToastService } from './toast.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Machine } from '../models/machine.model';

const STORAGE_KEY = 'pg-washer-machines-v1';
const DEFAULT_SLOT_MIN = 30;

@Injectable({
    providedIn: 'root'
})
export class MachineService implements OnDestroy {
    private _machines$ = new BehaviorSubject<Machine[]>(this.loadInitial());
    readonly machines$ = this._machines$.asObservable();

    private tickerSub: Subscription;

    constructor(private toast: ToastService) {
        // check every 1 seconds so UI updates reasonably without heavy timers
        this.tickerSub = interval(1000).subscribe(() => this.checkAndAdvance());

        if (Notification && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    ngOnDestroy(): void {
        this.tickerSub?.unsubscribe();
    }

    getMachinesSnapshot(): Machine[] {
        return JSON.parse(JSON.stringify(this._machines$.value)) as Machine[];
    }

    reserve(machineId: number, name: string, durationMinutes: number) {
        const machines = this.getMachinesSnapshot();
        const m = machines.find(x => x.id === machineId);
        if (!m) return;

        if (m.status === 'free') {
            m.status = 'busy';
            m.currentUser = name;
            m.endTime = new Date(Date.now() + durationMinutes * 1000).toISOString();
            m.slotDurationMinutes = durationMinutes;
        } else {
            // push to queue
            m.queue.push(name);
            // store the slot duration preference for queued users (optional)
            if (!m.slotDurationMinutes) m.slotDurationMinutes = durationMinutes;
        }

        this.updateAndPersist(machines);
    }

    cancelFromQueue(machineId: number, name: string) {
        const machines = this.getMachinesSnapshot();
        const m = machines.find(x => x.id === machineId);
        if (!m) return;
        m.queue = m.queue.filter(q => q !== name);
        this.updateAndPersist(machines);
    }

    skipCurrent(machineId: number) {
        // admin action to skip current user (useful for testing)
        const machines = this.getMachinesSnapshot();
        const m = machines.find(x => x.id === machineId);
        if (!m) return;
        this.advanceMachine(m);
        this.updateAndPersist(machines);
    }

    private checkAndAdvance() {
        const machines = this.getMachinesSnapshot();
        const now = new Date();
        let changed = false;

        machines.forEach(m => {
            if (m.status === 'busy' && m.endTime) {
                const end = new Date(m.endTime);
                if (now >= end) {
                    // time's up → advance
                    this.advanceMachine(m);
                    changed = true;
                }
            }
        });

        if (changed) this.updateAndPersist(machines);
    }

    private advanceMachine(m: Machine) {
        const previousUser = m.currentUser;

        if (m.queue.length > 0) {
            const next = m.queue.shift()!;
            m.currentUser = next;
            const dur = m.slotDurationMinutes ?? DEFAULT_SLOT_MIN;
            m.endTime = new Date(Date.now() + dur * 1000).toISOString();
            m.status = 'busy';
        } else {
            m.status = 'free';
            m.currentUser = undefined;
            m.endTime = undefined;
        }

        if (previousUser) {
            this.sendDoneNotification(m.name, previousUser);
        }
    }

    private updateAndPersist(machines: Machine[]) {
        this._machines$.next(machines);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
        } catch (e) {
            console.warn('could not persist machines to localStorage', e);
        }
    }

    private loadInitial(): Machine[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Machine[];
                // defensive: ensure 2 machines exist with ids 1 and 2
                return this.ensureTwoMachines(parsed);
            }
        } catch {
            // ignore
        }
        return this.ensureTwoMachines([]);
    }

    private ensureTwoMachines(arr: Machine[]) {
        const m1 = arr.find(x => x.id === 1);
        const m2 = arr.find(x => x.id === 2);
        const cleaned: Machine[] = [
            m1 ?? { id: 1, name: 'Machine 1', status: 'free', queue: [] },
            m2 ?? { id: 2, name: 'Machine 2', status: 'free', queue: [] }
        ];
        return cleaned;
    }

    private sendDoneNotification(machineName: string, user: string) {
        // toast
        this.toast.show(`${machineName} is free now! (previous: ${user})`);

        // browser notification
        if (Notification && Notification.permission === 'granted') {
            new Notification(`${machineName} is now free`, {
                body: `${user}'s laundry is done.`,
            });
        }
    }
}
