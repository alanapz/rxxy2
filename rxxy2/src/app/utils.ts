import { isObservable, Observable, PartialObserver, Subject } from "rxjs";
import { isFunction } from "rxjs/internal-compatibility";

declare type NextSignature = ((value: unknown) => void);
declare type ErrorSignature = (err: any) => void;
declare type CompleteSignature = () => void;

export function assert<T>(value: T, message: string, ... args: unknown[]): T {
  if (!value) {
    console.error(message, value, ... args);
    throw message;
  }
  return value;
}

export class Assert {

  public static isTruthy<T>(value: T, paramName?: string): T {
    if (!value) {
      console.error(`${paramName || 'value'} required`, value);
      throw `${paramName || 'value'} required: ${value}`;
    }
    return value;
  }

  public static isFunction<T extends Function>(value: T, paramName?: string): T {
    if (!value || (typeof value) !== 'function') {
      console.error(`${paramName || 'value'} is not a function`, value);
      throw `${paramName || 'value'} is not a function: ${value}`;
    }
    return value;
  }

  public static isObservable<U, T extends Observable<U>>(value: unknown, paramName?: string): T {
    if (!value || !isObservable(value)) {
      console.error(`${paramName || 'value'} is not an Observable`, value);
      throw `${paramName || 'value'} is not an Observable: ${value}`;
    }
    return <T> value;
  }

  public static isSubject<U, T extends Subject<U>>(value: T, paramName?: string): T {
    if (!value || !(value instanceof Subject)) {
      console.error(`${paramName || 'subject'} not a subject`, value);
      throw `${paramName || 'subject'} is not a subject: ${value}`;
    }
    return value;
  }

  public static instanceOf(value: any, type: Function, message?: string): void {
    if (!(value instanceof type)) {
      throw `${message || value || 'value'} is not an instance of: ${type.name}`;
    }
  }
}

export class RxxyUtils {

  public static throwError(message: string, ... args: any[]): never {
    console.error(message, args);
    // debugger;
    throw message;
  }

  public static isSubject<T>(value: any): value is Subject<T> {
    return !!value && isObservable(value) && value instanceof Subject;
  }

  public static checkSubject<T>(value: any): Subject<T> {
    if (!RxxyUtils.isSubject(value)) {
      throw `value is not a subject: ${value}`;
    }
    return value as Subject<T>;
  }

  public static buildArgsText(name: string, args: unknown[]): string {
    return `${name}(${args.map(a => RxxyUtils.buildArgText(a)).join(',')})`;
  }

  public static buildArgText(arg: any): string {
    if ((typeof arg) === 'string') {
      return `'${arg}'`;
    }
    if ((typeof arg) === 'number' || (typeof arg) === 'bigint' || (typeof arg) === 'boolean') {
      return `${arg}`;
    }
    if ((typeof arg) === 'undefined') {
      return 'undefined';
    }
    if ((typeof arg) === 'function') {
      return arg.toString();
    }
    if ((typeof arg) === 'string') {
      return `'${arg}'`;
    }
    if (Array.isArray(arg)) {
      return `[${arg.map(arg => RxxyUtils.buildArgText(arg)).join(',')}]`;
    }
    if ((typeof arg) === 'object' && Object.getPrototypeOf(arg) == Object.getPrototypeOf({})) {
      return `{\r\n\t${Object.getOwnPropertyNames(arg).map(p => `${p}: ${RxxyUtils.buildArgText(arg[p])}`).join(',\r\n\t').trim()}\r\n}`;
    }
    if (arg && arg.toString) {
      return arg.toString();
    }
    return "";
  }

  public static wrapObserver( ... args: unknown[]): PartialObserver<unknown> {

    let observer: PartialObserver<unknown> = { next: null, error: null, complete: null };

    // Flippin RXJS and their flipping overrides
    // We can be called in 3 different ways!

    // subscribe()
    if (args.length == 0) {
      // No arguments, use defaults for everything
    }
    // subscribe(next)
    else if (args.length == 1 && isFunction(args[0])) {
      observer.next = (args[0] as NextSignature);
    }
    // subscribe(PartialObserver)
    else if (args.length == 1) {
      observer = (args[0] as PartialObserver<unknown>);
    }
    // subscribe(next, error)
    else if (args.length == 2 && isFunction(args[0]) && isFunction(args[1])) {
      observer.next = (args[0] as NextSignature);
      observer.error = (args[1] as ErrorSignature);
    }
    // subscribe(next, error, complete)
    else if (args.length == 3 && isFunction(args[0]) && isFunction(args[1]) && isFunction(args[2])) {
      observer.next = (args[0] as NextSignature);
      observer.error = (args[1] as ErrorSignature);
      observer.complete = (args[2] as CompleteSignature);
    }
    else {
      return null;
    }

    return {
      next: (observer && observer.next || ((val: unknown) => {})),
      error: (observer && observer.error || ((err: unknown) => {})),
      complete: (observer && observer.complete || (() => {}))
    };
  }
}
