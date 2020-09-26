export interface PipelineMetadata {
  title?: string;
  desc?: string;
  args?: string;
  operators?: OperatorMetadata[],
  observer?: ObserverMetadata
}

export interface OperatorMetadata {
  desc?: string;
  desc2?: string;
}

export interface ObserverMetadata {
  desc?: string;
  desc2?: string;
  postCompleteText?: string;
}
