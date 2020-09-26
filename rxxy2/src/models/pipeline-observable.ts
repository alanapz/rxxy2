import { Observable, PartialObserver } from "rxjs";
import { assert, Assert, RxxyUtils } from "src/app/utils";
import { Pipeline } from "src/models/pipeline";
import { PipelineElement } from "src/models/pipeline-element";
import { PipelineOperator } from "src/models/pipeline-operator";
import { PipelineSubject } from "src/models/pipeline-subject";
import { PipelineSubscription } from "src/models/pipeline-subscription";
import { pipelineFlowControl } from "src/utils/pipeline-flow-control";

export class PipelineObservable extends PipelineElement {

  private supplier: () => Observable<unknown>;

  private supplierDescription: string;

  private subject: PipelineSubject;

  private operators: PipelineOperator[] = [];

  private parent: PipelineOperator;

  private subscriptions: PipelineSubscription[] = [];

  onInit(): void {
    this.rxCtx.addObservable(this);
  }

  getSupplier(): () => Observable<unknown> {
    return this.supplier;
  }

  setSupplier(supplier: () => Observable<unknown>): void {
    this.supplier = Assert.isFunction(supplier, 'supplier');
  }

  getSupplierDescription(): string {
    return this.supplierDescription;
  }

  setSupplierDescription(supplierDescription: string): void {
    this.supplierDescription = supplierDescription;
  }

  setSubject(subject: PipelineSubject): void {
    this.subject = subject;
  }

  getParent(): PipelineOperator {
    return this.parent;
  }

  setParent(parent: PipelineOperator): void {
    assert(parent, 'parent');
    this.parent = parent;
  }

  getOperators(): PipelineOperator[] {
    return this.operators;
  }

  pipelineStarted(): void {
    this.events.clear();
    this.operators.forEach(operator => operator.pipelineStarted());
  }

  pipelineStopped(): void {
    this.operators.forEach(operator => operator.pipelineStopped());
  }

  pipelineReset(): void {
    this.events.clear();
    this.operators.forEach(operator => operator.pipelineReset());
  }

  isPaused(): boolean {
    return this.operators.some(operator => operator.isPaused());
  }

  // An observable is top-level observable if it has no parent operator
  isTopLevelElement(): boolean {
    return !this.parent;
  }

  build(flowControl?: Pipeline): Observable<unknown> {

    const source = Assert.isObservable(this.supplier());

    let pipeline$: Observable<unknown> = source.pipe();

    // First add flow-control (so step works properly)
    if (flowControl) {
      pipeline$ = pipeline$.pipe(pipelineFlowControl(flowControl));
    }

    // Then add notification - 'out' in this case refers to 'out' from source
    pipeline$ = pipeline$.pipe(this.events.tap('out'));

    // Operators
    for (const operator of this.operators) {
      pipeline$ = operator.apply(pipeline$);
    }

    return pipeline$.pipe(/* this.events.tap('out') */);
  }

  // DIRECTLY CALLABLE - Do not remove or change signature
  pipe( ... operators: unknown[]): PipelineObservable {
    operators.forEach((operator: PipelineOperator) => {
      assert(operator instanceof PipelineOperator, `Value passed to pipe() must be an operator, ${operator} is not an operator`, operator);
      this.operators.push(operator);
      operator.setParent(this);
    });
    return this;
  }

  subscribe( ... args: unknown[]): PipelineSubscription {

    const observer: PartialObserver<unknown> = RxxyUtils.wrapObserver( ... args);
    if (!observer) {
      throw `Unable to subscribe() using supplied observer`;
    }

    const pipeline: Pipeline = new Pipeline(
      this.rxCtx,
      this,
      RxxyUtils.wrapObserver(observer),
      RxxyUtils.buildArgsText('subscribe', args));

    const subscription = new PipelineSubscription(this, pipeline);
    this.subscriptions.push(subscription);
    return subscription;
  }
}
