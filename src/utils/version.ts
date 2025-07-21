import { EnvironmentInfo, EnvironmentName } from "../types";

/**
 * Information about a browser including its name and version
 * 
 * @typedef {Object} BrowserInfo
 * @property {string} name - The name of the browser (e.g., 'Chrome', 'Firefox', 'Safari', 'Edge', 'Unknown')
 * @property {string} version - The version string of the browser, or 'unknown' if not detectable
 */
type BrowserInfo = {
  name: string;
  version: string;
};

/**
 * Extract browser name and version from user agent string
 *
 * @returns {BrowserInfo} Object containing browser name and version, or 'Unknown'/'unknown' if detection fails
 * 
 * @example
 * ```typescript
 * const browserInfo = getBrowserVersion();
 * console.log(`${browserInfo.name} v${browserInfo.version}`);
 * // Output: "Chrome v91.0.4472.124"
 * ```
 */
export function getBrowserVersion(): BrowserInfo {
  const userAgent = navigator.userAgent || "";

  if (userAgent.includes("Firefox/")) {
    const version = userAgent.split("Firefox/")[1].split(" ")[0];
    return { name: "Firefox", version };
  }

  if (userAgent.includes("Edg/")) {
    const version = userAgent.split("Edg/")[1].split(" ")[0];
    return { name: "Edge", version };
  }

  if (userAgent.includes("Chrome/")) {
    const version = userAgent.split("Chrome/")[1].split(" ")[0];
    return { name: "Chrome", version };
  }

  if (userAgent.includes("Safari/")) {
    const version = userAgent.split("Version/")[1].split(" ")[0];
    return { name: "Safari", version };
  }

  return { name: "Unknown", version: "unknown" };
}

/**
 * Creates a simulated environment info object for testing purposes
 *
 * @param {EnvironmentName} envName - The name of the environment to simulate
 * @returns {EnvironmentInfo} A simulated environment info object with default values
 * 
 * @example
 * ```typescript
 * const mockBrowserEnv = simulateEnvironmentInfo('Browser');
 * console.log(mockBrowserEnv);
 * // Output: { name: 'Browser', version: '1.0.0', browserName: 'Chrome' }
 * ```
 * 
 * @internal This function is primarily intended for internal testing
 */
export function simulateEnvironmentInfo(
  envName: EnvironmentName
): EnvironmentInfo {
  const env: EnvironmentInfo = {
    name: envName,
    version: "1.0.0",
    ...(envName === "Browser" && { browserName: "Chrome" }),
  };

  return env;
}
