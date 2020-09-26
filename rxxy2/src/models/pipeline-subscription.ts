import { assert } from "src/app/utils";
import { Pipeline } from "src/models/pipeline";
import { PipelineObservable } from "src/models/pipeline-observable";

export class PipelineSubscription {

  constructor(
    private readonly observable: PipelineObservable,
    private readonly pipeline: Pipeline) {
    assert(observable, 'observable');
    assert(pipeline, 'pipeline');
  }

  getObservable(): PipelineObservable {
    return this.observable;
  }

  getPipeline(): Pipeline {
    return this.pipeline;
  }

  unsubscribe(): never {
    throw `unsubscribe() not supported`;
  }
}
