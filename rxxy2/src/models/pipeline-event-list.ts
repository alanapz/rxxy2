import { MonoTypeOperatorFunction, Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { assert } from "src/app/utils";
import { PipelineEvent } from "src/models/pipeline-event";
import { PipelineObservable } from "src/models/pipeline-observable";

export declare type Direction = 'in' | 'out';

export class PipelineEventList {

  private readonly events: PipelineEvent[] = [];

  private readonly newEvent$ = new Subject<PipelineEvent>();

  onNewEvent(): Observable<PipelineEvent> {
    return this.newEvent$.asObservable();
  }

  getEvents(): PipelineEvent[] {
    return this.events;
  }

  pushNext(direction: Direction, value: unknown): void {
    this.push({type: direction, isNext: true, value});
  }

  pushError(direction: Direction, error: unknown): void {
    this.push({type: direction, isError: true, error});
  }

  pushComplete(direction: Direction): void {
    this.push({type: direction, isComplete: true});
  }

  pushNextWithPause(value: unknown, notifier: Subject<unknown>): void {
    this.push({type: 'pause', isNext: true, value, notifier});
  }

  pushErrorWithPause(error: unknown, notifier: Subject<unknown>): void {
    this.push({type: 'pause', isError: true, error, notifier});
  }

  pushCompleteWithPause(notifier: Subject<unknown>): void {
    this.push({type: 'pause', isComplete: true, notifier});
  }

  pushObservable(observable: PipelineObservable): void {
    this.push({type: 'inner', observable});
  }

  private push(result: PipelineEvent): void {
    assert(result, 'result');
    this.events.push(result);
    this.newEvent$.next(result);
  }

  clear(): void {
    this.events.length = 0;
  }

  tap(direction: Direction): MonoTypeOperatorFunction<unknown> {
    return tap({
      next: (value: unknown) => this.pushNext(direction, value),
      error: (err: unknown) => this.pushError(direction, err),
      complete: () => this.pushComplete(direction)
    })
  }
}
