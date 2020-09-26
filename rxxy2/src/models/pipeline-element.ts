import { Observable } from "rxjs";
import { assert } from "src/app/utils";
import { PipelineEvent } from "src/models/pipeline-event";
import { PipelineEventList } from "src/models/pipeline-event-list";
import { RxCtx } from "src/models/rx-ctx";

export abstract class PipelineElement {

  protected title: string;

  protected description: string;

  protected readonly index = ++PipelineElement.counter;

  protected readonly events: PipelineEventList = new PipelineEventList();

  private static counter = 0;

  constructor(
    protected readonly rxCtx: RxCtx,
    protected readonly type: string,
    protected readonly iconName: string,
    protected readonly helpUrl: string,
    protected readonly helpTitle: string,
    protected argsText: string) {

    assert(rxCtx, 'rxCtx');
    assert(type, 'type');
    assert(iconName, 'iconName');

    this.onInit();
  }

  abstract onInit(): void;

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  onEvent(): Observable<PipelineEvent> {
    return this.events.onNewEvent();
  }

  getType(): string {
    return this.type;
  }

  getIconName(): string {
    return this.iconName;
  }

  getHelpUrl(): string {
    return this.helpUrl;
  }

  getHelpTitle(): string {
    return this.helpTitle;
  }

  getArgsText(): string {
    return this.argsText;
  }

  setArgsText(argsText: string): void {
    this.argsText = argsText;
  }

  getEvents(): PipelineEvent[] {
    return this.events.getEvents();
  }

  toString(): string {
    return this.getArgsText();
  }

  abstract isTopLevelElement(): boolean;

  abstract pipelineStarted(): void;

  abstract pipelineStopped(): void;

  abstract pipelineReset(): void;
}
