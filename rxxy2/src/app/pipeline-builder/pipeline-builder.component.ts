import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { CodemirrorComponent } from "@ctrl/ngx-codemirror";
import { NgbAccordion, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { from } from "rxjs";
import { AbstractComponent } from "src/app/abstract-component";
import { PipelineTemplateComponent } from "src/app/pipeline-template/pipeline-template.component";
import { assert } from "src/app/utils";
import { PipelineTemplate } from "src/models/pipeline-template";
import { RxCtx } from "src/models/rx-ctx";
import { PipelineCompilerService } from "src/services/pipeline-compiler/pipeline-compiler-service";
import { PipelineTemplateService } from "src/services/pipeline-templates/pipeline-template-service";

@Component({
  selector: 'app-pipeline-builder',
  templateUrl: './pipeline-builder.component.html'
})
export class PipelineBuilderComponent extends AbstractComponent {

  @ViewChild('panelAccordion')
  public accordionComponent: NgbAccordion;

  @ViewChild('codeMirror')
  public codeMirror: CodemirrorComponent;

  @Output()
  public sourceCompiled: EventEmitter<RxCtx> = new EventEmitter<RxCtx>();

  public value: string = `
// Taper votre code source ici
// Ou clicker "Load Template" pour charger un modèle
  
// Exemple d'un pipeline custom avec filtre + observer :

var _exObs = (new Observable(s => {
    s.next('hello');
    s.next('brave');
    s.next('world ...');
    s.complete();
})).pipe(filter(val => val !== 'brave')).subscribe({
    next: val => alert(val),
    complete: () => alert('fin!') });

// Exemple d'un pipeline avec erreur :

var _exErr = of('hello','world').pipe(map((val, index) => {
    if (index == 1) { throw 'error!'; }
    return val;
})).subscribe();

// Exemple d'un innner pipeline (mergeMap) :

var _exMm = of(1,2,3).pipe(mergeMap(val => of(val).pipe(
    map(innerVal => innerVal * 2), // Operator applied to inner observable
    _pause()))).subscribe();
  
// Exemple d'un pipeline avec subject :

var subject$ = new Subject();

var _exSubject = subject$.pipe(tap(val => { alert(\`From subject: \${val}\`); })).subscribe(); // On affiche un message chaque fois on click "Next" sur le subject

var _exSubject2 = interval(1000).pipe(takeUntil(subject$)).subscribe(); 

// RXXY internal plumbing - do not modify after this line //

_metadata(_exObs, {
    title: 'custom observable w/observer',
    desc: 'Pipeline avec un inner observable - clicker sur le bouton \\'Inner Observable\\' pour afficher les résultats de l\\'inner observable.<br /><br />Les résultats de map() sera bloqués jusqu\\'a tu click sur le bouton dans l\\'inner observable.'});

_metadata(_exErr, {
    title: 'observable w/error',
    desc: 'Pipeline qui se termine en error après la deuxième valeur.<br/><br/><ul><li>On aura la première valeur (\\'hello\\')</li><li>Ensuite \\'error\\'</li><li>Mais on n\\'aura jamais \\'world\\' ni complete</li></ul>',
    operators: [{
        desc: 'Cette fonction est appelée pour chaque valeur.<br /><br />Si l\\'index est 1 (du coup on est en train de traiter la 2ieme valeur dans la liste) on balance un erreur; sinon on renvoie la valeur telle qu\\'elle est.'
    }],
    observer: {
        postCompleteText: 'A la fin de l\\'exécution, on ne verra que \\'hello\\' et \\'erreur\\' - on ne verra pas Complete (un pipeline en erreur n\\'envoie jamais complete).'
    }});

_metadata(_exMm, {
    title: 'observable w/inner + pause',
    desc: 'Pipeline avec un inner observable - clicker sur le bouton \\'Inner Observable\\' pour afficher les résultats de l\\'inner observable.<br /><br />Les résultats de map() sera bloqués jusqu\\'a tu click sur le bouton dans l\\'inner observable.'});

_metadata(_exSubject, {
    title: 'observable w/error',
    desc: 'Pipeline qui se termine en error après la deuxième valeur - on n\\'aura pas de complete.'});

_metadata(_exSubject, {
    title: 'observable from Subject',
    desc: 'Pipeline qui déclenche des évènements en écoutant le ReplaySubject juste à coté.<br /><br />Clicker sur le bouton \\'Next\\' pour envoyer une valeur à ton Subject qui sera du coup envoyée à ce pipeline.'
});
`.trim();

  public errorMessage: string;

  private template?: PipelineTemplate;

  private compileResult: RxCtx;

  constructor(
    protected readonly injector: Injector,
    private readonly pipelineCompiler: PipelineCompilerService,
    private readonly pipelineTemplate: PipelineTemplateService,
    private readonly modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyValueChanged();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.codeMirror.codeMirror.setSize(null, '500px');
    this.codeMirror.codeMirror.scrollTo(0, 0);
  }

  canSubmitValue(): boolean {
    return !this.errorMessage && !!this.compileResult;
  }

  submitValue(): void {
    assert(this.canSubmitValue(), 'canSubmitValue not available');
    if (this.compileResult) {
      this.sourceCompiled.emit(this.compileResult);
      this.accordionComponent.collapseAll();
    }
  }

  notifyValueChanged(): void {
    this.compileResult = null;
    this.errorMessage = null;
    if (!this.value) {
      return;
    }
    try {
      this.compileResult = this.pipelineCompiler.compile(this.pipelineTemplate.generateSource(this.value, this.template));
    }
    catch (e) {
      this.errorMessage = e.toString();
    }
  }

  applyTemplate(): void {
    const modalRef = this.modalService.open(PipelineTemplateComponent, { size: 'lg' });
    (modalRef.componentInstance as PipelineTemplateComponent).existing = this.template;

    from(modalRef.result).subscribe((val?: PipelineTemplate) => {
      if (val) {
        this.template = val;
        this.value = this.template.source.trim();
        this.notifyValueChanged();
      }
    });
  }
}
