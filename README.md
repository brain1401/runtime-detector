# Runtime Detector

[![npm version](https://img.shields.io/npm/v/runtime-detector.svg)](https://www.npmjs.com/package/runtime-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/runtime-detector)](https://bundlephobia.com/package/runtime-detector)

A lightweight, type-safe runtime environment detector for JavaScript/TypeScript applications. Easily detect and handle code execution in Bun, Node.js, Deno, and Browser environments.

## 🚀 Key Features

- **Zero Dependencies**: No external dependencies for maximum reliability
- **TypeScript Ready**: Full TypeScript support with type definitions included
- **Lightweight**: Only ~7KB minified
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

// Get current environment info
const { name, version, browserName } = currentEnv;

console.log(`Runtime: ${name} v${version}`);
// Example output: "Runtime: Node.js v18.15.0"

// Use boolean flags for conditional logic
if (isNodejs) {
  // Node.js specific code
}

if (isBrowser) {
  // Browser specific code
  console.log(`Browser: ${browserName}`); // e.g., "Chrome", "Firefox"
}
```

### Environment-Specific Code Execution

```typescript
import { onNodejs, onBrowser, onBun, onDeno } from "runtime-detector";

// Node.js Environment
onNodejs((env) => {
  const fs = require('fs');
  console.log(`Running in Node.js ${env.version}`);
});

// Browser Environment
onBrowser((env) => {
  const element = document.querySelector('#app');
  console.log(`Running in ${env.browserName} ${env.version}`);
});

// Bun Environment
onBun((env) => {
  const file = Bun.file('./data.txt');
  console.log(`Running in Bun ${env.version}`);
});

// Deno Environment
onDeno((env) => {
  const text = Deno.readTextFileSync('./data.txt');
  console.log(`Running in Deno ${env.version}`);
});
```

### Async Operations

```typescript
import { onNodejsAsync, onBrowserAsync } from "runtime-detector";

// Async Node.js Example
await onNodejsAsync(async (env) => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
});

// Async Browser Example
await onBrowserAsync(async (env) => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
});
```

### Negative Conditions

```typescript
import { onNotNodejs, onNotBrowser } from "runtime-detector";

// Execute in any non-Node.js environment
onNotNodejs((env) => {
  console.log(`Running in ${env.name} (not Node.js)`);
});

// Execute in any non-Browser environment
onNotBrowser((env) => {
  console.log(`Running in ${env.name} (not Browser)`);
});
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
  isBrowser,  // true in browser environments
  isNodejs,   // true in Node.js
  isBun,      // true in Bun
  isDeno      // true in Deno
} from "runtime-detector";
```

### Synchronous Execution APIs

| Function                 | Description            |
| ------------------------ | ---------------------- |
| `onBrowser(callback)`    | Execute in browser     |
| `onNodejs(callback)`     | Execute in Node.js     |
| `onBun(callback)`        | Execute in Bun         |
| `onDeno(callback)`       | Execute in Deno        |
| `onNotBrowser(callback)` | Execute in non-browser |
| `onNotNodejs(callback)`  | Execute in non-Node.js |
| `onNotBun(callback)`     | Execute in non-Bun     |
| `onNotDeno(callback)`    | Execute in non-Deno    |

### Asynchronous Execution APIs

| Function                      | Description                  |
| ----------------------------- | ---------------------------- |
| `onBrowserAsync(callback)`    | Async execute in browser     |
| `onNodejsAsync(callback)`     | Async execute in Node.js     |
| `onBunAsync(callback)`        | Async execute in Bun         |
| `onDenoAsync(callback)`       | Async execute in Deno        |
| `onNotBrowserAsync(callback)` | Async execute in non-browser |
| `onNotNodejsAsync(callback)`  | Async execute in non-Node.js |
| `onNotBunAsync(callback)`     | Async execute in non-Bun     |
| `onNotDenoAsync(callback)`    | Async execute in non-Deno    |

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

- **의존성 없음**: 외부 의존성이 전혀 없어 안정적
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
import { onNodejs, onBrowser, onBun, onDeno } from "runtime-detector";

// 다양한 환경에서의 파일 처리
function saveData(content: string) {
  // Node.js: fs 모듈 사용 및 오류 처리
  onNodejs((env) => {
    const fs = require('fs').promises;
    return fs.writeFile('data.json', content)
      .catch(err => console.error(`Node.js ${env.version}에서 파일 쓰기 실패:`, err));
  });

  // 브라우저: localStorage 사용 및 용량 확인
  onBrowser((env) => {
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
  onBun((env) => {
    try {
      Bun.write('data.json', content);
      console.log(`Bun ${env.version}에서 파일 작성 완료`);
    } catch (err) {
      console.error('Bun 쓰기 실패:', err);
    }
  });

  // Deno: 권한 관리와 함께 네이티브 API 사용
  onDeno((env) => {
    try {
      Deno.writeTextFileSync('data.json', content);
      console.log(`Deno ${env.version}에서 파일 작성 완료`);
    } catch (err) {
      console.error('Deno 쓰기 실패:', err);
    }
  });
}
```

