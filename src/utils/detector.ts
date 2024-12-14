import {
  EnvironmentInfo,
  SyncEnvironmentCallback,
  AsyncEnvironmentCallback,
  NonPromise,
} from "../types";
import { environments } from "../constants/environments";

/**
 * Detects and returns information about the current runtime environment.
 * This function checks the global objects and variables to determine which environment the code is running in.
 *
 * @returns {EnvironmentInfo} An object containing:
 * - name: The name of the detected environment ('Browser', 'Nodejs', 'Bun', 'Deno', or 'Unknown')
 * - version: The version string of the detected environment
 * - isDetected: A boolean indicating whether the environment was successfully detected
 *
 * @example
 * const env = getCurrentEnvironment();
 * console.log(env);
 * // Output: { name: 'Nodejs', version: 'v16.14.0', isDetected: true }
 */
export function getCurrentEnvironment(): EnvironmentInfo {
  for (const env of Object.values(environments)) {
    if (env.detect()) {
      if (env.name === "Browser") {
        return {
          name: env.name,
          version: env.getVersion(),
          browserName: env.getBrowserName?.(),
          isDetected: true,
        };
      }
      return {
        name: env.name,
        version: env.getVersion(),
        isDetected: true,
      };
    }
  }
  return {
    name: "Unknown",
    version: "unknown",
    isDetected: false,
  };
}

const currentEnv = getCurrentEnvironment();

/**
 * A boolean indicating whether the current environment is a web browser.
 * This includes any environment where the 'window' and 'document' objects are available.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isBrowser) {
 *   // Browser-specific code
 *   document.querySelector('#app');
 * }
 */
export const isBrowser: boolean = currentEnv.name === "Browser";

/**
 * A boolean indicating whether the current environment is Node.js.
 * This checks for the presence of the global 'process' object with Node.js-specific properties.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isNodejs) {
 *   // Node.js-specific code
 *   const fs = require('fs');
 * }
 */
export const isNodejs: boolean = currentEnv.name === "Nodejs";

/**
 * A boolean indicating whether the current environment is Bun.
 * This checks for the presence of the global 'Bun' object.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isBun) {
 *   // Bun-specific code
 *   const file = Bun.file('./example.txt');
 * }
 */
export const isBun: boolean = currentEnv.name === "Bun";

/**
 * A boolean indicating whether the current environment is Deno.
 * This checks for the presence of the global 'Deno' object.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isDeno) {
 *   // Deno-specific code
 *   await Deno.readTextFile('./example.txt');
 * }
 */
export const isDeno: boolean = currentEnv.name === "Deno";

/**
 * A boolean indicating whether the current environment is not a web browser.
 * This includes any environment where the 'window' and 'document' objects are not available.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isNotBrowser) {
 *   // Non-browser-specific code
 *   console.log('Running in non-browser environment');
 * }
 */
export const isNotBrowser: boolean = !isBrowser;

/**
 * A boolean indicating whether the current environment is not Node.js.
 * This checks for the absence of the global 'process' object with Node.js-specific properties.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isNotNodejs) {
 *   // Non-Node.js-specific code
 *   console.log('Running in non-Node.js environment');
 * }
 */
export const isNotNodejs: boolean = !isNodejs;

/**
 * A boolean indicating whether the current environment is not Bun.
 * This checks for the absence of the global 'Bun' object.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isNotBun) {
 *   // Non-Bun-specific code
 *   console.log('Running in non-Bun environment');
 * }
 */
export const isNotBun: boolean = !isBun;

/**
 * A boolean indicating whether the current environment is not Deno.
 * This checks for the absence of the global 'Deno' object.
 *
 * @constant
 * @type {boolean}
 *
 * @example
 * if (isNotDeno) {
 *   // Non-Deno-specific code
 *   console.log('Running in non-Deno environment');
 * }
 */
export const isNotDeno: boolean = !isDeno;

/**
 * Executes a synchronous callback function only if the current environment is a web browser.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in browser environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in browser environment, undefined otherwise
 *
 * @example
 * // Without return value
 * onBrowser((env) => {
 *   console.log(`Running in browser version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onBrowser((env) => {
 *   console.log(`Running in browser version ${env.version}`);
 *   return 'browser-result';
 * });
 *
 * console.log(result); // 'browser-result'
 */
