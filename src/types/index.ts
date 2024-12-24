/**
 * Represents the names of supported runtime environments.
 *
 * @typedef {("Browser"|"Nodejs"|"Bun"|"Deno"|"Unknown")} EnvironmentName
 *
 * @description
 * - "Browser": Represents a web browser environment
 * - "Nodejs": Represents a Node.js runtime environment
 * - "Bun": Represents the Bun JavaScript runtime environment
 * - "Deno": Represents the Deno runtime environment
 */
export type EnvironmentName = "Browser" | "Nodejs" | "Bun" | "Deno" | "Unknown";

/**
 * Contains detailed information about the detected runtime environment.
 *
 * @typedef {Object} EnvironmentInfo
 * @property {EnvironmentName|"Unknown"} name - The name of the detected environment, or "Unknown" if not recognized
 * @property {string} version - The version of the detected environment
 * @property {string | undefined} [browserName] - The name of the detected browser (only available in Browser environment)
 * @example
 * const envInfo: EnvironmentInfo = {
 *   name: "Nodejs",
 *   version: "22.1.0",
 *   browserName: undefined,
 * };
 *
 */
export type EnvironmentInfo = {
  name: EnvironmentName;
  version: string;
  browserName?: string;
};

/**
 * Defines the structure for environment detection and version retrieval.
 *
 * @typedef {Object} Environment
 * @property {function(): boolean} detect - A function that returns true if the environment is detected
 * @property {EnvironmentName} name - The name of the environment
 * @property {function(): string} getVersion - A function that retrieves the version of the environment
 * @property {function(): string} [getBrowserName] - A function that retrieves the name of the browser (only available in Browser environment)
 * @example
 * const nodeEnvironment: Environment = {
 *   detect: () => typeof process !== 'undefined' && !!process.versions?.node,
 *   name: "Nodejs",
 *   getVersion: () => process.version
 * };
 */
export type Environment = {
  detect: () => boolean;
  name: EnvironmentName;
  getVersion: () => string;
  getBrowserName?: () => string;
};

/**
 * Maps environment names to their respective detection configurations.
 *
 * @typedef {Object} EnvironmentMap
 * @property {Environment} Browser - Configuration for browser detection
 * @property {Environment} Nodejs - Configuration for Node.js detection
 * @property {Environment} Bun - Configuration for Bun detection
 * @property {Environment} Deno - Configuration for Deno detection
 *
 * @example
 * const envMap: EnvironmentMap = {
 *   Browser: { detect: () => typeof window !== 'undefined', name: "Browser", getVersion: () => navigator.userAgent },
 *   Nodejs: { detect: () => typeof process !== 'undefined', name: "Nodejs", getVersion: () => process.version },
 *   Bun: { detect: () => typeof Bun !== 'undefined', name: "Bun", getVersion: () => Bun.version },
 *   Deno: { detect: () => typeof Deno !== 'undefined', name: "Deno", getVersion: () => Deno.version.deno },
 * };
 */
export type EnvironmentMap = {
  [K in Exclude<EnvironmentName, "Unknown">]: Environment;
};

/**
 * Represents a callback function that synchronously processes environment information.
 *
 * @typedef {Function} SyncEnvironmentCallback
 * @template T The return type of the callback
 * @param {EnvironmentInfo} env - The environment information object
 * @returns {NonPromise<T>} A non-Promise value of type T
 *
 * @example
 * const syncCallback: SyncEnvironmentCallback<string> = (env) => {
 *   return `Running in ${env.name} version ${env.version}`;
 * };
 */
export type SyncEnvironmentCallback<T> = (
  env: EnvironmentInfo
) => NonPromise<T>;

/**
 * Represents a callback function that asynchronously processes environment information.
 *
 * @typedef {Function} AsyncEnvironmentCallback
 * @template T The return type of the callback
 * @param {EnvironmentInfo} env - The environment information object
 * @returns {Promise<T>} A Promise that resolves to a value of type T
 *
 * @example
 * const asyncCallback: AsyncEnvironmentCallback<string> = async (env) => {
 *   await someAsyncOperation();
 *   return `Running in ${env.name} version ${env.version}`;
 * };
 */
export type AsyncEnvironmentCallback<T> = (env: EnvironmentInfo) => Promise<T>;

/**
 * Represents either a synchronous or asynchronous environment callback function.
 *
 * @typedef {SyncEnvironmentCallback<T> | AsyncEnvironmentCallback<T>} EnvironmentCallback
 * @template T The return type of the callback
 */
export type EnvironmentCallback<T> =
  | SyncEnvironmentCallback<T>
  | AsyncEnvironmentCallback<T>;

/**
 * Utility type that excludes Promise types from a given type T.
 *
 * @typedef {T extends Promise<any> ? never : T} NonPromise
 * @template T The type to check
 *
 * @example
 * type StringOrNumber = NonPromise<string | Promise<number>>; // type will be string
 */
export type NonPromise<T> = T extends Promise<any> ? never : T;
