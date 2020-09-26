import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/abstract-component';
import { assert } from "src/app/utils";
import { Pipeline } from 'src/models/pipeline';
import { PipelineEvent } from 'src/models/pipeline-event';

@Component({
  selector: 'app-observer',
  templateUrl: './observer.component.html'
})
export class ObserverComponent extends AbstractComponent {

  @Input()
  public pipeline: Pipeline;

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    assert(this.pipeline, 'pipeline');
    super.ngOnInit();
  }

  getEvents(): PipelineEvent[] {
    return this.pipeline.getObserverEvents();
  }

  getText(): string {
    return this.pipeline.getObserverText();
  }

  getDescription(): string {
    return this.pipeline.getObserverMetadata().desc;
  }

  getDescription2(): string {
    return this.pipeline.getObserverMetadata().desc2;
  }

  getPostCompleteText(): string {
    return this.pipeline.isComplete() && this.pipeline.getObserverMetadata().postCompleteText;
  }
}
