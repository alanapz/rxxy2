import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/abstract-component';
import { PipelineEvent } from 'src/models/pipeline-event';
import { PipelineObservable } from "src/models/pipeline-observable";

@Component({
  selector: 'app-pipeline-source',
  templateUrl: './pipeline-source.component.html'
})
export class PipelineSourceComponent extends AbstractComponent {

  @Input()
  public observable: PipelineObservable;

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    console.assert(!!this.observable, 'observable');
    super.ngOnInit();
  }

  getType(): string {
    return this.observable.getType();
  }

  getDescription(): string {
    return this.observable.getSupplierDescription();
  }

  getText(): string {
    return this.observable.getArgsText();
  }

  getHelpUrl(): string {
    return this.observable.getHelpUrl();
  }

  getEvents(): PipelineEvent[] {
    return this.observable.getEvents();
  }

  isTopLevelObservable(): boolean {
    return this.observable.isTopLevelElement();
  }
}
