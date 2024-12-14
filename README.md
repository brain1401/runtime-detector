# Runtime Detector

A lightweight runtime environment detector for Bun, Node.js, Deno and Browser environments.

## Features

- Zero dependencies
- TypeScript support
- Lightweight (About 7KB minified)
- Detects Bun, Node.js, Deno, and Browser environments
- Provides both synchronous and asynchronous APIs
- Type-safe environment-specific code execution

## Installation

```bash
npm install runtime-detector
```

## Usage

### Get Environment Information

```typescript
import { getCurrentEnvironment, isNodejs, isNotNodejs, onNodejs, onBrowser, onBun, onDeno } from "runtime-detector";

const env = getCurrentEnvironment();
console.log(`Current environment: ${env.name}, version: ${env.version}`);

if (isNodejs) {
  console.log(`Running in Node.js`);
}

if (isNotNodejs) {
  console.log(`Running in non-Node.js environment`);
}
```

### Execute Code depending on environment

```typescript
import { onNodejs, onBrowser, onBun, onDeno } from "runtime-detector";
// Execute only in Node.js environment
onNodejs((env) => {
  console.log(`Running in Node.js ${env.version}`);
});

// Execute only in Browser environment
onBrowser((env) => {
  document.querySelector('#app');
  console.log(`Running in Browser ${env.version}`);
});

// Execute only in Bun environment
onBun((env) => {
  const file = Bun.file('./example.txt');
  console.log(`Running in Bun ${env.version}`);
});

// Execute only in Deno environment
onDeno((env) => {
  console.log(`Running in Deno ${env.version}`);
});
```

### Execute Asynchronous Code depending on environment

```typescript
import { onNodejsAsync } from "runtime-detector";

// Execute only in Node.js environment
await onNodejsAsync(async (env) => {
  const response = await fetch('https://api.example.com');
  const data = await response.json();
  console.log(data);
});

```

### Execute Code with Return Value

```typescript
import { onNodejs } from "runtime-detector";

const result = onNodejs((env) => {
  return `Result from Node.js ${env.version}`;
});

// result will be undefined if not in Node.js environment
if (result) {
  console.log(result);
}
```

### Execute Code when not in specific environment

```typescript
import { onNotNodejs, onNotBrowser } from "runtime-detector";

// Execute when not in Node.js environment
onNotNodejs((env) => {
  console.log(`Running in ${env.name} environment (not Node.js)`);
});

// Execute when not in Browser environment
onNotBrowser((env) => {
  console.log(`Running in ${env.name} environment (not Browser)`);
});

```

## API

### Environment Detection

- `getCurrentEnvironment()`: Returns current environment information
- `isBrowser`: Boolean indicating browser environment
- `isNodejs`: Boolean indicating Node.js environment
- `isBun`: Boolean indicating Bun environment
- `isDeno`: Boolean indicating Deno environment

### Synchronous APIs

- `onBrowser(callback)`: Execute code in browser environment
- `onNodejs(callback)`: Execute code in Node.js environment
- `onBun(callback)`: Execute code in Bun environment
- `onDeno(callback)`: Execute code in Deno environment
- `onNotNodejs(callback)`: Execute code in non-Node.js environment
- `onNotBrowser(callback)`: Execute code in non-browser environment
- `onNotBun(callback)`: Execute code in non-Bun environment
- `onNotDeno(callback)`: Execute code in non-Deno environment

### Asynchronous APIs

- `onBrowserAsync(callback)`: Execute async code in browser environment
- `onNodejsAsync(callback)`: Execute async code in Node.js environment
- `onBunAsync(callback)`: Execute async code in Bun environment
- `onDenoAsync(callback)`: Execute async code in Deno environment
- `onNotNodejsAsync(callback)`: Execute async code in non-Node.js environment
- `onNotBrowserAsync(callback)`: Execute async code in non-browser environment
- `onNotBunAsync(callback)`: Execute async code in non-Bun environment
- `onNotDenoAsync(callback)`: Execute async code in non-Deno environment

## License

MIT

---

# Runtime Detector (한국어)

Bun, Node.js, Deno, 브라우저 환경을 감지하는 라이브러리입니다.

## 특징

