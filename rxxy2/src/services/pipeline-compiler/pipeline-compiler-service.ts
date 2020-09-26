import { Injectable } from '@angular/core';
import * as rxjs from "rxjs";
import * as operator from "rxjs/operators";
import { Assert, assert, RxxyUtils } from "src/app/utils";
import { PipelineMetadata } from "src/models/pipeline-metadata";
import { PipelineObservable } from "src/models/pipeline-observable";
import { PipelineOperator } from "src/models/pipeline-operator";
import { PipelinePauseOperator } from "src/models/pipeline-pause-operator";
import { PipelineSubject } from "src/models/pipeline-subject";
import { PipelineSubscription } from "src/models/pipeline-subscription";
import { OperatorArgsTransform, RxCtx } from "src/models/rx-ctx";

@Injectable({
  providedIn: 'root'
})
export class PipelineCompilerService {

  compile(value: string): RxCtx {

    if (!value || !value.trim()) {
      return null;
    }

    const rxCtx: RxCtx = new RxCtx(value);

    const evalCtx: EvalContext = new EvalContext(rxCtx);

    // Ignore result from eval - we use values pushed into parse state
    evalCtx.evaluate(value);

    // Fail if we have no pipelines (no subscribe)
    if (!rxCtx.getPipelines().length) {
      throw `Nothing to do! Make sure you call subscribe() on at least one observable`;
    }

    let observerCount = 0;
    let subjectCount = 0;

    // Give default names to all un-named elements
    rxCtx.getObservables().filter(observable => !observable.getTitle()).forEach(observable => observable.setTitle(`observable_${++observerCount}`));
    rxCtx.getSubjects().filter(subject => !subject.getTitle()).forEach(subject => subject.setTitle(`subject_${++subjectCount}`));

    return rxCtx;
  }
}

class EvalContext {

  constructor(private readonly rxCtx: RxCtx) {
    assert(rxCtx, 'rxCtx');
  }

  // This really sucks
  // eval needs to have variables directly in scope (not in this)
  evaluate(value: string): void {
    assert(value, 'value');

    const rxCtx = this.rxCtx;

    // **************************************************
    // DO NOT MODIFY OF LOCAL VARIABLES - NEEDED FOR EVAL
    // **************************************************

    class Observable extends PipelineObservable
    {
      constructor(... args: any[]) {
        super(
          rxCtx,
          rxjs.Observable.name,
          'bi-broadcast-pin',
          'https://rxjs-dev.firebaseapp.com/api/index/class/Observable',
          'A representation of any set of values over any amount of time. This is the most basic building block of RxJS.',
          RxxyUtils.buildArgsText(`new ${rxjs.Observable.name}`, args));

        this.setSupplier(() => new rxjs.Observable<unknown>( ... args));
      }
    }

    // Certain functions (subject etc) need to return classes, not values
    abstract class _SubjectWrapper extends PipelineSubject
    {
      constructor(subject: Function, iconName: string, helpUrl: string, title: string, args: unknown[], source: rxjs.Subject<unknown>) {
        super(
          rxCtx,
          subject.name,
          iconName || 'bi-broadcast-pin',
          helpUrl,
          title,
          RxxyUtils.buildArgsText(`new ${subject.name}`, args));

        this.setSubject(source);
      }
    }

    class Subject extends _SubjectWrapper
    {
      constructor() {
        super(
          rxjs.Subject,
          null,
          'https://rxjs-dev.firebaseapp.com/api/index/class/Subject',
          'A Subject is a special type of Observable that allows values to be multicasted to many Observers. Subjects are like EventEmitters.',
          [],
          new rxjs.Subject<unknown>());
      }
    }

    class AsyncSubject extends _SubjectWrapper
    {
      constructor() {
        super(
          rxjs.AsyncSubject,
          null,
          'https://rxjs-dev.firebaseapp.com/api/index/class/AsyncSubject',
          'A variant of Subject that only emits a value when it completes. It will emit its latest value to all its observers on completion.',
          [],
          new rxjs.AsyncSubject<unknown>());
      }
    }

    class BehaviorSubject extends _SubjectWrapper
    {
      constructor(value: unknown) {
        super(
          rxjs.BehaviorSubject,
          null,
          'https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject',
          'A variant of Subject that requires an initial value and emits its current value whenever it is subscribed to.',
          [],
          new rxjs.BehaviorSubject<unknown>(value));
      }
    }

    class ReplaySubject extends _SubjectWrapper
    {
      constructor(... args: any[]) {
        super(
          rxjs.ReplaySubject,
          null,
          'https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject',
          'A variant of Subject that "replays" or emits old values to new subscribers. It buffers a set number of values and will emit those values immediately to any new subscribers in addition to emitting new values to existing subscribers.',
          args,
          new rxjs.ReplaySubject<unknown>(... args));
      }
    }

    const catchError = rxCtx.wrapOperator(operator.catchError, {
      iconName: 'bi-life-preserver',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/catchError',
      title: 'Catches errors on the observable to be handled by returning a new observable or throwing an error.',
      transformArgs: this.unwrapObservableFromProjection(0)
    });

    // const combineAll = operator.combineAll;
    // const combineLatest = operator.combineLatest;
    // const concat = operator.concat;
    // const concatAll = operator.concatAll;

    const concatMap = rxCtx.wrapOperator(operator.concatMap, {
      iconName: 'bi-sliders',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/concatMap',
      title: 'Projects each source value to an Observable which is merged in the output Observable, in a serialized fashion waiting for each one to complete before merging the next.',
      // Projection is 1st param
      transformArgs: this.unwrapObservableFromProjection(0)
    });

    const count = rxCtx.wrapOperator(operator.count, {
      iconName: 'bi-sliders',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/count',
      title: 'Counts the number of emissions on the source and emits that number when the source completes.'
    });

    // const defaultIfEmpty = operator.defaultIfEmpty;
    // const distinct = operator.distinct;
    // const elementAt = operator.elementAt;

    const empty = rxCtx.wrapObservable(rxjs.empty, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/index/function/empty',
      title: 'Creates an Observable that emits no items to the Observer and immediately emits a complete notification.'
    });

