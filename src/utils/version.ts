type BrowserInfo = {
  name: string;
  version: string;
};

/**
 * Extract browser version from user agent string
 *
 * @returns {string} Browser version or 'unknown' if detection fails
 */
export function getBrowserVersion(): BrowserInfo {
  const userAgent = navigator.userAgent;

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
