import { styleText } from 'node:util';

export function isColorSupported(): boolean {
  try {
    return styleText('red', '-') !== '-';
  } catch {
    return false;
  }
}

export type InternalTokenType =
  | 'keyword'
  | 'capitalized'
  | 'jsxIdentifier'
  | 'punctuator'
  | 'number'
  | 'string'
  | 'regex'
  | 'comment'
  | 'invalid';

type UITokens = 'gutter' | 'marker' | 'message';
type Formatter = (input: string) => string;

export type Defs = Record<InternalTokenType | UITokens | 'reset', Formatter>;

function createFormatter(format: any): Formatter {
  return (input: string) => {
    try {
      return styleText(format, String(input ?? ''), { validateStream: false } as any);
    } catch {
      return String(input ?? '');
    }
  };
}

export const defs: Defs = {
  keyword: createFormatter('cyan'),
  capitalized: createFormatter('yellow'),
  jsxIdentifier: createFormatter('yellow'),
  punctuator: createFormatter('yellow'),
  number: createFormatter('magenta'),
  string: createFormatter('green'),
  regex: createFormatter('magenta'),
  comment: createFormatter('gray'),
  invalid: createFormatter(['white', 'bgRed', 'bold']),

  gutter: createFormatter('gray'),
  marker: createFormatter(['red', 'bold']),
  message: createFormatter(['red', 'bold']),

  reset: createFormatter('reset'),
};
