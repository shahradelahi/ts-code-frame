import jsTokens, { Token as JSToken } from 'js-tokens';

import { defs, type InternalTokenType } from './defs';

const sometimesKeywords = new Set(['as', 'async', 'from', 'get', 'of', 'set']);

type Token = {
  type: InternalTokenType | 'uncolored';
  value: string;
};

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
const BRACKET = /^[()[\]{}]$/;

function isKeyword(val: string): boolean {
  return (
    sometimesKeywords.has(val) ||
    /^(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|let|static|await)$/.test(
      val
    )
  );
}

const getTokenType = function (token: JSToken): InternalTokenType | 'uncolored' {
  if (token.type === 'IdentifierName') {
    const tokenValue = token.value;
    if (isKeyword(tokenValue)) {
      return 'keyword';
    }

    const firstChar = tokenValue.charCodeAt(0);
    if (firstChar >= 65 && firstChar <= 90) {
      return 'capitalized';
    }
    if (tokenValue !== tokenValue.toLowerCase()) {
      return 'capitalized';
    }
  }

  if (token.type === 'Punctuator' && BRACKET.test(token.value)) {
    return 'uncolored';
  }

  if (token.type === 'Invalid' && token.value === '@') {
    return 'punctuator';
  }

  switch (token.type as string) {
    case 'NumericLiteral':
      return 'number';

    case 'StringLiteral':
    case 'JSXString':
    case 'NoSubstitutionTemplate':
      return 'string';

    case 'RegularExpressionLiteral':
      return 'regex';

    case 'Punctuator':
    case 'JSXPunctuator':
      return 'punctuator';

    case 'MultiLineComment':
    case 'SingleLineComment':
      return 'comment';

    case 'Invalid':
    case 'JSXInvalid':
      return 'invalid';

    case 'JSXIdentifier':
      return 'jsxIdentifier';

    default:
      return 'uncolored';
  }
};

function* tokenize(text: string): Generator<Token> {
  for (const token of jsTokens(text, { jsx: true })) {
    switch (token.type) {
      case 'TemplateHead':
        yield { type: 'string', value: token.value.slice(0, -2) };
        yield { type: 'punctuator', value: '${' };
        break;

      case 'TemplateMiddle':
        yield { type: 'punctuator', value: '}' };
        yield { type: 'string', value: token.value.slice(1, -2) };
        yield { type: 'punctuator', value: '${' };
        break;

      case 'TemplateTail':
        yield { type: 'punctuator', value: '}' };
        yield { type: 'string', value: token.value.slice(1) };
        break;

      default:
        yield {
          type: getTokenType(token as any),
          value: token.value,
        };
    }
  }
}

export function highlight(text: string): string {
  if (text === '') return '';

  let highlighted = '';

  for (const { type, value } of tokenize(text)) {
    if (type in defs) {
      highlighted += value
        .split(NEWLINE)
        .map((str) => defs[type as InternalTokenType](str))
        .join('\n');
    } else {
      highlighted += value;
    }
  }

  return highlighted;
}
