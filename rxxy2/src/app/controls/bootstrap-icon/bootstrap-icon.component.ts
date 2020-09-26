import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";

@Component({
  selector: 'app-bootstrap-icon',
  templateUrl: './bootstrap-icon.component.html'
})
export class BootstrapIconComponent extends AbstractComponent {

  @Input()
  public iconName: string;

  @Input()
  public iconSize: string = '1em';

  constructor(protected injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    console.assert(!!this.iconName, 'iconName');
    console.assert(!!this.iconSize, 'iconSize');
  }
}
