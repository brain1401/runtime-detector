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
    detect: (): boolean => typeof (globalThis as any).Bun !== "undefined",
    name: "Bun",
    getVersion: (): string => (globalThis as any).Bun?.version || "unknown",
  },
  /**
   * Node.js runtime environment configuration
   * Checks for Node.js specific properties to differentiate from Bun and Deno
   */
  Nodejs: {
    detect: (): boolean =>
      typeof process !== "undefined" &&
      !!process.versions.node &&
      !(globalThis as any).Bun &&
      !(globalThis as any).Deno,
    name: "Nodejs",
    getVersion: (): string => process.version || "unknown",
  },
  /**
   * Deno runtime environment configuration
   */
  Deno: {
    detect: (): boolean => typeof (globalThis as any).Deno !== "undefined",
    name: "Deno",
    getVersion: (): string =>
      (globalThis as any).Deno?.version?.deno || "unknown",
  },
};
