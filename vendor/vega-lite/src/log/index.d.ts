/**
 * Vega-Lite's singleton logger utility.
 */
import { LoggerInterface } from 'vega-util';
import * as message_ from './message';
export declare const message: typeof message_;
/**
 * Logger tool for checking if the code throws correct warning.
 */
export declare class LocalLogger implements LoggerInterface {
    warns: any[];
    infos: any[];
    debugs: any[];
    level(): this;
    warn(...args: readonly any[]): this;
    info(...args: readonly any[]): this;
    debug(...args: readonly any[]): this;
    error(...args: readonly any[]): this;
}
export declare function wrap(f: (logger: LocalLogger) => void): () => void;
/**
 * Set the singleton logger to be a custom logger.
 */
export declare function set(newLogger: LoggerInterface): LoggerInterface;
/**
 * Reset the main logger to use the default Vega Logger.
 */
export declare function reset(): LoggerInterface;
export declare function warn(...args: readonly any[]): void;
export declare function info(...args: readonly any[]): void;
export declare function debug(...args: readonly any[]): void;
//# sourceMappingURL=index.d.ts.map