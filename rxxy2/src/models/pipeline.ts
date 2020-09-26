import { Observable, PartialObserver, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { assert, Assert } from "src/app/utils";
import { PipelineEvent } from "src/models/pipeline-event";
import { PipelineEventList } from "src/models/pipeline-event-list";
import { ObserverMetadata, OperatorMetadata, PipelineMetadata } from "src/models/pipeline-metadata";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from "src/models/pipeline-operator";
import { RxCtx } from "src/models/rx-ctx";

export declare type PipelineStep = (() => void);

export class Pipeline {

  private readonly pendingSteps: PipelineStep[] = [];

  private autoAdvance: boolean = false;

  private metadata: PipelineMetadata;

  private readonly pipelineCompleted$ = new Subject<unknown>();

  private readonly observerEvents: PipelineEventList = new PipelineEventList();

  private state: 'pending' | 'step' | 'running' | 'complete' = 'pending';

  constructor(
    private readonly rxCtx: RxCtx,
    private readonly source: PipelineObservable,
    private readonly observer: PartialObserver<unknown>,
    private readonly observerText: string) {

    assert(rxCtx, 'rxCtx');
    assert(source, 'source');
    assert(observer, 'observer');
    assert(observerText, 'observerText');

    this.rxCtx.addPipeline(this);
  }

  getSource(): PipelineObservable {
    return this.source;
  }

  getObserverText(): string {
    return this.observerText;
  }

  getMetadata(): PipelineMetadata {
    return this.metadata;
  }

  setMetadata(metadata: PipelineMetadata): void {
    this.metadata = metadata;
  }

  getOperatorMetadata(index: number): OperatorMetadata {
    return (this.metadata && this.metadata.operators && this.metadata.operators[index]) || {};
  }

  getObserverMetadata(): ObserverMetadata {
    return (this.metadata && this.metadata.observer) || {};
  }

  canStartPipeline(): boolean {
    return (this.state === 'pending' && !!this.source);
  }

  canAdvancePipeline(): boolean {
    return (this.state === 'step' && !!this.pendingSteps.length);
  }

  canFastForwardPipeline(): boolean {
    return (this.state === 'step');
  }

  canStopPipeline(): boolean {
    return (this.state === 'step' || this.state === 'running');
  }

  canResetPipeline(): boolean {
    return (this.state === 'complete');
  }

  isRunning(): boolean {
    return (this.state === 'step' || this.state === 'running');
  }

  isComplete(): boolean {
    return (this.state === 'complete');
  }

  resetPipeline(): void {
    console.assert(this.canResetPipeline(), 'canResetPipeline not available');
    this.doResetPipeline();
  }

  startPipeline(fastForward: boolean): void {
    console.assert(this.canStartPipeline(), 'canStartPipeline not available');

    this.doResetPipeline();

    this.state = (fastForward ? 'running' : 'step');
    this.autoAdvance = true;

    let pipeline$: Observable<unknown> = this.source.build(this);

    const next = (value: unknown) => {
      this.observerEvents.pushNext('in', value);

      // Call external observer (if any)
      this.observer.next(value);
    };

    const error = (error: any) => {
      this.observerEvents.pushError('in', error);
      this.pipelineCompleted();

      this.observer.error(error);
    };

    const complete = () => {
      this.observerEvents.pushComplete('in');
      this.pipelineCompleted();

      this.observer.complete();
    };

    const observerSubscription: Subscription = pipeline$.subscribe({next, error, complete});

    this.pipelineCompleted$.pipe(first()).subscribe(() => {
      observerSubscription.unsubscribe();
    });
  }

  advancePipeline(): void {
    console.assert(this.canAdvancePipeline(), 'canAdvancePipeline not available');

    const firstStep: PipelineStep = this.pendingSteps.shift();

    if (firstStep) {
      firstStep();
    }
  }

  // "Fasts-forwards" a pipeline - sets pipeline to mode RUNNING and executes immediately all queued actions
  // Note we execute queued actions before running, to prevent re-entrancy problems - OR NOT - ? A tester
  fastForwardPipeline(): void {
    console.assert(this.canFastForwardPipeline(), 'canFastForwardPipeline not available');

    this.state = 'running';

    while (true) {
      const firstStep: PipelineStep = this.pendingSteps.shift();
      if (!firstStep) {
        break;
      }
      firstStep();
    }
  }

  stopPipeline(): void {
    console.assert(this.canStopPipeline(), 'canStopPipeline not available');
    this.pipelineCompleted();
  }

  getSourceEvents(): PipelineEvent[] {
    return this.source.getEvents();
  }

  getObserverEvents(): PipelineEvent[] {
    return this.observerEvents.getEvents();
  }

  getOperators(): PipelineOperator[] {
    return this.source.getOperators();
  }

  // Registers a callback function that wil be called when pipeline advances
  // If pipeline is running, will call immediately
  registerStep(step: PipelineStep): void {
    Assert.isFunction(step, 'step');

    // If we are running, call callback immediately
    if (this.state === 'running' || (this.state === 'step' && this.autoAdvance)) {
      this.autoAdvance = false;
      step();
      return;
    }

    // If we are paused, put on stack to be executed when we advance
    if (this.state === 'step') {
      this.pendingSteps.push(step);
      return;
    }

    throw `Unexpected pipeline state: ${this.state}`;
  }

  private doResetPipeline(): void {
    this.pendingSteps.length = 0;
    this.state = 'pending';
    this.observerEvents.clear();
    this.source.pipelineReset();
  }

  private pipelineCompleted(): void {
    this.pendingSteps.length = 0;
    this.autoAdvance = false;
    this.state = 'complete';
    this.pipelineCompleted$.next(true);
  }
}
