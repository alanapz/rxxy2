import { MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic } from "rxjs";
import { assert, Assert } from "src/app/utils";
import { Pipeline } from "src/models/pipeline";

export function pipelineFlowControl<T>(pipeline: Pipeline): MonoTypeOperatorFunction<T> {
  assert(pipeline, 'pipeline');
  return function flowControlOperatorFunction(source: Observable<T>): Observable<T> {
    return source.lift(new PipelineFlowControlOperator(pipeline));
  };
}

class PipelineFlowControlOperator<T> implements Operator<T, T> {

  constructor(private readonly pipeline: Pipeline) {
    assert(pipeline, 'pipeline');
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    assert(subscriber, 'subscriber');
    Assert.isObservable(source, 'source');
    return source.subscribe(new PipelineFlowControlSubscriber(subscriber, this.pipeline));
  }
}

class PipelineFlowControlSubscriber<T> extends Subscriber<T> {

  constructor(
    protected readonly destination: Subscriber<T>,
    protected readonly pipeline: Pipeline) {
    super(destination);

    assert(destination, 'destination');
    assert(pipeline, 'pipeline');
  }

  _next(value: T): void {
    this.pipeline.registerStep(() => this.destination.next(value));
  }

  _error(err: any): void {
    this.pipeline.registerStep(() => this.destination.error(err));
  }

  _complete(): void {
    this.pipeline.registerStep(() => this.destination.complete());
  }
}
