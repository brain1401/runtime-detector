/**
 * @fileoverview Runtime Detector Library
 * 
 * A lightweight library for detecting and working with different JavaScript runtime environments
 * including Browser, Node.js, Bun, and Deno. Provides utilities for environment detection,
 * conditional execution, and environment-specific operations.
 * 
 * @author Runtime Detector Team
 * @version 1.2.1
 * 
 * @example
 * ```typescript
 * import { isBrowser, isNodejs, inBrowser } from 'runtime-detector';
 * 
 * if (isBrowser) {
 *   console.log('Running in browser');
 * }
 * 
 * const result = inBrowser((env) => {
 *   return `Browser: ${env.browserName} v${env.version}`;
 * });
 * ```
 */

export {
  currentEnv,
  isBrowser,
  isBun,
  isDeno,
  isNodejs,
  isNotBrowser,
  isNotBun,
  isNotDeno,
  isNotNodejs,
  isUnknown,
  isNotUnknown,
  // Preferred functions (recommended)
  inBrowser,
  inBrowserAsync,
  inBun,
  inBunAsync,
  inDeno,
  inDenoAsync,
  inNodejs,
  inNodejsAsync,
  // Legacy functions (deprecated but supported)
  onBrowser,
  onBrowserAsync,
  onBun,
  onBunAsync,
  onDeno,
  onDenoAsync,
  onNodejs,
  onNodejsAsync,
  onNotBrowser,
  onNotBrowserAsync,
  onNotBun,
  onNotBunAsync,
  onNotDeno,
  onNotDenoAsync,
  onNotNodejs,
  onNotNodejsAsync,
  onUnknown,
  onUnknownAsync,
} from "./utils/detector";
