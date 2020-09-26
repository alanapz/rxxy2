import { Component, Injector, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractComponent } from "src/app/abstract-component";
import { PipelineEvent } from "src/models/pipeline-event";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from "src/models/pipeline-operator";

@Component({
  selector: 'app-inner-observable',
  templateUrl: './inner-observable.component.html',
  styleUrls: ['./inner-observable.component.css']
})
export class InnerObservableComponent extends AbstractComponent {

  @Input()
  public observable: PipelineObservable;

  constructor(protected injector: Injector, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    console.assert(!!this.observable, 'observable');
  }

  getObservable(): PipelineObservable {
    return this.observable;
  }

  getOperators(): PipelineOperator[] {
    return this.observable.getOperators();
  }

  onEventResumed(event: PipelineEvent) {
    this.activeModal.close();
  }
}
