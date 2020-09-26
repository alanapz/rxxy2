import { AsyncSubject, MonoTypeOperatorFunction, Observable, Operator, Subject, Subscriber, TeardownLogic } from "rxjs";
import { assert, Assert } from "src/app/utils";
import { PipelineEventList } from "src/models/pipeline-event-list";
import { PipelineOperator } from "src/models/pipeline-operator";

export class PipelinePauseOperator extends PipelineOperator {

  onInit(): void {
    // Nothing to do here
  }

  apply(observable: Observable<unknown>): Observable<unknown> {
    return observable.pipe(pause(this));
  }

  getEventsList(): PipelineEventList {
    return this.events;
  }
}

function pause<T>(parent: PipelinePauseOperator): MonoTypeOperatorFunction<T> {
  assert(parent, 'parent');
  return function pauseOperatorFunction(source: Observable<T>): Observable<T> {
    return source.lift(new PauseOperator(parent));
  };
}

class PauseOperator<T> implements Operator<T, T> {

  constructor(private readonly parent: PipelinePauseOperator) {
    assert(parent, 'parent');
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    assert(subscriber, 'subscriber');
    Assert.isObservable(source, 'source');
    return source.subscribe(new PauseSubscriber(subscriber, this.parent.getEventsList()));
  }
}

class PauseSubscriber<T> extends Subscriber<T> {

  private completeNotifier = new AsyncSubject<unknown>();

  private pendingEvents = 0;

  constructor(
    protected readonly destination: Subscriber<T>,
    protected readonly events: PipelineEventList) {
    super(destination);

    assert(destination, 'destination');
    assert(events, 'events');
  }

  _next(value: T): void {
    const notifier = this.buildNotifier();
    this.events.pushNextWithPause(value, notifier);

    notifier.subscribe(() => {
      this.destination.next(value);
      this.updateNotifier();
    });
  }

  _error(err?: any): void {
    const notifier = this.buildNotifier();
    this.events.pushErrorWithPause(err, notifier);

    notifier.subscribe(() => {
      this.destination.error(err);
      this.updateNotifier();
    });
  }

  _complete(): void {
    this.completeNotifier.subscribe(() => this.destination.complete());
  }

  private buildNotifier(): Subject<unknown> {
    this.pendingEvents++;
    return new AsyncSubject<unknown>();
  }

  private updateNotifier(): void {
    this.pendingEvents--;
    if (!this.pendingEvents) {
      this.completeNotifier.next(null);
      this.completeNotifier.complete();
    }
  }
}
