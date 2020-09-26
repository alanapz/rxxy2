import { Subject } from "rxjs";
import { PipelineObservable } from "src/models/pipeline-observable";

export declare type PipelineEventType = 'in' | 'out' | 'inner' | 'pause';

export interface PipelineEvent {
  type: PipelineEventType;
  isNext?: boolean;
  value?: unknown; // Only if isNext
  isError?: boolean;
  error?: any; // Only if isError
  isComplete?: boolean;
  observable?: PipelineObservable; // Only for type 'inner'
  notifier?: Subject<unknown>; // Only for type 'pause'
}