export function onBrowser<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (isBrowser) {
    return callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is a web browser.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in browser environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in browser environment, undefined otherwise
 *
 * @example
 * // Without return value
 * await onBrowserAsync(async (env) => {
 *   console.log(`Running in browser version ${env.version}`);
 * });
 *
 * // With return value
 * const result = await onBrowserAsync(async (env) => {
 *   console.log(`Running in browser version ${env.version}`);
 *   return 'browser-result';
 * });
 */
export async function onBrowserAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (isBrowser) {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is not a web browser.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in non-browser environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in non-browser environments, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onNotBrowser((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onNotBrowser((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 *   return 'non-browser-result';
 * });
 *
 * console.log(result); // 'non-browser-result'
 *
 */
export function onNotBrowser<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (!isBrowser && currentEnv.name !== "Unknown") {
    return callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is not a web browser.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in non-browser environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in non-browser environments, undefined otherwise
 *
 * @example
 * // Without return value
 * await onNotBrowserAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onNotBrowserAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   return data;
 * });
 */
export async function onNotBrowserAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (!isBrowser && currentEnv.name !== "Unknown") {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is Node.js.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in Node.js environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in Node.js environment, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onNodejs((env) => {
 *   console.log(`Running in Node.js version ${env.version}`);
 *   const fs = require('fs');
 * });
 *
 * // With return value
 * const result = onNodejs((env) => {
 *   console.log(`Running in Node.js version ${env.version}`);
 *   return 'nodejs-result';
 * });
 *
 * console.log(result); // 'nodejs-result'
 */
export function onNodejs<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (isNodejs) {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onNodejsAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is Node.js.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in Node.js environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in Node.js environment, undefined otherwise
 *
 * @example
 * // Without return value
 * await onNodejsAsync(async (env) => {
 *   const fs = require('fs').promises;
 *   const data = await fs.readFile('config.json');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onNodejsAsync(async (env) => {
 *   const fs = require('fs').promises;
 *   const data = await fs.readFile('config.json');
 *   return data;
 * });
 */
export async function onNodejsAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (isNodejs) {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is not Node.js.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in non-Node.js environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in non-Node.js environments, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onNotNodejs((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onNotNodejs((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 *   return 'non-nodejs-result';
 * });
 */
export function onNotNodejs<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (!isNodejs && currentEnv.name !== "Unknown") {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onNotNodejsAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in non-Node.js environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in non-Node.js environments, undefined otherwise
 *
 * @example
 * // Without return value
 * await onNotNodejsAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onNotNodejsAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   return data;
 * });
 *
 * console.log(result); // 'config.json'
 */
export async function onNotNodejsAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (!isNodejs && currentEnv.name !== "Unknown") {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is Bun.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in Bun environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in Bun environment, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onBun((env) => {
 *   console.log(`Running in Bun version ${env.version}`);
 *   const file = Bun.file('./example.txt');
 * });
 *
 * // With return value
 * const result = onBun((env) => {
 *   console.log(`Running in Bun version ${env.version}`);
 *   return 'bun-result';
 * });
 *
 * console.log(result); // 'bun-result'
 */
export function onBun<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (isBun) {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onBunAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is Bun.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in Bun environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in Bun environment, undefined otherwise
 *
 * @example
 * // Without return value
 * await onBunAsync(async (env) => {
 *   const file = Bun.file('./example.txt');
 *   console.log(await file.text());
 * });
 *
 * // With return value
 * const result = await onBunAsync(async (env) => {
 *   const file = Bun.file('./example.txt');
 *   return await file.text();
 * });
 *
 * console.log(result); // 'example.txt'
 */
export async function onBunAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (isBun) {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is not Bun.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in non-Bun environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in non-Bun environments, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onNotBun((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onNotBun((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 *   return 'non-bun-result';
 * });
 *
 * console.log(result); // 'non-bun-result'
 */
export function onNotBun<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (!isBun && currentEnv.name !== "Unknown") {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onNotBunAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is not Bun.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in non-Bun environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in non-Bun environments, undefined otherwise
 *
 * @example
 * // Without return value
 * await onNotBunAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onNotBunAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   return data;
 * });
 *
 * console.log(result); // 'config.json'
 */
export async function onNotBunAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (!isBun && currentEnv.name !== "Unknown") {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is Deno.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in Deno environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in Deno environment, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onDeno((env) => {
 *   console.log(`Running in Deno version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onDeno((env) => {
 *   console.log(`Running in Deno version ${env.version}`);
 *   return 'deno-result';
 * });
 *
 * console.log(result); // 'deno-result'
 */
export function onDeno<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (isDeno) {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onDenoAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is Deno.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in Deno environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in Deno environment, undefined otherwise
 *
 * @example
 * // Without return value
 * await onDenoAsync(async (env) => {
 *   const data = await Deno.readTextFile('./example.txt');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onDenoAsync(async (env) => {
 *   const data = await Deno.readTextFile('./example.txt');
 *   return data;
 * });
 *
 * console.log(result); // 'example.txt'
 */
export async function onDenoAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (isDeno) {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is not Deno.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in non-Deno environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in non-Deno environments, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onNotDeno((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 * });
 *
 * // With return value
 * const result = onNotDeno((env) => {
 *   console.log(`Running in ${env.name} version ${env.version}`);
 *   return 'non-deno-result';
 * });
 *
 * console.log(result); // 'non-deno-result'
 */
export function onNotDeno<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (!isDeno && currentEnv.name !== "Unknown") {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onNotDenoAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is not Deno.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in non-Deno environments
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in non-Deno environments, undefined otherwise
 *
 * @example
 * // Without return value
 * await onNotDenoAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   console.log(data);
 * });
 *
 * // With return value
 * const result = await onNotDenoAsync(async (env) => {
 *   const data = await readFile('config.json');
 *   return data;
 * });
 */
export async function onNotDenoAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (!isDeno && currentEnv.name !== "Unknown") {
    return await callback(currentEnv);
  }

  return undefined;
}

/**
 * Executes a synchronous callback function only if the current environment is unknown.
 * This is useful for handling edge cases where the environment detection fails.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The synchronous function to execute in unknown environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {NonPromise<T> | undefined} The result of the callback if executed in unknown environment, undefined otherwise
 * @throws {Error} If callback returns a Promise
 *
 * @example
 * // Without return value
 * onUnknown((env) => {
 *   console.log(`Running in unknown environment`);
 *   // Handle unknown environment case
 * });
 *
 * // With return value
 * const result = onUnknown((env) => {
 *   console.log(`Running in unknown environment`);
 *   return 'fallback-behavior';
 * });
 */
export function onUnknown<T>(
  callback: SyncEnvironmentCallback<T>
): NonPromise<T> | undefined {
  if (currentEnv.name === "Unknown") {
    const result = callback(currentEnv);

    if (result instanceof Promise) {
      throw new Error(
        "Synchronous function expected, but got Promise. Use onUnknownAsync instead."
      );
    }

    return result;
  }

  return undefined;
}

/**
 * Executes an asynchronous callback function only if the current environment is unknown.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The async function to execute in unknown environment
 * @param {EnvironmentInfo} callback.env - The current environment information
 * @returns {Promise<T | undefined>} A promise that resolves with the callback result if executed in unknown environment, undefined otherwise
 *
 * @example
 * // Without return value
 * await onUnknownAsync(async (env) => {
 *   console.log(`Running in unknown environment`);
 *   await someAsyncOperation();
 * });
 *
 * // With return value
 * const result = await onUnknownAsync(async (env) => {
 *   console.log(`Running in unknown environment`);
 *   return 'unknown-result';
 * });
 */
export async function onUnknownAsync<T>(
  callback: AsyncEnvironmentCallback<T>
): Promise<T | undefined> {
  if (currentEnv.name === "Unknown") {
    return await callback(currentEnv);
  }

  return undefined;
}
