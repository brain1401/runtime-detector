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
 * ```typescript
 * const env = getCurrentEnvironment();
 * console.log(env);
 * // Output: { name: 'Nodejs', version: 'v16.14.0', browserName: undefined }
 * ```
 * 
 * @public This function is available for direct use but typically not needed as other utilities use it internally
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
 * The current environment information detected at module initialization.
 * This constant is determined once when the module is loaded and provides
 * immediate access to the runtime environment details.
 * 
 * @constant {EnvironmentInfo}
 * 
 * @example
 * ```typescript
 * import { currentEnv } from 'runtime-detector';
 * 
 * console.log(`Running in ${currentEnv.name} v${currentEnv.version}`);
 * if (currentEnv.browserName) {
 *   console.log(`Browser: ${currentEnv.browserName}`);
 * }
 * ```
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

/**
 * Creates a higher-order function for conditional asynchronous execution based on environment conditions.
 * This factory function returns an async executor that only runs the provided callback if the condition is met.
 *
 * @param {boolean} condition - The condition that determines whether the callback should execute
 * @returns {Function} An async function that conditionally executes the provided callback
 * 
 * @template T The return type of the callback function
 * @param {AsyncEnvironmentCallback<T>} callback - The async callback to execute conditionally
 * @returns {Promise<T | undefined>} A promise that resolves to the callback result or undefined
 * 
 * @throws {Error} Throws an error if the callback does not return a Promise
 * 
 * @example
 * ```typescript
 * const executeInBrowser = getFunctionExecuteInEnvironmentAsync(isBrowser);
 * 
 * const result = await executeInBrowser(async (env) => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 * ```
 * 
 * @internal This is a factory function used internally to create environment-specific executors
 */
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

export const inBrowserAsync = getFunctionExecuteInEnvironmentAsync(isBrowser);

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
export const inNodejsAsync = getFunctionExecuteInEnvironmentAsync(isNodejs);

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
export const inBunAsync = getFunctionExecuteInEnvironmentAsync(isBun);

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
 * inDenoAsync(async (env) => {
 *   console.log(env.name);
 * });
 * 
 * // with return value
 * const result = await inDenoAsync(async (env) => {
 *   return env.name;
 * });
 * console.log(result); // Output: "Deno" or undefined
 */
export const inDenoAsync = getFunctionExecuteInEnvironmentAsync(isDeno);

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

/**
 * Creates a higher-order function for conditional synchronous execution based on environment conditions.
 * This factory function returns a sync executor that only runs the provided callback if the condition is met.
 *
 * @param {boolean} condition - The condition that determines whether the callback should execute
 * @returns {Function} A function that conditionally executes the provided callback synchronously
 * 
 * @template T The return type of the callback function
 * @param {SyncEnvironmentCallback<T>} callback - The sync callback to execute conditionally
 * @returns {T | undefined} The callback result or undefined if condition is not met
 * 
 * @throws {Error} Throws an error if the callback returns a Promise (async function)
 * 
 * @example
 * ```typescript
 * const executeInNodejs = getFunctionExecuteInEnvironment(isNodejs);
 * 
 * const result = executeInNodejs((env) => {
 *   const fs = require('fs');
 *   return fs.existsSync('./package.json');
 * });
 * ```
 * 
 * @internal This is a factory function used internally to create environment-specific executors
 */
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
export const inBrowser = getFunctionExecuteInEnvironment(isBrowser);

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
export const inNodejs = getFunctionExecuteInEnvironment(isNodejs);

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
export const inBun = getFunctionExecuteInEnvironment(isBun);

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
export const inDeno = getFunctionExecuteInEnvironment(isDeno);

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

/**
 * A boolean indicating whether the current environment is unknown.
 * This will be true when the runtime environment cannot be detected or identified.
 * 
 * @constant {boolean}
 * 
 * @example
 * ```typescript
 * import { isUnknown } from 'runtime-detector';
 * 
 * if (isUnknown) {
 *   console.log('Running in an unrecognized environment');
 *   // Fallback logic for unknown environments
 * }
 * ```
 */
export const isUnknown: boolean = currentEnv.name === "Unknown";

/**
 * A boolean indicating whether the current environment is not unknown.
 * This will be true when the runtime environment has been successfully detected and identified.
 * 
 * @constant {boolean}
 * 
 * @example
 * ```typescript
 * import { isNotUnknown } from 'runtime-detector';
 * 
 * if (isNotUnknown) {
 *   console.log('Running in a known, supported environment');
 *   // Environment-specific logic can be safely applied
 * }
 * ```
 */
export const isNotUnknown: boolean = !isUnknown;

/**
 * @deprecated Use `inBrowser` instead. This alias will be removed in a future version.
 * 
 * @see {@link inBrowser} for the preferred function
 */
export const onBrowser = inBrowser;

/**
 * @deprecated Use `inNodejs` instead. This alias will be removed in a future version.
 * 
 * @see {@link inNodejs} for the preferred function
 */
export const onNodejs = inNodejs;

/**
 * @deprecated Use `inBun` instead. This alias will be removed in a future version.
 * 
 * @see {@link inBun} for the preferred function
 */
export const onBun = inBun;

/**
 * @deprecated Use `inDeno` instead. This alias will be removed in a future version.
 * 
 * @see {@link inDeno} for the preferred function
 */
export const onDeno = inDeno;

/**
 * @deprecated Use `inBrowserAsync` instead. This alias will be removed in a future version.
 * 
 * @see {@link inBrowserAsync} for the preferred function
 */
export const onBrowserAsync = inBrowserAsync;

/**
 * @deprecated Use `inNodejsAsync` instead. This alias will be removed in a future version.
 * 
 * @see {@link inNodejsAsync} for the preferred function
 */
export const onNodejsAsync = inNodejsAsync;

/**
 * @deprecated Use `inBunAsync` instead. This alias will be removed in a future version.
 * 
 * @see {@link inBunAsync} for the preferred function
 */
export const onBunAsync = inBunAsync;

/**
 * @deprecated Use `inDenoAsync` instead. This alias will be removed in a future version.
 * 
 * @see {@link inDenoAsync} for the preferred function
 */
export const onDenoAsync = inDenoAsync;
