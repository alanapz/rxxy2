import { Subject } from "rxjs";
import { Assert } from "src/app/utils";
import { PipelineElement } from "src/models/pipeline-element";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineSubscription } from "src/models/pipeline-subscription";

export class PipelineSubject extends PipelineElement {

  private subject: Subject<unknown>;

  onInit(): void {
    this.rxCtx.addSubject(this);
  }

  getSubject(): Subject<unknown> {
    return this.subject;
  }

  setSubject(subject: Subject<unknown>): void {
    this.subject = Assert.isSubject(subject);
  }

  pipelineStarted(): void {
    // Nothing to do here
  }

  pipelineStopped(): void {
    // Nothing to do here
  }

  pipelineReset(): void {
    // Nothing to do here
  }

  asObservable(): PipelineObservable {

    const observable = new PipelineObservable(
      this.rxCtx,
      this.type,
      this.iconName,
      this.helpUrl,
      this.helpTitle,
      this.argsText);

    observable.setSupplier(() => this.subject);
    observable.setSubject(this);

    return observable;
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  pipe( ... operators: unknown[]): PipelineObservable {
    return this.asObservable().pipe( ... operators);
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  subscribe( ... args: unknown[]): PipelineSubscription {
    return this.asObservable().subscribe( ... args);
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  next(value?: unknown): void {
    this.events.pushNext('out', value);
    this.subject.next(value);
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  error(err: unknown): void {
    this.events.pushError('out', err);
    this.subject.error(err);
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  complete(): void {
    this.events.pushComplete('out');
    this.subject.complete();
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  unsubscribe(): never {
    throw 'unsubscribe() not supported - click \'Stop\' to remove subscriber';
  }

  // Subjects are always top-level
  isTopLevelElement(): boolean {
    return true;
  }
}
