import { Injectable } from '@angular/core';
import {
  Observable,
  timer,
  Subject,
  BehaviorSubject,
  Subscription
} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StopWatch } from './stop-watch';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private readonly initialTime = 0;

  private timer$: BehaviorSubject<number> = new BehaviorSubject(
    this.initialTime
  );
  private lastStopedTime: number = this.initialTime;
  private timerSubscription: Subscription = new Subscription();
  private isRunning = false;

  constructor() {}

  public get stopWatch$(): Observable<StopWatch> {
    return this.timer$.pipe(
      map((seconds: number): StopWatch => this.secondsToStopWatch(seconds))
    );
  }

  startCount(): void {
    if (this.isRunning) {
      return;
    }
    // tslint:disable-next-line:max-line-length
    this.timerSubscription = timer(0, 1000) // Timer, so that the first emit is instantly (interval waits until the period is over for the first emit)
      .pipe(map((value: number): number => value + this.lastStopedTime))
      .subscribe(this.timer$); // each emit of the Observable will result in a emit of the BehaviorSubject timer$
    this.isRunning = true;
  }

  stopTimer(): void {
    this.lastStopedTime = this.timer$.value;
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }

  resetTimer(): void {
    this.timerSubscription.unsubscribe();
    this.lastStopedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    this.isRunning = false;
  }

  private secondsToStopWatch(seconds: number): StopWatch {
    let rest = seconds;
    const hours = Math.floor(seconds / 3600);
    rest = seconds % 3600;
    const minutes = Math.floor(rest / 60);
    rest = seconds % 60;

    return {
      hours: this.convertToNumberString(hours),
      minutes: this.convertToNumberString(minutes),
      seconds: this.convertToNumberString(seconds)
    };
  }

  private convertToNumberString(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }
}
