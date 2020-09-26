import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapIconComponent } from "src/app/controls/bootstrap-icon/bootstrap-icon.component";
import { PipelineEventListComponent } from "src/app/controls/pipeline-event-list/pipeline-event-list.component";
import { DashboardPipelineComponent } from "src/app/dashboard-pipeline/dashboard-pipeline.component";
import { DashboardSubjectComponent } from "src/app/dashboard-subject/dashboard-subject.component";
import { DashboardComponent } from "src/app/dashboard/dashboard.component";
import { InnerObservableComponent } from "src/app/inner-observable/inner-observable.component";
import { ObserverComponent } from "src/app/observer/observer.component";
import { OperatorComponent } from "src/app/operator/operator.component";
import { PipelineBuilderComponent } from "src/app/pipeline-builder/pipeline-builder.component";
import { PipelineSourceComponent } from "src/app/pipeline-source/pipeline-source.component";
import { PipelineTemplateComponent } from "src/app/pipeline-template/pipeline-template.component";
import { PipelineCompilerService } from "src/services/pipeline-compiler/pipeline-compiler-service";
import { PipelineTemplateService } from "src/services/pipeline-templates/pipeline-template-service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PipelineBuilderComponent,
    PipelineTemplateComponent,
    DashboardPipelineComponent,
    PipelineSourceComponent,
    OperatorComponent,
    ObserverComponent,
    PipelineEventListComponent,
    InnerObservableComponent,
    DashboardSubjectComponent,
    BootstrapIconComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    DragDropModule,
    CodemirrorModule
  ],
  entryComponents: [InnerObservableComponent],
  providers: [PipelineCompilerService, PipelineTemplateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
