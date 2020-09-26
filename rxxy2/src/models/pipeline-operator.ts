import { Observable } from "rxjs";
import { assert } from "src/app/utils";
import { PipelineElement } from "src/models/pipeline-element";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineSubject } from "src/models/pipeline-subject";

export abstract class PipelineOperator extends PipelineElement {

  private parent: PipelineObservable | PipelineSubject;

  getParent(): PipelineObservable | PipelineSubject {
    return this.parent;
  }

  setParent(parent: PipelineObservable | PipelineSubject) {
    assert(parent, 'parent');
    this.parent = parent;
  }

  pipelineStarted(): void {
    this.events.clear();
  }

  pipelineStopped(): void {
    // Nothing to do here
  }

  pipelineReset(): void {
    this.events.clear();
  }

  isPaused(): boolean {
    return this.events.getEvents().some(event => event.notifier && !event.notifier.isStopped);
  }

  isTopLevelElement(): boolean {
    return this.parent.isTopLevelElement();
  }

  abstract apply(observable: Observable<unknown>): Observable<unknown>;

  attachInnerObservable(observable: PipelineObservable): void {
    assert(observable, 'observable');
    assert(!observable.getParent(), 'inner observable already parented');

    observable.setParent(this);
    this.events.pushObservable(observable);
  }
}
