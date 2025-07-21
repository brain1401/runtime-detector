import { getCurrentEnvironment } from "../src/utils/detector";

import {
  AsyncEnvironmentCallback,
  EnvironmentInfo,
  SyncEnvironmentCallback,
} from "../src/types";

declare global {
  var Bun: any;
  var Deno: any;
}

function getCurrentEnvironmentVariables(env: EnvironmentInfo) {
  return {
    isBrowser: env.name === "Browser",
    isNodejs: env.name === "Nodejs",
    isBun: env.name === "Bun",
    isDeno: env.name === "Deno",
    isNotBrowser: env.name !== "Browser",
    isNotNodejs: env.name !== "Nodejs",
    isNotBun: env.name !== "Bun",
    isNotDeno: env.name !== "Deno",
    isUnknown: env.name === "Unknown",
  };
}

const getTestFunctionExecuteInEnvironment =
  (condition: boolean, currentEnv: EnvironmentInfo) =>
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

const getTestFunctionExecuteInEnvironmentAsync =
  (condition: boolean, currentEnv: EnvironmentInfo) =>
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

function resetGlobalThis() {
  delete (globalThis as any).window;
  delete (globalThis as any).navigator;
  delete (globalThis as any).document;

  delete (globalThis as any).process;
  delete (globalThis as any).Bun;
  delete (globalThis as any).Deno;
}

function simulateBrowser(userAgent?: string) {
  (globalThis as any).window = {} as any;
  (globalThis as any).document = {} as any;

  (globalThis as any).navigator = {
    userAgent:
      userAgent ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  };
}

function simulateNodejs() {
  (globalThis as any).process = {
    version: "v16.0.0",
    versions: { node: "16.0.0" },
  } as any;
}

function simulateBun() {
  (globalThis as any).Bun = { version: "1.1.0" } as any;
}

function simulateDeno() {
  (globalThis as any).Deno = { version: { deno: "2.1.1" } } as any;
}

