import { describe, expect, it } from 'vitest';

import { codeFrameColumns, createCodeFrame } from './index';

describe('createCodeFrame (backward compatibility)', () => {
  it('should generate a correct code frame', () => {
    const result = createCodeFrame('src/components/[a-z/*.ts', 15);
    expect(result).toBe('\n  > 1 | src/components/[a-z/*.ts\n      |                ^');
  });

  it('should handle zero index', () => {
    const result = createCodeFrame('abc', 0);
    expect(result).toBe('\n  > 1 | abc\n      | ^');
  });

  it('should throw TypeError for invalid inputs', () => {
    expect(() => createCodeFrame(null as any, 10)).toThrow(TypeError);
    expect(() => createCodeFrame('abc', -1)).toThrow(TypeError);
    expect(() => createCodeFrame('abc', 'abc' as any)).toThrow(TypeError);
  });
});

describe('codeFrameColumns (advanced features)', () => {
  const code = ['const a = 1;', 'const b = 2;', 'const c = 3;'].join('\n');

  it('should render a basic single-line marker', () => {
    const result = codeFrameColumns(code, { start: { line: 2, column: 7 } });
    expect(result).toBe(
      ['  1 | const a = 1;', '> 2 | const b = 2;', '    |       ^', '  3 | const c = 3;'].join('\n')
    );
  });

  it('should render a multi-line range marker', () => {
    const result = codeFrameColumns(code, {
      start: { line: 1, column: 7 },
      end: { line: 2, column: 9 },
    });
    expect(result).toBe(
      [
        '> 1 | const a = 1;',
        '    |       ^^^^^^',
        '> 2 | const b = 2;',
        '    | ^^^^^^^^^',
        '  3 | const c = 3;',
      ].join('\n')
    );
  });

  it('should render an inline message', () => {
    const result = codeFrameColumns(
      code,
      { start: { line: 2, column: 7 } },
      {
        message: 'Unexpected token',
      }
    );
    expect(result).toBe(
      [
        '  1 | const a = 1;',
        '> 2 | const b = 2;',
        '    |       ^ Unexpected token',
        '  3 | const c = 3;',
      ].join('\n')
    );
  });

  it('should handle custom linesAbove and linesBelow', () => {
    const result = codeFrameColumns(
      code,
      { start: { line: 2, column: 7 } },
      {
        linesAbove: 0,
        linesBelow: 0,
      }
    );
    expect(result).toBe(['> 2 | const b = 2;', '    |       ^'].join('\n'));
  });
});
