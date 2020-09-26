import { Observable, OperatorFunction } from "rxjs";
import { assert } from "src/app/utils";
import { PipelineOperator } from "src/models/pipeline-operator";

export class PipelineNativeOperator extends PipelineOperator {

  private supplier: () => OperatorFunction<unknown, unknown>;

  onInit(): void {
    // Nothing to do here
  }

  getSupplier(): () => OperatorFunction<unknown, unknown> {
    return this.supplier;
  }

  setSupplier(supplier: () => OperatorFunction<unknown, unknown>): void {
    assert(supplier, 'supplier');
    this.supplier = supplier;
  }

  apply(observable: Observable<unknown>): Observable<unknown> {
    assert(this.supplier, 'supplier');
    return observable.pipe(this.events.tap('in'), this.supplier(), this.events.tap('out'));
  }
}