    // const endWith = operator.endWith;
    // const every = operator.every;
    // const expand = operator.expand;

    const filter = rxCtx.wrapOperator(operator.filter, {
      iconName: 'bi-funnel-fill',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/filter',
      title: 'Catches errors on the observable to be handled by returning a new observable or throwing an error.'
    });

    // const find = operator.find;
    // const findIndex = operator.findIndex;

    const first = rxCtx.wrapOperator(operator.first, {
      iconName: 'bi-funnel-fill',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/first',
      title: 'Emits only the first value (or the first value that meets some condition) emitted by the source Observable.'
    });

    const flatMap = rxCtx.wrapOperator(operator.flatMap, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/flatMap',
      title: 'Projects each source value to an Observable which is merged in the output Observable.',
      // Projection is 1st param
      transformArgs: this.unwrapObservableFromProjection(0)
    });

    // const from'] = rxjs.from;
    // const fromEvent'] = rxjs.fromEvent;
    // const generate'] = rxjs.generate;
    // const groupBy'] = operator.groupBy;
    // const ignoreElements'] = operator.ignoreElements;

    const interval = rxCtx.wrapObservable(rxjs.interval, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/index/function/interval',
      title: 'Creates an Observable that emits sequential numbers every specified interval of time, on a specified SchedulerLike.'
    });

    // const interval'] = rxjs.interval;
    // const isEmpty'] = operator.isEmpty;
    // const windowVar['last'] = operator.last;

    const map = rxCtx.wrapOperator(operator.map, {
      iconName: 'bi-wrench',
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/map',
      title: 'Applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable.'
    });

    // const max = operator.max;
    // const merge = operator.merge;
    // const mergeAll = operator.mergeAll;

    const mergeMap = rxCtx.wrapOperator(operator.mergeMap, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/mergeMap',
      title: 'Projects each source value to an Observable which is merged in the output Observable.',
      // Projection is 1st param
      transformArgs: this.unwrapObservableFromProjection(0)
    });

    const min = operator.min;

    const of = rxCtx.wrapObservable(rxjs.of, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/index/function/of',
      title: 'Converts the arguments to an observable sequence.'
    });

    // const onErrorResumeNext = operator.onErrorResumeNext;

    const pluck = rxCtx.wrapOperator(operator.pluck, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/pluck',
      title: 'Maps each source value (an object) to its specified nested property.'
    });

    // const reduce = operator.reduce;
    // const repeat = operator.repeat;
    // const repeatWhen = operator.repeatWhen;
    // const retry = operator.retry;
    // windowVar['retryWhen'] = operator.retryWhen;
    // windowVar['single'] = operator.single;

    const single = rxCtx.wrapOperator(operator.single, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/single',
      title: 'Returns an Observable that emits the single item emitted by the source Observable that matches a specified predicate, if that Observable emits one such item.'
    });

    // windowVar['skip'] = operator.skip;
    // windowVar['skipLast'] = operator.skipLast;
    // windowVar['skipUntil'] = operator.skipUntil;
    // windowVar['skipWhile'] = operator.skipWhile;
    // windowVar['startWith'] = operator.startWith;
    // windowVar['switchAll'] = operator.switchAll;
    // windowVar['switchMap'] = operator.switchMap;

    const take = rxCtx.wrapOperator(operator.take, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/take',
      title: 'Emits only the first count values emitted by the source Observable.',
    });

    const takeLast = rxCtx.wrapOperator(operator.takeLast, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/takeLast',
      title: 'Emits only the last count values emitted by the source Observable.'
    });

    const takeUntil = rxCtx.wrapOperator(operator.takeUntil, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/takeUntil',
      title: 'Emits the values emitted by the source Observable until a notifier Observable emits a value.',
      transformArgs: this.unwrapSimpleObservable(0)
    });

    const takeWhile = rxCtx.wrapOperator(operator.takeWhile, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/takeWhile',
      title: 'Emits values emitted by the source Observable so long as each value satisfies the given predicate, and then completes as soon as this predicate is not satisfied.'
    });

    const tap = rxCtx.wrapOperator(operator.tap, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/operators/tap',
      title: 'Perform a side effect for every emission on the source Observable, but return an Observable that is identical to the source.'
    });

    const throwError = rxCtx.wrapObservable(rxjs.throwError, {
      helpUrl: 'https://rxjs-dev.firebaseapp.com/api/index/function/throwError',
      title: 'Creates an Observable that emits no items to the Observer and immediately emits an error notification.'
    });
    // windowVar['throwError'] = rxjs.throwError;
    // windowVar['throwIfEmpty'] = operator.throwIfEmpty;
    // windowVar['toArray'] = operator.toArray;
    // windowVar['withLatestFrom'] = operator.withLatestFrom;

    // Return value ignored

    const _pause = () => new PipelinePauseOperator(rxCtx, 'pause', 'bi-pause-fill', null, null, null);

    const _getPipeline = (): PipelineObservable => {
      return rxCtx.getPipelines()[0].getSource();
    };

    const _metadata = this.configureObservable.bind(this);

    eval(value);
  }

  private configureObservable(subscription: PipelineSubscription, params: PipelineMetadata): void {
    assert(subscription instanceof PipelineSubscription, 'metadata element not of correct type');
    assert(params, 'params');

    const pipeline = assert(subscription.getPipeline(), 'can only annotate subscribed observables');
    pipeline.setMetadata(params);

    const observable: PipelineObservable = subscription.getObservable();
    if (params.title) {
      observable.setTitle(params.title);
    }
    if (params.desc) {
      observable.setDescription(params.desc)
    }
    if (params.args) {
      observable.setArgsText(params.args);
    }
    if (params.operators) {
      params.operators.forEach((op: {desc?: string}, index) => {
        const operator = observable.getOperators()[index];
        if (op.desc) {
          operator.setDescription(op.desc);
        }
      });
    }
  }

  // Simply unwraps the passed parameter, converting it from a PipelineObservable/Subject to an RxJS observable
  // EG: For use by take()
  private unwrapSimpleObservable(index: number): OperatorArgsTransform {

    return (operator: PipelineOperator, args: unknown[]): unknown[] => {
      assert(operator, 'operator');
      assert(args, 'args');

      const copyOfArgs: unknown[] = [ ... args];

      if (args[index] instanceof PipelineObservable) {
        copyOfArgs[index] = (<PipelineObservable> args[index]).build();
      }
      else if (args[index] instanceof PipelineSubject) {
        copyOfArgs[index] = (<PipelineSubject> args[index]).asObservable().build();
      }

      Assert.isObservable(copyOfArgs[index], `${operator.getArgsText}([${index}]) must be an Observable`);

      return copyOfArgs;
    };
  }

  // Some operators (eg: mergeMap) take a 'projection' parameter
  // For the call to work, the result needs to be wrapped
  // We need to rewrite calls like: mergeMap(x => of(1)) into: mergeMap(x => unwrapObservable(of(1));
  // Problem: Merge map accept a function pointer so we need to add our our own callback
  // We also need to attach our observable to operator, to track progress of inner observables
  private unwrapObservableFromProjection(index: number): OperatorArgsTransform {

    return (operator: PipelineOperator, args: unknown[]): unknown[] => {
      assert(operator, 'operator');
      assert(args, 'args');

      if ((typeof args[index]) !== 'function') {
        return args;
      }

      const copyOfArgs: unknown[] = [... args];

      copyOfArgs[index] = (... projectionArgs: unknown[]) => {

        let observable = (args[index] as Function)(... projectionArgs);

        if (observable instanceof PipelineSubject) {
          observable = observable.asObservable();
        }

        if (!(observable instanceof PipelineObservable)) {
          return RxxyUtils.throwError(`Result of map projection must be an inner observable, ${observable} is not an observable`, observable);
        }

        operator.attachInnerObservable(observable);
        return observable.build();
      };

      return copyOfArgs;
    }
  }
}
