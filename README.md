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

```typescript
import {
  getCurrentEnvironment,
  onNodejs,
  onBun,
  onDeno,
  onBrowser,
  onNodejsAsync,
} from "runtime-detector";

// Get current environment info
const env = getCurrentEnvironment();
console.log(`Current environment: ${env.name}, version: ${env.version}`);

// Synchronous environment-specific code
onNodejs((env) => {
  console.log(`Running in Node.js ${env.version}`);
});

// Synchronous environment-specific code with return value
const result = onNodejs((env) => {
  return `Running in Node.js ${env.version}`;
});

result && console.log(result);

// Asynchronous environment-specific code
onNodejsAsync(async (env) => {
  const result = await fetch("https://api.example.com");
  const json = await result.json();
  console.log(json);
});

// Asynchronous environment-specific code with return value

// the result variable can be undefined if the environment is not Node.js
const result = await onNodejsAsync(async (env) => {
  const result = await fetch("https://api.example.com");
  const json = await result.json();
  return json;
});

result && console.log(result);

// Other environment checks
onBun((env) => {
  console.log(`Running in Bun ${env.version}`);
});

onDeno((env) => {
  console.log(`Running in Deno ${env.version}`);
});

onBrowser((env) => {
  console.log(`Running in Browser ${env.version}`);
});

// If you want to check if the environment is not Bun
onNotBun((env) => {
  console.log(`Running in non-Bun environment ${env.name} ${env.version}`);
});

// If you want to check if the environment is not Deno
onNotDeno((env) => {
  console.log(`Running in non-Deno environment ${env.name} ${env.version}`);
});

// If you want to check if the environment is not Browser
onNotBrowser((env) => {
  console.log(`Running in non-Browser environment ${env.name} ${env.version}`);
});

// If you want to check if the environment is not Node.js
onNotNodejs((env) => {
  console.log(`Running in non-Node.js environment ${env.name} ${env.version}`);
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

### Asynchronous APIs

- `onBrowserAsync(callback)`: Execute async code in browser environment
- `onNodejsAsync(callback)`: Execute async code in Node.js environment
- `onBunAsync(callback)`: Execute async code in Bun environment
- `onDenoAsync(callback)`: Execute async code in Deno environment

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

```typescript
import {
  getCurrentEnvironment,
  onNodejs,
  onBun,
  onDeno,
  onBrowser,
  onNodejsAsync,
} from "runtime-detector";

// 현재 환경 정보 가져오기
const env = getCurrentEnvironment();
console.log(`현재 환경: ${env.name}, 버전: ${env.version}`);

// 동기식 환경별 코드
onNodejs((env) => {
  console.log(`Node.js ${env.version}에서 실행 중`);
});

// 반환값이 있는 동기식 환경별 코드 
const result = onNodejs((env) => {
  return `Node.js ${env.version}에서 실행 중`;
});

result && console.log(result);

// 비동기식 환경별 코드
onNodejsAsync(async (env) => {
  const result = await fetch("https://api.example.com");
  const json = await result.json();
  console.log(json);
});

// 반환값이 있는 비동기식 환경별 코드

// result 변수는 Node.js 환경이 아닐 경우 undefined가 될 수 있음
const result = await onNodejsAsync(async (env) => {
  const result = await fetch("https://api.example.com");
  const json = await result.json();
  return json;
});

result && console.log(result);

// 다른 환경 체크
onBun((env) => {
  console.log(`Bun ${env.version}에서 실행 중`);
});

onDeno((env) => {
  console.log(`Deno ${env.version}에서 실행 중`);
});

onBrowser((env) => {
  console.log(`브라우저 ${env.version}에서 실행 중`);
});

// Bun이 아닌 환경인지 확인하고 싶을 때
onNotBun((env) => {
  console.log(`Bun이 아닌 환경 ${env.name} ${env.version}에서 실행 중`);
});

// Deno가 아닌 환경인지 확인하고 싶을 때
onNotDeno((env) => {
  console.log(`Deno가 아닌 환경 ${env.name} ${env.version}에서 실행 중`);
});

// 브라우저가 아닌 환경인지 확인하고 싶을 때
onNotBrowser((env) => {
  console.log(`브라우저가 아닌 환경 ${env.name} ${env.version}에서 실행 중`);
});

// Node.js가 아닌 환경인지 확인하고 싶을 때
onNotNodejs((env) => {
  console.log(`Node.js가 아닌 환경 ${env.name} ${env.version}에서 실행 중`);
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

### 비동기식 API

- `onBrowserAsync(callback)`: 브라우저 환경에서 비동기 코드 실행
- `onNodejsAsync(callback)`: Node.js 환경에서 비동기 코드 실행
- `onBunAsync(callback)`: Bun 환경에서 비동기 코드 실행
- `onDenoAsync(callback)`: Deno 환경에서 비동기 코드 실행

## 라이선스

MIT

