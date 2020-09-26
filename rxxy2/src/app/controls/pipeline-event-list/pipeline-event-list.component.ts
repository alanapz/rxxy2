import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractComponent } from "src/app/abstract-component";
import { InnerObservableComponent } from "src/app/inner-observable/inner-observable.component";
import { assert, RxxyUtils } from "src/app/utils";
import { PipelineEvent } from "src/models/pipeline-event";

@Component({
  selector: 'app-pipeline-event-list',
  templateUrl: './pipeline-event-list.component.html'
})
export class PipelineEventListComponent extends AbstractComponent {

  @Input()
  public events: PipelineEvent[];

  @Input()
  public subject: boolean = false;

  @Output()
  public readonly eventResumed: EventEmitter<PipelineEvent> = new EventEmitter<PipelineEvent>();

  constructor(protected injector: Injector, private modalService: NgbModal) {
    super();
  }

  isSubject(): boolean {
    return this.subject;
  }

  ngOnInit(): void {
    super.ngOnInit();
    assert(this.events, 'events');
  }

  getEvents(): PipelineEvent[] {
    return this.events;
  }

  showInnerObservable(event: PipelineEvent): void {
    assert(event && event.observable, 'event');
    const modalRef = this.modalService.open(InnerObservableComponent, { size: 'lg' });
    modalRef.componentInstance.observable = event.observable;
  }

  resumeEvent(event: PipelineEvent): void {
    const notifier = assert(event.notifier, 'notifier');
    notifier.next(null);
    notifier.complete();

    // Remove pause event from list
    this.events.splice(this.events.indexOf(event), 1);

    console.log(event);
    this.eventResumed.emit(event);
  }

  formatValue(value: any): string {
    return RxxyUtils.buildArgText(value);
  }
}