### 오류 처리를 포함한 비동기 작업

```typescript
import { onNodejsAsync, onBrowserAsync } from "runtime-detector";

// 환경별 최적화된 API 클라이언트
class APIClient {
  async fetchData(endpoint: string) {
    // 브라우저: 타임아웃이 있는 네이티브 fetch 사용
    const browserData = await onBrowserAsync(async (env) => {
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
    const nodeData = await onNodejsAsync(async (env) => {
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

### 오류 처리를 포함한 비동기 작업

```typescript
import { onNodejsAsync, onBrowserAsync } from "runtime-detector";

// 환경별 최적화된 API 클라이언트
class APIClient {
  async fetchData(endpoint: string) {
    // 브라우저: 타임아웃이 있는 네이티브 fetch 사용
    const browserData = await onBrowserAsync(async (env) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': `WebApp/${env.browserName}

## 📚 API 레퍼런스

### 환경 정보

- `currentEnv`: 현재 환경 상세 정보
  - `name`: 런타임 이름 (예: "Node.js", "Bun")
  - `version`: 런타임 버전
  - `browserName`: 브라우저 이름 (해당되는 경우)

### 환경 확인

```typescript
import {
  isBrowser,  // 브라우저 환경에서 true
  isNodejs,   // Node.js에서 true
  isBun,      // Bun에서 true
  isDeno      // Deno에서 true
} from "runtime-detector";
```

### 동기 실행 API

| 함수                     | 설명                          |
| ------------------------ | ----------------------------- |
| `onBrowser(callback)`    | 브라우저에서 실행             |
| `onNodejs(callback)`     | Node.js에서 실행              |
| `onBun(callback)`        | Bun에서 실행                  |
| `onDeno(callback)`       | Deno에서 실행                 |
| `onNotBrowser(callback)` | 브라우저가 아닌 환경에서 실행 |
| `onNotNodejs(callback)`  | Node.js가 아닌 환경에서 실행  |
| `onNotBun(callback)`     | Bun이 아닌 환경에서 실행      |
| `onNotDeno(callback)`    | Deno가 아닌 환경에서 실행     |

### 비동기 실행 API

| 함수                          | 설명                                 |
| ----------------------------- | ------------------------------------ |
| `onBrowserAsync(callback)`    | 브라우저에서 비동기 실행             |
| `onNodejsAsync(callback)`     | Node.js에서 비동기 실행              |
| `onBunAsync(callback)`        | Bun에서 비동기 실행                  |
| `onDenoAsync(callback)`       | Deno에서 비동기 실행                 |
| `onNotBrowserAsync(callback)` | 브라우저가 아닌 환경에서 비동기 실행 |
| `onNotNodejsAsync(callback)`  | Node.js가 아닌 환경에서 비동기 실행  |
| `onNotBunAsync(callback)`     | Bun이 아닌 환경에서 비동기 실행      |
| `onNotDenoAsync(callback)`    | Deno가 아닌 환경에서 비동기 실행     |

## 🤝 기여하기

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 📄 라이선스

[MIT 라이선스](LICENSE) - 여러분의 애플리케이션에 자유롭게 사용하실 수 있습니다.