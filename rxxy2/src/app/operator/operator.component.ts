import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractComponent } from 'src/app/abstract-component';
import { InnerObservableComponent } from "src/app/inner-observable/inner-observable.component";
import { assert } from "src/app/utils";
import { PipelineEvent } from 'src/models/pipeline-event';
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from 'src/models/pipeline-operator';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html'
})
export class OperatorComponent extends AbstractComponent {

  @Input()
  public operator: PipelineOperator;

  @Output()
  public readonly eventResumed: EventEmitter<PipelineEvent> = new EventEmitter<PipelineEvent>();

  constructor(protected injector: Injector, private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    assert(this.operator, 'operator');
    super.ngOnInit();
  }

  getIconName(): string {
    return this.operator.getIconName();
  }

  getType(): string {
    return this.operator.getType();
  }

  getText(): string {
    return this.operator.getArgsText();
  }

  getHelpUrl(): string {
    return this.operator.getHelpUrl();
  }

  getDescription(): string {
    return this.operator.getDescription();
  }

  getEvents(): PipelineEvent[] {
    return this.operator.getEvents();
  }

  getEventsSkipIncoming(): PipelineEvent[] {
    return this.operator.getEvents().filter(e => e.type !== 'in');
  }

  isTopLevelOperator(): boolean {
    return this.operator.isTopLevelElement();
  }

  showInnerObservable(observable: PipelineObservable): void {
    const modalRef = this.modalService.open(InnerObservableComponent, { size: 'lg' });
    (modalRef.componentInstance as InnerObservableComponent).observable = observable;
  }

  onEventResumed(event: PipelineEvent) {
    this.eventResumed.emit(event);
  }
}
