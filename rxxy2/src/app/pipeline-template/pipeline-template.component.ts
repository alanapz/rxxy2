import { Component, Injector, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractComponent } from "src/app/abstract-component";
import { assert } from "src/app/utils";
import { PipelineTemplate } from "src/models/pipeline-template";
import { PipelineTemplateService } from "src/services/pipeline-templates/pipeline-template-service";

@Component({
  selector: 'app-pipeline-template',
  templateUrl: './pipeline-template.component.html'
})
export class PipelineTemplateComponent extends AbstractComponent {

  @Input()
  public existing: PipelineTemplate;

  constructor(
    protected readonly injector: Injector,
    public readonly activeModal: NgbActiveModal,
    public readonly templateService: PipelineTemplateService) {
    super();
  }

  getTemplates(): PipelineTemplate[] {
    return this.templateService.getTemplates();
  }

  getTemplateDifficulty(template: PipelineTemplate): unknown[] {
    return new Array(template.difficulty);
  }

  getActivePanelId(): string {
    return ''; //(this.pipelineOperator.isConfigured() ? `panel-operator-${this.pipelineOperator.getSlug()}` : '');
  }



  selectTemplate(template: PipelineTemplate): void {
    assert(template, 'template');
    this.activeModal.close(template);
  }
}