- 의존성 없음
- TypeScript 지원
- 가벼움 (7KB minified)
- Bun, Node.js, Deno, 브라우저 환경을 감지
- 동기, 비동기 모두 지원
- 환경별 코드 실행 타입 안전

## 설치

```bash
npm install runtime-detector
```

## 사용법

### 현재 환경 정보 확인하기

```typescript
import { getCurrentEnvironment, isNodejs, isNotNodejs } from "runtime-detector";

const env = getCurrentEnvironment();
console.log(`현재 환경: ${env.name}, 버전: ${env.version}`);

if (isNodejs) {
  console.log(`Node.js 환경에서 실행 중`);
}

if (isNotNodejs) {
  console.log(`Node.js가 아닌 환경에서 실행 중`);
}
```

### 동기 코드 실행하기

```typescript
import { onNodejs, onBrowser, onBun, onDeno } from "runtime-detector";

// Node.js 환경에서만 실행
onNodejs((env) => {
  console.log(`Node.js ${env.version}에서 실행 중`);
});

// 브라우저 환경에서만 실행
onBrowser((env) => {
  document.querySelector('#app');
  console.log(`브라우저 ${env.version}에서 실행 중`);
});

// Bun 환경에서만 실행
onBun((env) => {
  const file = Bun.file('./example.txt');
  console.log(`Bun ${env.version}에서 실행 중`);
});

// Deno 환경에서만 실행
onDeno((env) => {
  console.log(`Deno ${env.version}에서 실행 중`);
});
```

### 비동기 코드 실행하기

```typescript
import { onNodejsAsync } from "runtime-detector";

// Node.js 환경에서만 실행
await onNodejsAsync(async (env) => {
  const response = await fetch('https://api.example.com');
  const data = await response.json();
  console.log(data);
});
```

### 반환값이 있는 코드 실행하기

```typescript
import { onNodejs } from "runtime-detector";

const result = onNodejs((env) => {
  return `Node.js ${env.version}에서 실행된 결과`;
});

// result는 Node.js 환경이 아닐 경우 undefined가 됨
if (result) {
  console.log(result);
}
```

### 특정 환경이 아닐 때 실행하기

```typescript
import { onNotNodejs, onNotBrowser } from "runtime-detector";

// Node.js가 아닌 환경에서 실행
onNotNodejs((env) => {
  console.log(`Node.js가 아닌 ${env.name} 환경에서 실행 중`);
});

onNotBrowser((env) => {
  console.log(`브라우저가 아닌 ${env.name} 환경에서 실행 중`);
});
```

## API

### 환경 감지

- `getCurrentEnvironment()`: 현재 환경 정보 반환
- `isBrowser`: 브라우저 환경인지 나타내는 불리언
- `isNodejs`: Node.js 환경인지 나타내는 불리언
- `isBun`: Bun 환경인지 나타내는 불리언
- `isDeno`: Deno 환경인지 나타내는 불리언

### 동기식 API

- `onBrowser(callback)`: 브라우저 환경에서 코드 실행
- `onNodejs(callback)`: Node.js 환경에서 코드 실행
- `onBun(callback)`: Bun 환경에서 코드 실행
- `onDeno(callback)`: Deno 환경에서 코드 실행
- `onNotNodejs(callback)`: Node.js가 아닌 환경에서 코드 실행
- `onNotBrowser(callback)`: 브라우저가 아닌 환경에서 코드 실행
- `onNotBun(callback)`: Bun이 아닌 환경에서 코드 실행
- `onNotDeno(callback)`: Deno가 아닌 환경에서 코드 실행

### 비동기식 API

- `onBrowserAsync(callback)`: 브라우저 환경에서 비동기 코드 실행
- `onNodejsAsync(callback)`: Node.js 환경에서 비동기 코드 실행
- `onBunAsync(callback)`: Bun 환경에서 비동기 코드 실행
- `onDenoAsync(callback)`: Deno 환경에서 비동기 코드 실행
- `onNotNodejsAsync(callback)`: Node.js가 아닌 환경에서 비동기 코드 실행
- `onNotBrowserAsync(callback)`: 브라우저가 아닌 환경에서 비동기 코드 실행
- `onNotBunAsync(callback)`: Bun이 아닌 환경에서 비동기 코드 실행
- `onNotDenoAsync(callback)`: Deno가 아닌 환경에서 비동기 코드 실행

## 라이선스

MIT
