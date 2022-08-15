import type { DiffOne } from "../../src";

export type RefValue<TValue> = { k: string; v: TValue; __isRef: true };

export type ExtractRawValue<TValue> = TValue extends RefValue<infer RefValue>
  ? RefValue
  : TValue;

export type AutoRefValue<TValue> = RefValue<ExtractRawValue<TValue>>;

export type MaybeRefValue<TValue> = TValue | AutoRefValue<TValue>;

export const has = (o: unknown, k: string | number | symbol): boolean =>
  Object.prototype.hasOwnProperty.call(o, k);

export const plainObjectKeys = Object.keys as <T>(
  o: T
) => Array<Extract<keyof T, string>>;

export function isObj<T = Record<string, unknown>>(e: unknown): e is T {
  return typeof e === "object" && e !== null;
}

export const isDiffOne = isObj as <T>(e: unknown) => e is DiffOne<T>;

export function isRef<TValue = unknown>(e: unknown): e is RefValue<TValue> {
  return Boolean(isObj(e) && e.__isRef);
}

export function makeRef<TValue>(v: TValue): RefValue<TValue> {
  return { k: genId(), v, __isRef: true };
}

export function makeAutoRef<TValue>(v: TValue): AutoRefValue<TValue> {
  return isRef<ExtractRawValue<TValue>>(v)
    ? v
    : makeRef(v as ExtractRawValue<TValue>);
}

export function genId(): string {
  return Date.now().toString().slice(6) + Math.random().toString().slice(2, 8);
}

import randomColor from "randomcolor";

export type LoggerDebugLevel = boolean | "log" | "warn" | "error";

export class Logger {
  private color = randomColor({ luminosity: "dark" });

  public constructor(
    public kind = "NetlessApp",
    public debug: LoggerDebugLevel = import.meta.env.DEV || "error"
  ) {}

  public log(...messages: unknown[]): void {
    if (this.debug === true || this.debug === "log") {
      return this._log("log", messages);
    }
  }

  public warn(...messages: unknown[]): void {
    if (this.debug && this.debug !== "error") {
      return this._log("warn", messages);
    }
  }

  public error(...messages: unknown[]): void {
    if (this.debug) {
      return this._log("error", messages);
    }
  }

  private _log(type: "log" | "warn" | "error", messages: unknown[]): void {
    console[type](
      `%c[${this.kind}]:`,
      `color: ${this.color}; font-weight: bold;`,
      ...messages
    );
  }
}
