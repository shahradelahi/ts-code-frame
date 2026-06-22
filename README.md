<h1 align="center">
  <sup>ts-code-frame</sup>
  <br>
  <a href="https://github.com/shahradelahi/ts-code-frame/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/ts-code-frame/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@se-oss/code-frame"><img src="https://img.shields.io/npm/v/@se-oss/code-frame.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/@se-oss/code-frame"><img src="https://img.shields.io/bundlephobia/minzip/@se-oss/code-frame" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=@se-oss/code-frame"><img src="https://packagephobia.com/badge?p=@se-oss/code-frame" alt="Install Size"></a>
</h1>

_ts-code-frame_ is a visual terminal code frame pointer generator.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
pnpm add @se-oss/code-frame
```

<details>
<summary>Install using your favorite package manager</summary>

**npm**

```bash
npm install @se-oss/code-frame
```

**yarn**

```bash
yarn add @se-oss/code-frame
```

</details>

## 📖 Usage

### Basic Usage

Use `createCodeFrame` to generate a pointer at a specific string index.

```ts
import { createCodeFrame } from '@se-oss/code-frame';

const code = 'const a = 1;\nconst b = 2;\nconst c = 3;';
const result = createCodeFrame(code, 15);
console.log(result);
```

### Advanced Code Frame

Use `codeFrameColumns` to specify exact line and column ranges.

```ts
import { codeFrameColumns } from '@se-oss/code-frame';

const code = 'const a = 1;\nconst b = 2;\nconst c = 3;';
const result = codeFrameColumns(code, {
  start: { line: 2, column: 7 },
  end: { line: 2, column: 8 },
});
console.log(result);
```

### Inline Messages

Add custom messages pointing to the error location.

```ts
const result = codeFrameColumns(
  code,
  { start: { line: 2, column: 7 } },
  { message: 'Unexpected token' }
);
```

### Syntax Highlighting

Enable colored output using native node utility styling.

```ts
const result = codeFrameColumns(
  code,
  { start: { line: 2, column: 7 } },
  { highlightCode: true }
);
```

### Custom Line Boundaries

Control context windows above and below the error.

```ts
const result = codeFrameColumns(
  code,
  { start: { line: 2, column: 7 } },
  {
    linesAbove: 1,
    linesBelow: 1,
  }
);
```

### Highlight Utility

Manually syntax highlight code snippets.

```ts
import { highlight } from '@se-oss/code-frame';

const colored = highlight('const x = 42;');
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/code-frame).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-code-frame).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-code-frame/graphs/contributors).
