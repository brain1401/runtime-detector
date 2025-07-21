# Runtime Detector

[![npm version](https://img.shields.io/npm/v/runtime-detector.svg)](https://www.npmjs.com/package/runtime-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/runtime-detector)](https://bundlephobia.com/package/runtime-detector)

A lightweight, type-safe runtime environment detector for JavaScript/TypeScript applications. Easily detect and handle code execution in Bun, Node.js, Deno, and Browser environments.

## 🚀 Key Features

- **Environment Callbacks**: Execute code through environment-specific callback functions
- **Return Values**: Callback functions can return values for further processing
- **Zero Dependencies**: No external dependencies
- **TypeScript Ready**: Full TypeScript support with type definitions included
- **Lightweight**: Only ~1.1KB minzipped
- **Universal Detection**: Supports Bun, Node.js, Deno, and Browser environments
- **Flexible API**: Both synchronous and asynchronous operations
- **Type Safety**: Environment-specific code execution with TypeScript type checking
- **Tree-Shakeable**: Import only what you need
- **Dual Package**: Supports both ESM (MJS) and CommonJS (CJS)

## 📦 Installation

```bash
# Using npm
npm install runtime-detector

# Using yarn
yarn add runtime-detector

# Using pnpm
pnpm add runtime-detector

# Using bun
bun add runtime-detector
```

## 📝 Module Support

runtime-detector supports both ESM (ECMAScript Modules) and CommonJS formats.

```javascript
// ESM (MJS)
import { currentEnv, isNodejs } from "runtime-detector";

// CommonJS (CJS)
const { currentEnv, isNodejs } = require("runtime-detector");
```

## 🎯 Quick Start

### Basic Environment Detection

```typescript
import { currentEnv, isNodejs, isBrowser } from "runtime-detector";

// Configuration setup example
function setupConfig() {
  const { name, version, browserName } = currentEnv;
  
  // Set environment-specific logging levels
  const config = {
    logLevel: isNodejs ? 'verbose' : 'error',
    maxRetries: isBrowser ? 3 : 5,
    timeout: isBrowser ? 5000 : 10000,
    features: {
      cache: isNodejs || browserName === 'Chrome',
      analytics: isBrowser && browserName !== 'Firefox',
      ssr: !isBrowser
    }
  };

  return config;
}
```

### Environment-Specific Code Execution

```typescript
import { inNodejs, inBrowser, inBun, inDeno } from "runtime-detector";

// File handling across different environments
function saveData(content: string) {
  // Node.js: Use fs with proper error handling
  inNodejs((env) => {
    const fs = require('fs').promises;
    return fs.writeFile('data.json', content)
      .catch(err => console.error(`Failed to write file in Node.js ${env.version}:`, err));
  });

  // Browser: Use localStorage with size check
  inBrowser((env) => {
    try {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (content.length > maxSize) {
        throw new Error('Content too large for localStorage');
      }
      localStorage.setItem('data', content);
      console.log(`Data saved in ${env.browserName}`);
    } catch (err) {
      console.error('Storage failed:', err);
    }
  });

  // Bun: Use fast native file API
  inBun((env) => {
    try {
      Bun.write('data.json', content);
      console.log(`File written using Bun ${env.version}`);
    } catch (err) {
      console.error('Bun write failed:', err);
    }
  });

  // Deno: Use native APIs with permissions
  inDeno((env) => {
    try {
      Deno.writeTextFileSync('data.json', content);
      console.log(`File written in Deno ${env.version}`);
    } catch (err) {
      console.error('Deno write failed:', err);
    }
  });
}
```

### Async Operations with Error Handling

```typescript
import { inNodejsAsync, inBrowserAsync } from "runtime-detector";

// API client with environment-specific optimizations
class APIClient {
  async fetchData(endpoint: string) {
    // Browser: Use native fetch with timeout
    const browserData = await inBrowserAsync(async (env) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': `WebApp/${env.browserName}`,
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        console.error(`Browser fetch failed:`, err);
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    });

    // Node.js: Use axios with retries
    const nodeData = await inNodejsAsync(async (env) => {
      const axios = require('axios');
      let retries = 3;
      
      while (retries > 0) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              'User-Agent': `NodeApp/${env.version}`,
              'Accept': 'application/json'
            },
            timeout: 5000
          });
          return response.data;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });

    return browserData || nodeData;
  }
}
```

### Feature Detection and Optimization

```typescript
import { onNotNodejs, onNotBrowser } from "runtime-detector";

// Cache system optimization example
function setupCache(data: any) {
  // Use Redis in server environments
  onNotBrowser(async (env) => {
    const Redis = require('redis');
    const client = Redis.createClient();
    
    try {
      await client.connect();
      await client.set('app:cache', JSON.stringify(data));
      console.log(`Redis cache setup in ${env.name}`);
    } catch (err) {
      console.error(`Cache setup failed in ${env.name}:`, err);
      // Fallback to in-memory cache
      global.__cache = data;
    }
  });

  // Use IndexedDB in browser
  inBrowser((env) => {
    const request = indexedDB.open('appCache', 1);
    
    request.onerror = () => {
      console.error(`IndexedDB failed in ${env.browserName}`);
      // Fallback to sessionStorage
      sessionStorage.setItem('cache', JSON.stringify(data));
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction('cache', 'readwrite');
      tx.objectStore('cache').put(data, 'appData');
    };
  });
}
```

## 📚 API Reference

### Environment Information

- `currentEnv`: Current environment details
  - `name`: Runtime name (e.g., "Node.js", "Bun")
  - `version`: Runtime version
  - `browserName`: Browser name (if applicable)

### Environment Checks

```typescript
import {
  isBrowser,     // true in browser environments
  isNodejs,      // true in Node.js
  isBun,         // true in Bun
  isDeno,        // true in Deno
  isUnknown,     // true when environment cannot be detected
  isNotBrowser,  // true in non-browser environments
  isNotNodejs,   // true in non-Node.js environments
  isNotBun,      // true in non-Bun environments
  isNotDeno,     // true in non-Deno environments
  isNotUnknown   // true when environment is successfully detected
} from "runtime-detector";
```

### Synchronous Execution APIs

#### Preferred Functions (Recommended)

| Function                 | Description            |
| ------------------------ | ---------------------- |
| `inBrowser(callback)`    | Execute in browser     |
| `inNodejs(callback)`     | Execute in Node.js     |
| `inBun(callback)`        | Execute in Bun         |
| `inDeno(callback)`       | Execute in Deno        |
| `onNotBrowser(callback)` | Execute in non-browser |
| `onNotNodejs(callback)`  | Execute in non-Node.js |
| `onNotBun(callback)`     | Execute in non-Bun     |
| `onNotDeno(callback)`    | Execute in non-Deno    |
| `onUnknown(callback)`    | Execute in unknown env |

#### Deprecated Functions (Legacy Support)

> ⚠️ **Deprecated**: These functions are still available but will be removed in a future version. Please use the preferred functions above.

| Function                 | Preferred Alternative |
| ------------------------ | --------------------- |
| `onBrowser(callback)`    | `inBrowser(callback)` |
| `onNodejs(callback)`     | `inNodejs(callback)`  |
| `onBun(callback)`        | `inBun(callback)`     |
| `onDeno(callback)`       | `inDeno(callback)`    |

### Asynchronous Execution APIs

#### Preferred Functions (Recommended)

| Function                      | Description                  |
| ----------------------------- | ---------------------------- |
| `inBrowserAsync(callback)`    | Async execute in browser     |
| `inNodejsAsync(callback)`     | Async execute in Node.js     |
| `inBunAsync(callback)`        | Async execute in Bun         |
| `inDenoAsync(callback)`       | Async execute in Deno        |
| `onNotBrowserAsync(callback)` | Async execute in non-browser |
| `onNotNodejsAsync(callback)`  | Async execute in non-Node.js |
| `onNotBunAsync(callback)`     | Async execute in non-Bun     |
| `onNotDenoAsync(callback)`    | Async execute in non-Deno    |
| `onUnknownAsync(callback)`    | Async execute in unknown env |

#### Deprecated Functions (Legacy Support)

> ⚠️ **Deprecated**: These functions are still available but will be removed in a future version. Please use the preferred functions above.

| Function                      | Preferred Alternative        |
| ----------------------------- | ---------------------------- |
| `onBrowserAsync(callback)`    | `inBrowserAsync(callback)`   |
| `onNodejsAsync(callback)`     | `inNodejsAsync(callback)`    |
| `onBunAsync(callback)`        | `inBunAsync(callback)`       |
| `onDenoAsync(callback)`       | `inDenoAsync(callback)`      |

## 📋 Release Notes

### 1.2.1

- 📚 **Documentation**: Comprehensive JSDoc improvements
  - Added detailed JSDoc comments for all functions and types
  - Improved examples and usage documentation
  - Added `@deprecated` tags for legacy functions
  - Enhanced type documentation and cross-references

- ✨ **API Enhancement**: Introduced preferred function naming
  - New preferred functions: `inBrowser`, `inNodejs`, `inBun`, `inDeno`, `inBrowserAsync`, etc.
  - Legacy functions (`onBrowser`, `onNodejs`, etc.) are now deprecated but still supported
  - Added new environment detection flags: `isUnknown`, `isNotUnknown`
  - All deprecated functions include proper migration guidance

### 1.2.0

- 🐛 **Bug Fix**: Fixed critical issue where `on*` functions could potentially execute in incorrect environments
  - Previously, code within environment-specific functions could sometimes run in unintended environments
  - Now strictly enforces environment checks before executing any code
  - Affects all environment-specific functions (`onNodejs`, `onBrowser`, `onBun`, `onDeno`, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](LICENSE) - feel free to use this project in your applications.

---

# Runtime Detector (한국어)

[![npm version](https://img.shields.io/npm/v/runtime-detector.svg)](https://www.npmjs.com/package/runtime-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/runtime-detector)](https://bundlephobia.com/package/runtime-detector)

JavaScript/TypeScript 애플리케이션을 위한 경량 런타임 환경 감지 라이브러리입니다. Bun, Node.js, Deno, 브라우저 환경을 쉽게 감지하고 처리할 수 있습니다.

## 🚀 주요 기능

- **환경별 콜백**: 환경별 콜백 함수를 통한 코드 실행 지원
- **반환값 지원**: 콜백 함수에서 값을 반환하여 추가 처리 가능
- **의존성 없음**: 외부 의존성이 없음
- **TypeScript 지원**: 타입 정의가 포함된 완벽한 TypeScript 지원
- **경량화**: 약 7KB (압축 시)
- **다양한 환경 감지**: Bun, Node.js, Deno, 브라우저 환경 지원
- **유연한 API**: 동기 및 비동기 작업 모두 지원
- **타입 안전성**: TypeScript 타입 체크와 함께 환경별 코드 실행
- **트리 쉐이킹**: 필요한 기능만 임포트 가능
- **듀얼 패키지**: ESM(MJS)와 CommonJS(CJS) 모두 지원

## 📦 설치

```bash
# npm 사용
npm install runtime-detector

# yarn 사용
yarn add runtime-detector

# pnpm 사용
pnpm add runtime-detector

# bun 사용
bun add runtime-detector
```

## 📝 모듈 지원

runtime-detector는 ESM(ECMAScript Modules)과 CommonJS 형식을 모두 지원합니다.

```javascript
// ESM (MJS)
import { currentEnv, isNodejs } from "runtime-detector";

// CommonJS (CJS)
const { currentEnv, isNodejs } = require("runtime-detector");
```

## 🎯 시작하기

### 기본 환경 감지

```typescript
import { currentEnv, isNodejs, isBrowser } from "runtime-detector";

// 환경별 설정 구성 예제
function setupConfig() {
  const { name, version, browserName } = currentEnv;
  
  // 환경별 로깅 레벨 및 설정 지정
  const config = {
    logLevel: isNodejs ? 'verbose' : 'error',
    maxRetries: isBrowser ? 3 : 5,
    timeout: isBrowser ? 5000 : 10000,
    features: {
      cache: isNodejs || browserName === 'Chrome',
      analytics: isBrowser && browserName !== 'Firefox',
      ssr: !isBrowser
    }
  };

  return config;
}
```

### 환경별 코드 실행

```typescript
import { inNodejs, inBrowser, inBun, inDeno } from "runtime-detector";

// 다양한 환경에서의 파일 처리
function saveData(content: string) {
  // Node.js: fs 모듈 사용 및 오류 처리
  inNodejs((env) => {
    const fs = require('fs').promises;
    return fs.writeFile('data.json', content)
      .catch(err => console.error(`Node.js ${env.version}에서 파일 쓰기 실패:`, err));
  });

  // 브라우저: localStorage 사용 및 용량 확인
  inBrowser((env) => {
    try {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (content.length > maxSize) {
        throw new Error('localStorage 용량 초과');
      }
      localStorage.setItem('data', content);
      console.log(`${env.browserName}에서 데이터 저장 완료`);
    } catch (err) {
      console.error('저장 실패:', err);
    }
  });

  // Bun: 네이티브 파일 API 활용
  inBun((env) => {
    try {
      Bun.write('data.json', content);
      console.log(`Bun ${env.version}에서 파일 작성 완료`);
    } catch (err) {
      console.error('Bun 쓰기 실패:', err);
    }
  });

  // Deno: 권한 관리와 함께 네이티브 API 사용
  inDeno((env) => {
    try {
      Deno.writeTextFileSync('data.json', content);
      console.log(`Deno ${env.version}에서 파일 작성 완료`);
    } catch (err) {
      console.error('Deno 쓰기 실패:', err);
    }
  });
```

### 오류 처리를 포함한 비동기 작업

```typescript
import { inNodejsAsync, inBrowserAsync } from "runtime-detector";

// 환경별 최적화된 API 클라이언트
class APIClient {
  async fetchData(endpoint: string) {
    // 브라우저: 타임아웃이 있는 네이티브 fetch 사용
    const browserData = await inBrowserAsync(async (env) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': `WebApp/${env.browserName}`,
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        console.error(`브라우저 fetch 실패:`, err);
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    });

    // Node.js: axios 사용 및 재시도 로직 구현
    const nodeData = await inNodejsAsync(async (env) => {
      const axios = require('axios');
      let retries = 3;
      
      while (retries > 0) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              'User-Agent': `NodeApp/${env.version}`,
              'Accept': 'application/json'
            },
            timeout: 5000
          });
          return response.data;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });

    return browserData || nodeData;
  }
}
```

### 기능 감지 및 최적화

```typescript
import { onNotNodejs, onNotBrowser } from "runtime-detector";

// 캐시 시스템 최적화 예제
function setupCache(data: any) {
  // 서버 환경에서 Redis 사용
  onNotBrowser(async (env) => {
    const Redis = require('redis');
    const client = Redis.createClient();
    
    try {
      await client.connect();
      await client.set('app:cache', JSON.stringify(data));
      console.log(`Redis 캐시가 ${env.name}에 설정됨`);
    } catch (err) {
      console.error(`${env.name}에서 캐시 설정 실패:`, err);
      // 메모리 캐시로 대체
      global.__cache = data;
    }
  });

  // 브라우저에서 IndexedDB 사용
  onBrowser((env) => {
    const request = indexedDB.open('appCache', 1);
    
    request.onerror = () => {
      console.error(`${env.browserName}에서 IndexedDB 실패`);
      // sessionStorage로 대체
      sessionStorage.setItem('cache', JSON.stringify(data));
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction('cache', 'readwrite');
      tx.objectStore('cache').put(data, 'appData');
    };
  });
}
```

## 📚 API 레퍼런스

### 환경 정보

- `currentEnv`: 현재 환경 상세 정보
  - `name`: 런타임 이름 (예: "Node.js", "Bun")
  - `version`: 런타임 버전
  - `browserName`: 브라우저 이름 (해당되는 경우)

### 환경 확인

```typescript
import {
  isBrowser,     // 브라우저 환경에서 true
  isNodejs,      // Node.js에서 true
  isBun,         // Bun에서 true
  isDeno,        // Deno에서 true
  isUnknown,     // 환경을 감지할 수 없을 때 true
  isNotBrowser,  // 브라우저가 아닌 환경에서 true
  isNotNodejs,   // Node.js가 아닌 환경에서 true
  isNotBun,      // Bun이 아닌 환경에서 true
  isNotDeno,     // Deno가 아닌 환경에서 true
  isNotUnknown   // 환경이 성공적으로 감지되었을 때 true
} from "runtime-detector";
```

### 동기 실행 API

#### 권장 함수 (Recommended)

| 함수                     | 설명                          |
| ------------------------ | ----------------------------- |
| `inBrowser(callback)`    | 브라우저에서 실행             |
| `inNodejs(callback)`     | Node.js에서 실행              |
| `inBun(callback)`        | Bun에서 실행                  |
| `inDeno(callback)`       | Deno에서 실행                 |
| `onNotBrowser(callback)` | 브라우저가 아닌 환경에서 실행 |
| `onNotNodejs(callback)`  | Node.js가 아닌 환경에서 실행  |
| `onNotBun(callback)`     | Bun이 아닌 환경에서 실행      |
| `onNotDeno(callback)`    | Deno가 아닌 환경에서 실행     |
| `onUnknown(callback)`    | 알 수 없는 환경에서 실행      |

#### 더 이상 사용되지 않는 함수 (Legacy Support)

> ⚠️ **Deprecated**: 이 함수들은 여전히 사용 가능하지만 향후 버전에서 제거될 예정입니다. 위의 권장 함수를 사용해 주세요.

| 함수                     | 권장 대안                 |
| ------------------------ | ------------------------- |
| `onBrowser(callback)`    | `inBrowser(callback)`     |
| `onNodejs(callback)`     | `inNodejs(callback)`      |
| `onBun(callback)`        | `inBun(callback)`         |
| `onDeno(callback)`       | `inDeno(callback)`        |

### 비동기 실행 API

#### 권장 함수 (Recommended)

| 함수                          | 설명                                 |
| ----------------------------- | ------------------------------------ |
| `inBrowserAsync(callback)`    | 브라우저에서 비동기 실행             |
| `inNodejsAsync(callback)`     | Node.js에서 비동기 실행              |
| `inBunAsync(callback)`        | Bun에서 비동기 실행                  |
| `inDenoAsync(callback)`       | Deno에서 비동기 실행                 |
| `onNotBrowserAsync(callback)` | 브라우저가 아닌 환경에서 비동기 실행 |
| `onNotNodejsAsync(callback)`  | Node.js가 아닌 환경에서 비동기 실행  |
| `onNotBunAsync(callback)`     | Bun이 아닌 환경에서 비동기 실행      |
| `onNotDenoAsync(callback)`    | Deno가 아닌 환경에서 비동기 실행     |
| `onUnknownAsync(callback)`    | 알 수 없는 환경에서 비동기 실행      |

#### 더 이상 사용되지 않는 함수 (Legacy Support)

> ⚠️ **Deprecated**: 이 함수들은 여전히 사용 가능하지만 향후 버전에서 제거될 예정입니다. 위의 권장 함수를 사용해 주세요.

| 함수                          | 권장 대안                        |
| ----------------------------- | -------------------------------- |
| `onBrowserAsync(callback)`    | `inBrowserAsync(callback)`       |
| `onNodejsAsync(callback)`     | `inNodejsAsync(callback)`        |
| `onBunAsync(callback)`        | `inBunAsync(callback)`           |
| `onDenoAsync(callback)`       | `inDenoAsync(callback)`          |

## 📋 릴리스 노트

### 1.2.1

- 📚 **문서화**: 포괄적인 JSDoc 개선
  - 모든 함수와 타입에 대한 상세한 JSDoc 주석 추가
  - 예제 및 사용법 문서 개선
  - 레거시 함수에 `@deprecated` 태그 추가
  - 타입 문서화 및 상호 참조 향상

- ✨ **API 개선**: 선호하는 함수 명명법 도입
  - 새로운 권장 함수들: `inBrowser`, `inNodejs`, `inBun`, `inDeno`, `inBrowserAsync` 등
  - 레거시 함수들 (`onBrowser`, `onNodejs` 등)은 더 이상 사용되지 않지만 여전히 지원
  - 새로운 환경 감지 플래그 추가: `isUnknown`, `isNotUnknown`
  - 모든 deprecated 함수에 적절한 마이그레이션 가이드 포함

### 1.2.0

- 🐛 **버그 수정**: `on*` 함수들이 잘못된 환경에서 실행될 수 있는 중요한 문제 해결
  - 이전에는 환경별 함수 내의 코드가 의도하지 않은 환경에서 실행될 수 있었음
  - 이제 코드 실행 전에 환경 검사를 엄격하게 수행
  - 모든 환경별 함수에 적용 (`onNodejs`, `onBrowser`, `onBun`, `onDeno` 등)

## 🤝 기여하기

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 📄 라이선스

[MIT 라이선스](LICENSE) - 여러분의 애플리케이션에 자유롭게 사용하실 수 있습니다.