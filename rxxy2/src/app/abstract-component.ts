import { AfterViewInit, Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractComponent implements OnInit, OnDestroy, AfterViewInit {

  protected abstract injector: Injector;

  private readonly onDestroy = new Subject<unknown>();

  ngOnInit(): void {
    // Nothing to do
  }

  ngAfterViewInit(): void {
    // Nothing to do
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  takeUntilDestroyed<T>(source: Observable<T>): Observable<T> {
    return source.pipe(takeUntil(this.onDestroy));
  }
}
