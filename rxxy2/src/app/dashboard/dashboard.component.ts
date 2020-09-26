import { Component, Injector } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { assert } from "src/app/utils";
import { Pipeline } from "src/models/pipeline";
import { PipelineSubject } from "src/models/pipeline-subject";
import { RxCtx } from "src/models/rx-ctx";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends AbstractComponent {

  private rxCtx: RxCtx;

  private subjects: PipelineSubject[] = [];

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSourceCompiled(rxCtx: RxCtx): void {
    assert(rxCtx, 'rxCts');
    this.rxCtx = rxCtx;
    this.subjects = [ ... this.rxCtx.getSubjects()];
  }

  getPipelines(): Pipeline[] {
    return (this.rxCtx ? this.rxCtx.getPipelines() : []);
  }

  getSubjects(): PipelineSubject[] {
    return this.subjects;
  }
}
