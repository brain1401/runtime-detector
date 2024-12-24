import { EnvironmentMap } from "../types";
import { getBrowserVersion } from "../utils/version";

/**
 * Map of supported environments with their detection and version retrieval logic
 *
 * @constant
 * @type {EnvironmentMap}
 */
export const environments: EnvironmentMap = {
  /**
   * Browser runtime environment configuration
   */
  Browser: {
    detect: (): boolean =>
      typeof window !== "undefined" && typeof document !== "undefined",
    name: "Browser",
    getVersion: (): string => getBrowserVersion().version,
    getBrowserName: (): string => getBrowserVersion().name,
  },
  /**
   * Bun runtime environment configuration
   */
  Bun: {
    detect: (): boolean => {
      return "Bun" in globalThis;
    },
    name: "Bun",
    getVersion: (): string => (globalThis as any).Bun?.version || "unknown",
  },
  /**
   * Deno runtime environment configuration
   */
  Deno: {
    detect: (): boolean => {
      return "Deno" in globalThis;
    },
    name: "Deno",
    getVersion: (): string =>
      (globalThis as any).Deno?.version?.deno || "unknown",
  },
  /**
   * Node.js runtime environment configuration
   * Checks for Node.js specific properties to differentiate from Bun and Deno
   */
  Nodejs: {
    detect: (): boolean => {
      return (
        typeof process !== "undefined" &&
        !!process.versions?.node && 
        !("Bun" in globalThis) &&
        !("Deno" in globalThis)
      );
    },
    name: "Nodejs",
    getVersion: (): string => process?.version || "unknown",
  },
};
