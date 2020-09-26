import { assert, RxxyUtils } from "src/app/utils";
import { Pipeline } from "src/models/pipeline";
import { PipelineNativeOperator } from "src/models/pipeline-native-operator";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from "src/models/pipeline-operator";
import { PipelineSubject } from "src/models/pipeline-subject";

export declare type ObservableArgsTransform = (observable: PipelineObservable, args: unknown[]) => unknown[];

export declare type OperatorArgsTransform = (operator: PipelineOperator, args: unknown[]) => unknown[];

export class RxCtx {

  private observables: PipelineObservable[] = [];

  private subjects: PipelineSubject[] = [];

  private pipelines: Pipeline[] = [];

  constructor(private readonly argsText: string) {
    assert(argsText, 'argsText');
  }

  getObservables(): PipelineObservable[] {
    return this.observables;
  }

  addObservable(observable: PipelineObservable): void {
    assert(observable, 'observable');
    if (this.observables.indexOf(observable) === -1) {
      this.observables.push(observable);
    }
  }

  getSubjects(): PipelineSubject[] {
    return this.subjects;
  }

  addSubject(subject: PipelineSubject): void {
    assert(subject, 'subject');
    if (this.subjects.indexOf(subject) === -1) {
      this.subjects.push(subject);
    }
  }

  getPipelines(): Pipeline[] {
    return this.pipelines;
  }

  addPipeline(pipeline: Pipeline): void {
    assert(pipeline, 'pipeline');
    if (this.pipelines.indexOf(pipeline) === -1) {
      this.pipelines.push(pipeline);
    }
  }

  wrapObservable(observable: Function, params: {helpUrl: string, title: string, transformArgs?: ObservableArgsTransform}): (... args: unknown[]) => PipelineObservable {
    assert(observable, 'observable');
    assert(params.helpUrl, 'helpUrl');
    assert(params.title, 'title');

    return (...args: unknown[]): PipelineObservable => {

      const result = new PipelineObservable(
        this,
        observable.name,
        'bi-broadcast',
        params.helpUrl,
        params.title,
        RxxyUtils.buildArgsText(observable.name, args));

      const rewrittenArgs = (params.transformArgs ? params.transformArgs(result, args) : args);
      result.setSupplier(() => observable.call(observable, ... rewrittenArgs));

      return result;
    };
  }

  wrapOperator(operator: Function, params: {iconName?: string, helpUrl?: string, title?: string, transformArgs?: OperatorArgsTransform}): (... args: unknown[]) => PipelineOperator {
    assert(operator, 'operator');

    return (... args: unknown[]): PipelineOperator => {

      const result: PipelineNativeOperator = new PipelineNativeOperator(
        this,
        operator.name,
        params.iconName || 'bi-sliders',
        params.helpUrl,
        params.title,
        RxxyUtils.buildArgsText(operator.name, args));

      const rewrittenArgs = (params.transformArgs ? params.transformArgs(result, args) : args);
      result.setSupplier(() => operator.call(operator, ... rewrittenArgs));

      return result;
    };
  }
}
