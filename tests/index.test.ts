import {
  getCurrentEnvironment,
  onBrowser,
  onNodejs,
  onBun,
  onDeno,
  onBrowserAsync,
  onNodejsAsync,
  onNotNodejs,
  onNotBun,
  onNotDeno,
  onNotBrowser,
} from "../src/index";

declare global {
  var Bun: any;
  var Deno: any;
}

const originalGlobalThis: {
  window: any;
  document: any;
  navigator: any;
  process: any;
  Bun: any;
  Deno: any;
} = {
  window: globalThis.window ?? undefined,
  document: globalThis.document ?? undefined,
  navigator: globalThis.navigator ?? undefined,
  process: globalThis.process ?? undefined,
  Bun: globalThis.Bun ?? undefined,
  Deno: globalThis.Deno ?? undefined,
};

function resetGlobalThis() {
  delete (globalThis as any).window;
  delete (globalThis as any).navigator;
  delete (globalThis as any).document;

  delete (globalThis as any).process;
  delete (globalThis as any).Bun;
  delete (globalThis as any).Deno;
}

describe("환경 감지 테스트", () => {
  beforeEach(() => {
    // 각 테스트 전 전역 객체 초기화
    resetGlobalThis();

    globalThis.window = originalGlobalThis.window;
    globalThis.navigator = originalGlobalThis.navigator;
    globalThis.document = originalGlobalThis.document;
    globalThis.process = originalGlobalThis.process;
    globalThis.Bun = originalGlobalThis.Bun;
    globalThis.Deno = originalGlobalThis.Deno;
  });

  describe("getCurrentEnvironment()", () => {
    it("브라우저 환경 감지", () => {
      // 브라우저 환경 시뮬레이션
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Browser");
      expect(env.isDetected).toBe(true);
    });

    it("Node.js 환경 감지", () => {
      (globalThis as any).process = {
        versions: { node: "16.0.0" },
      } as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Nodejs");
      expect(env.isDetected).toBe(true);
    });

    it("Bun 환경 감지", () => {
      // Bun 환경 시뮬레이션
      (globalThis as any).Bun = { version: "1.0.0" } as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Bun");
      expect(env.isDetected).toBe(true);
    });

    it("Deno 환경 감지", () => {
      // Deno 환경 시뮬레이션
      (globalThis as any).Deno = { version: { deno: "1.0.0" } } as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Deno");
      expect(env.isDetected).toBe(true);
    });
  });

  describe("환경별 실행 함수 테스트", () => {
    it("onBrowser 함수 테스트", () => {
      const env = getCurrentEnvironment();

      const result = onBrowser((env) => {
        expect(env.name).toBe("Browser");
        return "browser-result";
      });

      if (env.name === "Browser") {
        expect(result).toBe("browser-result");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("onNodejs 함수 테스트", () => {
      const env = getCurrentEnvironment();

      const result = onNodejs((env) => {
        expect(env.name).toBe("Nodejs");
        return "nodejs-result";
      });

      if (env.name === "Nodejs") {
        expect(result).toBe("nodejs-result");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("onBun 함수 테스트", () => {
      const env = getCurrentEnvironment();

      const result = onBun((env) => {
        expect(env.name).toBe("Bun");
        return "bun-result";
      });

      if (env.name === "Bun") {
        expect(result).toBe("bun-result");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("onDeno 함수 테스트", () => {
      const env = getCurrentEnvironment();

      const result = onDeno((env) => {
        expect(env.name).toBe("Deno");
        return "deno-result";
      });

      if (env.name === "Deno") {
        expect(result).toBe("deno-result");
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  describe("비동기 함수 테스트", () => {
    it("onBrowserAsync 함수 테스트", async () => {
      const env = getCurrentEnvironment();

      const result = await onBrowserAsync(async (env) => {
        expect(env.name).toBe("Browser");
        return "browser-async-result";
      });

      if (env.name === "Browser") {
        expect(result).toBe("browser-async-result");
      } else {
        expect(result).toBeUndefined();
      }
    });

    it("onNodejsAsync 함수 테스트", async () => {
      const env = getCurrentEnvironment();

      const result = await onNodejsAsync(async (env) => {
        expect(env.name).toBe("Nodejs");
        return "nodejs-async-result";
      });

      if (env.name === "Nodejs") {
        expect(result).toBe("nodejs-async-result");
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  describe("에러 케이스 테스트", () => {
    it("동기 함수에 비동기 콜백 전달시 에러 발생", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Nodejs") {
        expect(() =>
          // @ts-expect-error
          onNodejs(async () => {
            return "result";
          })
        ).toThrow();
      } else if (env.name === "Browser") {
        expect(() =>
          // @ts-expect-error
          onBrowser(async () => {
            return "result";
          })
        ).toThrow();
      } else if (env.name === "Bun") {
        expect(() =>
          // @ts-expect-error
          onBun(async () => {
            return "result";
          })
        ).toThrow();
      } else if (env.name === "Deno") {
        expect(() =>
          // @ts-expect-error
          onDeno(async () => {
            return "result";
          })
        ).toThrow();
      }
    });

    it("잘못된 환경에서 실행시 undefined 반환", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Nodejs") {
        const result = onDeno(() => "result");
        expect(result).toBeUndefined();
      } else if (env.name === "Browser") {
        const result = onNodejs(() => "result");
        expect(result).toBeUndefined();
      } else if (env.name === "Bun") {
        const result = onBrowser(() => "result");
        expect(result).toBeUndefined();
      } else if (env.name === "Deno") {
        const result = onBun(() => "result");
        expect(result).toBeUndefined();
      }
    });
  });

  describe("Not 계열 함수 테스트", () => {
    it("onNotBrowser 함수 테스트", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Nodejs") {
        const result = onNotBrowser((env) => {
          expect(env.name).toBe("Nodejs");
          return "not-browser-result";
        });

        expect(result).toBe("not-browser-result");
      } else if (env.name === "Bun") {
        const result = onNotBrowser((env) => {
          expect(env.name).toBe("Bun");
          return "not-browser-result";
        });

        expect(result).toBe("not-browser-result");
      } else if (env.name === "Deno") {
        const result = onNotBrowser((env) => {
          expect(env.name).toBe("Deno");
          return "not-browser-result";
        });

        expect(result).toBe("not-browser-result");
      }
    });

    it("onNotNodejs 함수 테스트", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Browser") {
        const result = onNotNodejs((env) => {
          expect(env.name).toBe("Browser");
          return "not-nodejs-result";
        });

        expect(result).toBe("not-nodejs-result");
      } else if (env.name === "Bun") {
        const result = onNotNodejs((env) => {
          expect(env.name).toBe("Bun");
          return "not-nodejs-result";
        });

        expect(result).toBe("not-nodejs-result");
      } else if (env.name === "Deno") {
        const result = onNotNodejs((env) => {
          expect(env.name).toBe("Deno");
          return "not-nodejs-result";
        });

        expect(result).toBe("not-nodejs-result");
      }
    });

    it("onNotBun 함수 테스트", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Nodejs") {
        const result = onNotBun((env) => {
          expect(env.name).toBe("Nodejs");
          return "not-bun-result";
        });

        expect(result).toBe("not-bun-result");
      } else if (env.name === "Deno") {
        const result = onNotBun((env) => {
          expect(env.name).toBe("Deno");
          return "not-bun-result";
        });

        expect(result).toBe("not-bun-result");
      } else if (env.name === "Browser") {
        const result = onNotBun((env) => {
          expect(env.name).toBe("Browser");
          return "not-bun-result";
        });

        expect(result).toBe("not-bun-result");
      }
    });

    it("onNotDeno 함수 테스트", () => {
      const env = getCurrentEnvironment();

      if (env.name === "Nodejs") {
        const result = onNotDeno((env) => {
          expect(env.name).toBe("Nodejs");
          return "not-deno-result";
        });

        expect(result).toBe("not-deno-result");
      } else if (env.name === "Bun") {
        const result = onNotDeno((env) => {
          expect(env.name).toBe("Bun");
          return "not-deno-result";
        });

        expect(result).toBe("not-deno-result");
      } else if (env.name === "Browser") {
        const result = onNotDeno((env) => {
          expect(env.name).toBe("Browser");
          return "not-deno-result";
        });

        expect(result).toBe("not-deno-result");
      }
    });
  });

  describe("버전 정보 감지 테스트", () => {
    it("Node.js 버전 정보 정확성 테스트", () => {
      // Node.js 환경 시뮬레이션

      (globalThis as any).process = {
        versions: { node: "16.0.0" },
        version: "v16.0.0",
      } as any;

      const env = getCurrentEnvironment();
      expect(env.version).toBe("v16.0.0");
    });

    it("Bun 버전 정보 정확성 테스트", () => {
      // Bun 환경 시뮬레이션
      (globalThis as any).Bun = { version: "1.0.0" } as any;

      const env = getCurrentEnvironment();
      expect(env.version).toBe("1.0.0");
    });

    it("Deno 버전 정보 정확성 테스트", () => {
      // Deno 환경 시뮬레이션
      (globalThis as any).Deno = { version: { deno: "1.0.0" } } as any;

      const env = getCurrentEnvironment();
      expect(env.version).toBe("1.0.0");
    });

    it("브라우저 버전 정보 테스트", () => {
      resetGlobalThis();
      // 브라우저 환경 시뮬레이션
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toMatch(/\d+\.\d+\.\d+/); // 버전 형식 검증
    });

    it("Chrome 버전 감지", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toBe("91.0.4472.124");
    });

    it("Firefox 버전 감지", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toBe("89.0");
    });

    it("Edge 버전 감지", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toBe("91.0.864.59");
    });

    it("Safari 버전 감지", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toBe("14.1.1");
    });

    it("알 수 없는 브라우저 처리", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent: "Unknown Browser",
      };

      const env = getCurrentEnvironment();
      expect(env.version).toBe("unknown");
    });
  });

  describe("브라우저 이름 테스트", () => {
    it("Chrome 브라우저 이름 테스트", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Chrome");
    });

    it("Edge 브라우저 이름 테스트", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
      };

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Edge");
    });

    it("Safari 브라우저 이름 테스트", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
      };
    });

    it("알 수 없는 브라우저 처리", () => {
      resetGlobalThis();
      (globalThis as any).window = {} as any;
      (globalThis as any).document = {} as any;
      (globalThis as any).navigator = {
        userAgent: "Unknown Browser",
      };

      const env = getCurrentEnvironment();
      expect(env.browserName).toBe("Unknown");
    });
  });
  describe("환경 우선순위 테스트", () => {
    it("Bun과 Node.js가 동시에 존재할 때 Bun이 우선", () => {
      resetGlobalThis();
      // Bun과 Node.js 환경 동시 시뮬레이션
      (globalThis as any).Bun = { version: "1.0.0" } as any;
      (globalThis as any).process = {
        versions: { node: "16.0.0" },
      } as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Bun");
    });

    it("Deno와 Node.js가 동시에 존재할 때 Deno가 우선", () => {
      resetGlobalThis();
      // Deno와 Node.js 환경 동시 시뮬레이션
      (globalThis as any).Deno = { version: { deno: "1.0.0" } } as any;
      (globalThis as any).process = {
        versions: { node: "16.0.0" },
      } as any;

      const env = getCurrentEnvironment();
      expect(env.name).toBe("Deno");
    });
  });
});
