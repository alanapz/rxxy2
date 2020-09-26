import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { assert } from "src/app/utils";
import { PipelineEvent } from "src/models/pipeline-event";
import { PipelineSubject } from "src/models/pipeline-subject";

@Component({
  selector: 'app-dashboard-subject',
  templateUrl: './dashboard-subject.component.html',
  styleUrls: ['./dashboard-subject.component.css']
})
export class DashboardSubjectComponent extends AbstractComponent {

  @Input()
  public subject: PipelineSubject;

  public nextValue: string;

  public errorValue: string;

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    assert(this.subject, 'subject');
  }

  getTitle(): string {
    return this.subject.getTitle();
  }

  getType(): string {
    return this.subject.getType();
  }

  getArgsText(): string {
    return this.subject.getArgsText();
  }

  getEvents(): PipelineEvent[] {
    return this.subject.getEvents();
  }

  next(): void {
    this.subject.next(this.nextValue);
  }

  error(): void {
    this.subject.error(this.errorValue);
  }

  complete(): void {
    this.subject.complete();
  }
}
