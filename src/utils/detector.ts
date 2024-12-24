import {
  EnvironmentInfo,
  SyncEnvironmentCallback,
  AsyncEnvironmentCallback,
} from "../types";
import { environments } from "../constants/environments";

/**
 * Detects and returns information about the current runtime environment.
 * This function checks the global objects and variables to determine which environment the code is running in.
 *
 * @returns {EnvironmentInfo} An object containing:
 * - name: The name of the detected environment ('Browser', 'Nodejs', 'Bun', 'Deno', or 'Unknown')
 * - version: The version string of the detected environment
 * - browserName: The name of the detected browser (only available in Browser environment)
 *
 * @example
 * const env = getCurrentEnvironment();
 * console.log(env);
 * // Output: { name: 'Nodejs', version: 'v16.14.0', browserName: undefined }
 * not exported
 */
export function getCurrentEnvironment(): EnvironmentInfo {
  for (const env of Object.values(environments)) {
    if (env.detect()) {
      if (env.name === "Browser") {
        return {
          name: env.name,
          version: env.getVersion(),
          browserName: env.getBrowserName?.(),
        };
      }
      return {
        name: env.name,
        version: env.getVersion(),
      };
    }
  }
  return {
    name: "Unknown",
    version: "unknown",
  };
}

/**
 * the current environment information.
 * @type {EnvironmentInfo}
 *
 *
 */
export const currentEnv: EnvironmentInfo = getCurrentEnvironment();

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

export const getFunctionExecuteInEnvironmentAsync =
  (condition: boolean) =>
  async <T>(callback: AsyncEnvironmentCallback<T>): Promise<T | undefined> => {
    if (condition) {
      const result = callback(currentEnv);
      if (!(result instanceof Promise)) {
        throw new Error("callback must return a Promise");
      }

      return result ?? undefined;
    }

    return undefined;
  };

/**
 * onBrowserAsync is a function that executes a callback in the browser environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onBrowserAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onBrowserAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Browser" or undefined
 */

export const onBrowserAsync = getFunctionExecuteInEnvironmentAsync(isBrowser);

/**
 * onNodejsAsync is a function that executes a callback in the Node.js environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNodejsAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onNodejsAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Nodejs" or undefined
 */
export const onNodejsAsync = getFunctionExecuteInEnvironmentAsync(isNodejs);

/**
 * onBunAsync is a function that executes a callback in the Bun environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onBunAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onBunAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Bun" or undefined
 */
export const onBunAsync = getFunctionExecuteInEnvironmentAsync(isBun);

/**
 * onDenoAsync is a function that executes a callback in the Deno environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
* // without return value
 * onDenoAsync((env) => {
 *   console.log(env.name);
 * });
 * 
 * // with return value
 * const result = await onDenoAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Deno" or undefined
 *

 */
export const onDenoAsync = getFunctionExecuteInEnvironmentAsync(isDeno);

/**
 * onNotBrowserAsync is a function that executes a callback in the non-browser environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotBrowserAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onNotBrowserAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotBrowserAsync = getFunctionExecuteInEnvironmentAsync(
  !isBrowser && currentEnv.name !== "Unknown"
);

/**
 * onNotNodejsAsync is a function that executes a callback in the non-Node.js environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotNodejsAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onNotNodejsAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotNodejsAsync = getFunctionExecuteInEnvironmentAsync(
  !isNodejs && currentEnv.name !== "Unknown"
);

/**
 * onNotBunAsync is a function that executes a callback in the non-Bun environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotBunAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onNotBunAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotBunAsync = getFunctionExecuteInEnvironmentAsync(
  !isBun && currentEnv.name !== "Unknown"
);

/**
 * onNotDenoAsync is a function that executes a callback in the non-Deno environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotDenoAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onNotDenoAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotDenoAsync = getFunctionExecuteInEnvironmentAsync(
  !isDeno && currentEnv.name !== "Unknown"
);

/**
 * onUnknownAsync is a function that executes a callback in the unknown environment asynchronously.
 * It returns a promise that resolves to the result of the callback if the condition is true,
 * or undefined if the condition is false.
 *
 * @param {AsyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {Promise<T | undefined>} A promise that resolves to the result of the callback or undefined.
 *
 * @example
 * // without return value
 * onUnknownAsync((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = await onUnknownAsync((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Unknown" or undefined
 */
export const onUnknownAsync = getFunctionExecuteInEnvironmentAsync(
  currentEnv.name === "Unknown"
);

export const getFunctionExecuteInEnvironment =
  (condition: boolean) =>
  <T>(callback: SyncEnvironmentCallback<T>): T | undefined => {
    if (condition) {
      const result = callback(currentEnv);
      if (result instanceof Promise) {
        throw new Error("callback must be a sync function");
      }
      return result ?? undefined;
    }

    return undefined;
  };

/**
 * onBrowser is a function that executes a callback in the browser environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onBrowser((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onBrowser((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Browser" or undefined
 */
export const onBrowser = getFunctionExecuteInEnvironment(isBrowser);

/**
 * onNodejs is a function that executes a callback in the Node.js environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNodejs((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onNodejs((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Nodejs" or undefined
 */
export const onNodejs = getFunctionExecuteInEnvironment(isNodejs);

/**
 * onBun is a function that executes a callback in the Bun environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onBun((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onBun((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Bun" or undefined
 */
export const onBun = getFunctionExecuteInEnvironment(isBun);

/**
 * onDeno is a function that executes a callback in the Deno environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onDeno((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onDeno((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Deno" or undefined
 */
export const onDeno = getFunctionExecuteInEnvironment(isDeno);

/**
 * onNotBrowser is a function that executes a callback in the non-browser environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotBrowser((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onNotBrowser((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotBrowser = getFunctionExecuteInEnvironment(
  !isBrowser && currentEnv.name !== "Unknown"
);

/**
 * onNotNodejs is a function that executes a callback in the non-Node.js environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotNodejs((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onNotNodejs((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */

export const onNotNodejs = getFunctionExecuteInEnvironment(
  !isNodejs && currentEnv.name !== "Unknown"
);

/**
 * onNotBun is a function that executes a callback in the non-Bun environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotBun((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onNotBun((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotBun = getFunctionExecuteInEnvironment(
  !isBun && currentEnv.name !== "Unknown"
);

/**
 * onNotDeno is a function that executes a callback in the non-Deno environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onNotDeno((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onNotDeno((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: one of the environment names or undefined
 */
export const onNotDeno = getFunctionExecuteInEnvironment(
  !isDeno && currentEnv.name !== "Unknown"
);

/**
 * onUnknown is a function that executes a callback in the unknown environment synchronously.
 * It returns the result of the callback if the condition is true, or undefined if the condition is false.
 *
 * @param {SyncEnvironmentCallback<T>} callback - The callback to execute.
 * @returns {T | undefined} The result of the callback or undefined.
 *
 * @example
 * // without return value
 * onUnknown((env) => {
 *   console.log(env.name);
 * });
 *
 * // with return value
 * const result = onUnknown((env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Unknown" or undefined
 */
export const onUnknown = getFunctionExecuteInEnvironment(
  currentEnv.name === "Unknown"
);
