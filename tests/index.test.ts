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
    const result = callback(currentEnv);
    if (result instanceof Promise) {
      throw new Error("callback must be a sync function");
    }
    return condition ? result : undefined;
  };

const getTestFunctionExecuteInEnvironmentAsync =
  (condition: boolean, currentEnv: EnvironmentInfo) =>
  async <T>(callback: AsyncEnvironmentCallback<T>): Promise<T | undefined> => {
    const result = callback(currentEnv);
    if (!(result instanceof Promise)) {
      throw new Error("callback must return a Promise");
    }
    return condition ? await result : undefined;
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

  describe("환경별 실행 함수 테스트", () => {
    it("onBrowser 함수 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser } = getCurrentEnvironmentVariables(env);

      const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);

      const result = onBrowser((env) => {
        expect(env.name).toBe("Browser");
        return "browser-result";
      });

      expect(result).toBe("browser-result");
    });

    it("onNodejs 함수 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);

      const result = onNodejs((env) => {
        expect(env.name).toBe("Nodejs");
        return "nodejs-result";
      });

      expect(result).toBe("nodejs-result");
    });

    it("onBun 함수 테스트", () => {
      simulateBun();
      const env = getCurrentEnvironment();
      const { isBun } = getCurrentEnvironmentVariables(env);

      const onBun = getTestFunctionExecuteInEnvironment(isBun, env);

      const result = onBun((env) => {
        expect(env.name).toBe("Bun");
        return "bun-result";
      });

      expect(result).toBe("bun-result");
    });

    it("onDeno 함수 테스트", () => {
      simulateDeno();
      const env = getCurrentEnvironment();
      const { isDeno } = getCurrentEnvironmentVariables(env);

      const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const result = onDeno((env) => {
        expect(env.name).toBe("Deno");
        return "deno-result";
      });

      expect(result).toBe("deno-result");
    });
  });

  describe("비동기 함수 테스트", () => {
    it("onBrowserAsync 함수 테스트", async () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser } = getCurrentEnvironmentVariables(env);

      const onBrowserAsync = getTestFunctionExecuteInEnvironmentAsync(
        isBrowser,
        env
      );

      const result = await onBrowserAsync(async (env) => {
        expect(env.name).toBe("Browser");
        return "browser-async-result";
      });

      expect(result).toBe("browser-async-result");
    });

    it("onNodejsAsync 함수 테스트", async () => {
      simulateNodejs();
      const env = getCurrentEnvironment();
      const { isNodejs } = getCurrentEnvironmentVariables(env);

      const onNodejsAsync = getTestFunctionExecuteInEnvironmentAsync(
        isNodejs,
        env
      );

      const result = await onNodejsAsync(async (env) => {
        expect(env.name).toBe("Nodejs");
        return "nodejs-async-result";
      });

      expect(result).toBe("nodejs-async-result");
    });
  });

  describe("에러 케이스 테스트", () => {
    describe("동기 함수에 비동기 콜백 전달시 에러 발생", () => {
      it("Node.js 환경 테스트", () => {
        simulateNodejs();
        const env = getCurrentEnvironment();
        const { isNodejs } = getCurrentEnvironmentVariables(env);

        const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);

        expect(() =>
          // @ts-expect-error
          onNodejs(async () => {
            return "result";
          })
        ).toThrow();
      });

      it("Browser 환경 테스트", () => {
        simulateBrowser();
        const env = getCurrentEnvironment();
        const { isBrowser } = getCurrentEnvironmentVariables(env);

        const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);

        expect(() =>
          // @ts-expect-error
          onBrowser(async () => {
            return "result";
          })
        ).toThrow();
      });

      it("Bun 환경 테스트", () => {
        simulateBun();
        const env = getCurrentEnvironment();
        const { isBun } = getCurrentEnvironmentVariables(env);

        const onBun = getTestFunctionExecuteInEnvironment(isBun, env);

        expect(() =>
          // @ts-expect-error
          onBun(async () => {
            return "result";
          })
        ).toThrow();
      });

      it("Deno 환경 테스트", () => {
        simulateDeno();
        const env = getCurrentEnvironment();
        const { isDeno } = getCurrentEnvironmentVariables(env);

        const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

        expect(() =>
          // @ts-expect-error
          onDeno(async () => {
            return "result";
          })
        ).toThrow();
      });
    });
  });

  describe("잘못된 환경에서 실행시 undefined 반환", () => {
    it("Node.js 환경 테스트", () => {
      simulateNodejs();
      const env = getCurrentEnvironment();

      const { isNodejs, isBrowser, isBun, isDeno } =
        getCurrentEnvironmentVariables(env);

      const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const onBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const onDenoResult = onDeno(() => "result");
      expect(onDenoResult).toBeUndefined();

      const onNodejsResult = onNodejs(() => "result");
      expect(onNodejsResult).toBe("result");

      const onBrowserResult = onBrowser(() => "result");
      expect(onBrowserResult).toBeUndefined();

      const onBunResult = onBun(() => "result");
      expect(onBunResult).toBeUndefined();
    });

    it("Deno 환경 테스트", () => {
      simulateDeno();
      const env = getCurrentEnvironment();
      const { isDeno, isNodejs, isBrowser, isBun } =
        getCurrentEnvironmentVariables(env);

      const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);
      const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const onBun = getTestFunctionExecuteInEnvironment(isBun, env);

      const onDenoResult = onDeno(() => "result");
      expect(onDenoResult).toBe("result");

      const onNodejsResult = onNodejs(() => "result");
      expect(onNodejsResult).toBeUndefined();

      const onBrowserResult = onBrowser(() => "result");
      expect(onBrowserResult).toBeUndefined();

      const onBunResult = onBun(() => "result");
      expect(onBunResult).toBeUndefined();
    });

    it("Bun 환경 테스트", () => {
      simulateBun();
      const env = getCurrentEnvironment();
      const { isBun, isNodejs, isBrowser, isDeno } =
        getCurrentEnvironmentVariables(env);

      const onBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const onBunResult = onBun(() => "result");
      expect(onBunResult).toBe("result");

      const onNodejsResult = onNodejs(() => "result");
      expect(onNodejsResult).toBeUndefined();

      const onBrowserResult = onBrowser(() => "result");
      expect(onBrowserResult).toBeUndefined();

      const onDenoResult = onDeno(() => "result");
      expect(onDenoResult).toBeUndefined();
    });

    it("Browser 환경 테스트", () => {
      simulateBrowser();
      const env = getCurrentEnvironment();
      const { isBrowser, isNodejs, isBun, isDeno } =
        getCurrentEnvironmentVariables(env);

      const onBrowser = getTestFunctionExecuteInEnvironment(isBrowser, env);
      const onNodejs = getTestFunctionExecuteInEnvironment(isNodejs, env);
      const onBun = getTestFunctionExecuteInEnvironment(isBun, env);
      const onDeno = getTestFunctionExecuteInEnvironment(isDeno, env);

      const onBrowserResult = onBrowser(() => "result");
      expect(onBrowserResult).toBe("result");

      const onNodejsResult = onNodejs(() => "result");
      expect(onNodejsResult).toBeUndefined();

      const onBunResult = onBun(() => "result");
      expect(onBunResult).toBeUndefined();

      const onDenoResult = onDeno(() => "result");
      expect(onDenoResult).toBeUndefined();
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
