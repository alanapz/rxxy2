import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { Pipeline } from "src/models/pipeline";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from "src/models/pipeline-operator";

@Component({
  selector: 'app-dashboard-pipeline',
  templateUrl: './dashboard-pipeline.component.html',
  styleUrls: ['./dashboard-pipeline.component.css']
})
export class DashboardPipelineComponent extends AbstractComponent {

  @Input()
  public pipeline: Pipeline;

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    console.assert(!!this.pipeline, 'pipeline');
  }

  getTitle(): string {
    return this.pipeline.getSource().getTitle();
  }

  getDescription(): string {
    return this.pipeline.getSource().getDescription();
  }

  getPipeline(): Pipeline {
    return this.pipeline;
  }

  getObservable(): PipelineObservable {
    return this.pipeline.getSource();
  }

  getOperators(): PipelineOperator[] {
    return this.pipeline.getOperators();
  }

  canStartPipeline(): boolean {
    return this.pipeline.canStartPipeline();
  }

  canAdvancePipeline(): boolean {
    return this.pipeline.canAdvancePipeline();
  }

  canFastForwardPipeline(): boolean {
    return this.pipeline.canFastForwardPipeline();
  }

  canStopPipeline(): boolean {
    return this.pipeline.canStopPipeline();
  }

  canResetPipeline(): boolean {
    return this.pipeline.canResetPipeline();
  }

  startPipeline(fastForward: boolean): void {
    this.pipeline.startPipeline(fastForward);
  }

  advancePipeline(): void {
    this.pipeline.advancePipeline();
  }

  fastForwardPipeline(): void {
    this.pipeline.fastForwardPipeline();
  }

  stopPipeline(): void {
    this.pipeline.stopPipeline();
  }

  resetPipeline(): void {
    this.pipeline.resetPipeline();
  }
}