describe("환경 감지 테스트", () => {
  beforeEach(() => {
    // 각 테스트 전 전역 객체 초기화
    resetGlobalThis();
  });

  describe("getCurrentEnvironment()", () => {
    it("브라우저 환경 감지", () => {
      simulateBrowser();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Browser");
    });

    it("Node.js 환경 감지", () => {
      simulateNodejs();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Nodejs");
    });

    it("Bun 환경 감지", () => {
      simulateBun();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Bun");
    });

    it("Deno 환경 감지", () => {
      simulateDeno();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Deno");
    });
  });

  describe("Callback Execution Functions", () => {
    it("inBrowser 함수 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser } = getCurrentEnvironmentVariables(env);

      const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);

      const result = inBrowser((env) => {
        expect(env.name).toBe("Browser");
        return "Browser Test Passed";
      });

      if (isBrowser) {
        expect(result).toBe("Browser Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inNodejs 함수 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);

      const result = inNodejs((env) => {
        expect(env.name).toBe("Nodejs");
        return "Node.js Test Passed";
      });

      if (isNodejs) {
        expect(result).toBe("Node.js Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inBun 함수 테스트", () => {
      simulateBun();
      const env = getCurrentEnvironment();
      const { isBun } = getCurrentEnvironmentVariables(env);

      const inBun = getTestFunctionExecuteInEnvironment(isBun, env);

      const result = inBun((env) => {
        expect(env.name).toBe("Bun");
        return "Bun Test Passed";
      });

      if (isBun) {
        expect(result).toBe("Bun Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inDeno 함수 테스트", () => {
      simulateDeno();
      const env = getCurrentEnvironment();
      const { isDeno } = getCurrentEnvironmentVariables(env);

      const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const result = inDeno((env) => {
        expect(env.name).toBe("Deno");
        return "Deno Test Passed";
      });

      if (isDeno) {
        expect(result).toBe("Deno Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  describe("비동기 함수 테스트", () => {
    it("inBrowserAsync 함수 테스트", async () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser } = getCurrentEnvironmentVariables(env);

      const inBrowserAsync = getTestFunctionExecuteInEnvironmentAsync(
        isBrowser,
        env
      );

      const result = await inBrowserAsync(async (env) => {
        expect(env.name).toBe("Browser");
        return "Browser Async Test Passed";
      });

      if (isBrowser) {
        expect(result).toBe("Browser Async Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inNodejsAsync 함수 테스트", async () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const inNodejsAsync = getTestFunctionExecuteInEnvironmentAsync(
        isNodejs,
        env
      );

      const result = await inNodejsAsync(async (env) => {
        expect(env.name).toBe("Nodejs");
        return "Node.js Async Test Passed";
      });

      if (isNodejs) {
        expect(result).toBe("Node.js Async Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inBunAsync 함수 테스트", async () => {
      simulateBun();
      const env = getCurrentEnvironment();
      const { isBun } = getCurrentEnvironmentVariables(env);

      const inBunAsync = getTestFunctionExecuteInEnvironmentAsync(isBun, env);

      const result = await inBunAsync(async (env) => {
        expect(env.name).toBe("Bun");
        return "Bun Async Test Passed";
      });

      if (isBun) {
        expect(result).toBe("Bun Async Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("inDenoAsync 함수 테스트", async () => {
      simulateDeno();
      const env = getCurrentEnvironment();
      const { isDeno } = getCurrentEnvironmentVariables(env);

      const inDenoAsync = getTestFunctionExecuteInEnvironmentAsync(isDeno, env);

      const result = await inDenoAsync(async (env) => {
        expect(env.name).toBe("Deno");
        return "Deno Async Test Passed";
      });

      if (isDeno) {
        expect(result).toBe("Deno Async Test Passed");
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  describe("에러 케이스 테스트", () => {
    describe("동기 함수에 비동기 콜백 전달시 에러 발생", () => {
      it("inNodejs 함수에서 콜백 에러 발생 시 처리", () => {
        simulateNodejs();
        const env = getCurrentEnvironment();
        const { isNodejs } = getCurrentEnvironmentVariables(env);

        const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);

        expect(() =>
          // @ts-expect-error
          inNodejs(async () => {
            return "async result";
          })
        ).toThrow("callback must be a sync function");
      });

      it("inBrowser 함수에서 콜백 에러 발생 시 처리", () => {
        simulateBrowser();
        const env = getCurrentEnvironment();
        const { isBrowser } = getCurrentEnvironmentVariables(env);

        const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);

        expect(() =>
          // @ts-expect-error
          inBrowser(async () => {
            return "async result";
          })
        ).toThrow("callback must be a sync function");
      });

      it("inBun 함수에서 콜백 에러 발생 시 처리", () => {
        simulateBun();
        const env = getCurrentEnvironment();
        const { isBun } = getCurrentEnvironmentVariables(env);

        const inBun = getTestFunctionExecuteInEnvironment(isBun, env);

        expect(() =>
          // @ts-expect-error
          inBun(async () => {
            return "async result";
          })
        ).toThrow("callback must be a sync function");
      });

      it("inDeno 함수에서 콜백 에러 발생 시 처리", () => {
        simulateDeno();
        const env = getCurrentEnvironment();
        const { isDeno } = getCurrentEnvironmentVariables(env);

        const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

        expect(() =>
          // @ts-expect-error
          inDeno(async () => {
            return "async result";
          })
        ).toThrow("callback must be a sync function");
      });
    });
  });

  describe("잘못된 환경에서 실행시 undefined 반환", () => {
    it("Node.js 환경 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();

      const { isNodejs, isBrowser, isBun, isDeno } =
        getCurrentEnvironmentVariables(env);

      const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const inBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const inDenoResult = inDeno(() => "result");
      expect(inDenoResult).toBeUndefined();

      const inNodejsResult = inNodejs(() => "result");
      expect(inNodejsResult).toBe("result");

      const inBrowserResult = inBrowser(() => "result");
      expect(inBrowserResult).toBeUndefined();

      const inBunResult = inBun(() => "result");
      expect(inBunResult).toBeUndefined();
    });

    it("Deno 환경 테스트", () => {
      simulateDeno();
      const env = getCurrentEnvironment();
      const { isDeno, isNodejs, isBrowser, isBun } =
        getCurrentEnvironmentVariables(env);

      const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);
      const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const inBun = getTestFunctionExecuteInEnvironment(isBun, env);

      const inDenoResult = inDeno(() => "result");
      expect(inDenoResult).toBe("result");

      const inNodejsResult = inNodejs(() => "result");
      expect(inNodejsResult).toBeUndefined();

      const inBrowserResult = inBrowser(() => "result");
      expect(inBrowserResult).toBeUndefined();

      const inBunResult = inBun(() => "result");
      expect(inBunResult).toBeUndefined();
    });

    it("Bun 환경 테스트", () => {
      simulateBun();
      const env = getCurrentEnvironment();
      const { isBun, isNodejs, isBrowser, isDeno } =
        getCurrentEnvironmentVariables(env);

      const inBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const inBunResult = inBun(() => "result");
      expect(inBunResult).toBe("result");

      const inNodejsResult = inNodejs(() => "result");
      expect(inNodejsResult).toBeUndefined();

      const inBrowserResult = inBrowser(() => "result");
      expect(inBrowserResult).toBeUndefined();

      const inDenoResult = inDeno(() => "result");
      expect(inDenoResult).toBeUndefined();
    });

    it("Browser 환경 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser, isNodejs, isBun, isDeno } =
        getCurrentEnvironmentVariables(env);

      const inBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const inNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const inBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const inDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const inBrowserResult = inBrowser(() => "result");
      expect(inBrowserResult).toBe("result");

      const inNodejsResult = inNodejs(() => "result");
      expect(inNodejsResult).toBeUndefined();

      const inBunResult = inBun(() => "result");
      expect(inBunResult).toBeUndefined();

      const inDenoResult = inDeno(() => "result");
      expect(inDenoResult).toBeUndefined();
    });
  });

  describe("Not 계열 함수 테스트", () => {
    it("onNotBrowser 함수 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isBrowser } = getCurrentEnvironmentVariables(env);

      const onNotBrowser = getTestFunctionExecuteInEnvironment(!isBrowser, env);

      const onNotBrowserResult = onNotBrowser((env) => {
        expect(env.name).toBe("Nodejs");
        return "not-browser-result";
      });

      expect(onNotBrowserResult).toBe("not-browser-result");
    });

    it("onNotNodejs 함수 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const onNotNodejs = getTestFunctionExecuteInEnvironment(!isNodejs, env);

      const onNotNodejsResult = onNotNodejs((env) => {
        expect(env.name).toBe("Browser");
        return "not-nodejs-result";
      });

      expect(onNotNodejsResult).toBe("not-nodejs-result");
    });

    it("onNotNodejs 함수 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const onNotNodejs = getTestFunctionExecuteInEnvironment(!isNodejs, env);

      const onNotNodejsResult = onNotNodejs((env) => {
        expect(env.name).toBe("Browser");
        return "not-nodejs-result";
      });

      expect(onNotNodejsResult).toBe("not-nodejs-result");
    });

    it("onNotBun 함수 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isBun } = getCurrentEnvironmentVariables(env);

      const onNotBun = getTestFunctionExecuteInEnvironment(!isBun, env);

      const onNotBunResult = onNotBun((env) => {
        expect(env.name).toBe("Nodejs");
        return "not-bun-result";
      });

      expect(onNotBunResult).toBe("not-bun-result");
    });

    it("onNotDeno 함수 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isDeno } = getCurrentEnvironmentVariables(env);

      const onNotDeno = getTestFunctionExecuteInEnvironment(!isDeno, env);

      const onNotDenoResult = onNotDeno((env) => {
        expect(env.name).toBe("Nodejs");
        return "not-deno-result";
      });

      expect(onNotDenoResult).toBe("not-deno-result");
    });
  });

  describe("버전 정보 감지 테스트", () => {
    it("Node.js 버전 정보 정확성 테스트", () => {
      simulateNodejs();

      const env = getCurrentEnvironment();
      expect(env.version).toBe("v16.0.0");
    });

    it("Bun 버전 정보 정확성 테스트", () => {
      simulateBun();

      const env = getCurrentEnvironment();
      expect(env.version).toBe("1.1.0");
    });

    it("Deno 버전 정보 정확성 테스트", () => {
      simulateDeno();

      const env = getCurrentEnvironment();
      expect(env.version).toBe("2.1.1");
    });

    it("브라우저 버전 정보 테스트", () => {
      simulateBrowser();

      const env = getCurrentEnvironment();
      expect(env.version).toMatch(/\d+\.\d+\.\d+/); // 버전 형식 검증
    });

    it("Chrome 버전 감지", () => {
      simulateBrowser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      const env = getCurrentEnvironment();
      expect(env.version).toBe("91.0.4472.124");
    });

    it("Firefox 버전 감지", () => {
      simulateBrowser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      );

      const env = getCurrentEnvironment();
      expect(env.version).toBe("89.0");
    });

    it("Edge 버전 감지", () => {
      simulateBrowser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"
      );

      const env = getCurrentEnvironment();
      expect(env.version).toBe("91.0.864.59");
    });

    it("Safari 버전 감지", () => {
      simulateBrowser(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"
      );

      const env = getCurrentEnvironment();
      expect(env.version).toBe("14.1.1");
    });

    it("알 수 없는 브라우저 처리", () => {
      simulateBrowser("Unknown Browser");

      const env = getCurrentEnvironment();
      expect(env.version).toBe("unknown");
    });
  });

  describe("브라우저 이름 테스트", () => {
    it("Chrome 브라우저 이름 테스트", () => {
      simulateBrowser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      const env = getCurrentEnvironment();

      expect(env.browserName).toBe("Chrome");
    });

    it("Edge 브라우저 이름 테스트", () => {
      simulateBrowser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"
      );

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Edge");
    });

    it("Safari 브라우저 이름 테스트", () => {
      simulateBrowser(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"
      );

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Safari");
    });

    it("알 수 없는 브라우저 처리", () => {
      simulateBrowser("Unknown Browser");

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Unknown");
    });
  });
  describe("환경 우선순위 테스트", () => {
    it("Bun과 Node.js가 동시에 존재할 때 Bun이 우선", () => {
      simulateBun();
      simulateNodejs();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Bun");
    });

    it("Deno와 Node.js가 동시에 존재할 때 Deno가 우선", () => {
      simulateDeno();
      simulateNodejs();

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Deno");
    });
  });
});
