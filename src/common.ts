export interface Location {
  column: number;
  line: number;
}

export interface NodeLocation {
  end?: Location;
  start: Location;
}

export interface Options {
  /** Syntax highlight the code. default: false */
  highlightCode?: boolean;
  /** The number of lines to show above the error. default: 2 */
  linesAbove?: number;
  /** The number of lines to show below the error. default: 3 */
  linesBelow?: number;

  startLine?: number;
  /** Forcibly syntax highlight the code. default: false */
  forceColor?: boolean;
  /** Display a message inline next to the highlighted location. default: nothing */
  message?: string;
}

export const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

type MarkerLines = Record<number, true | [number, number]>;

export function getMarkerLines(
  loc: NodeLocation,
  source: string[],
  opts: Options,
  startLineBaseZero: number
): {
  start: number;
  end: number;
  markerLines: MarkerLines;
} {
  const startLoc: Location = {
    column: loc.start?.column ?? (null as any),
    line: loc.start?.line ?? -1,
  };
  const endLoc: Location = {
    column: loc.end?.column ?? startLoc.column,
    line: loc.end?.line ?? startLoc.line,
  };
  const { linesAbove = 2, linesBelow = 3 } = opts || {};
  const startLine = startLoc.line - startLineBaseZero;
  const startColumn = startLoc.column;
  const endLine = endLoc.line - startLineBaseZero;
  const endColumn = endLoc.column;

  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);

  if (startLine === -1) {
    start = 0;
  }

  if (endLine === -1) {
    end = source.length;
  }

  const lineDiff = endLine - startLine;
  const markerLines: MarkerLines = {};

  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;

      if (startColumn == null) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLine = source[lineNumber - 1];
        const sourceLength = sourceLine ? sourceLine.length : 0;
        markerLines[lineNumber] = [
          startColumn,
          sourceLength - (startColumn > 0 ? startColumn - 1 : 0),
        ];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        const sourceLine = source[lineNumber - 1];
        const sourceLength = sourceLine ? sourceLine.length : 0;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn != null) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      const safeStart = startColumn ?? 0;
      const safeEnd = endColumn ?? safeStart;
      markerLines[startLine] = [safeStart, safeEnd - safeStart];
    }
  }

  return { start, end, markerLines };
}

interface Formatters {
  gutter: (input: string) => string;
  marker: (input: string) => string;
  message: (input: string) => string;
  reset: (input: string) => string;
}

const plainFormatters: Formatters = {
  gutter: (input) => input,
  marker: (input) => input,
  message: (input) => input,
  reset: (input) => input,
};

export function _codeFrameColumns(
  rawLines: string,
  loc: NodeLocation,
  opts: Options = {},
  colorOpts?: {
    defs: Formatters;
    highlight: (code: string) => string;
  }
): string {
  const { defs, highlight } = colorOpts || {
    defs: plainFormatters,
    highlight: (code) => code,
  };

  const startLineBaseZero = (opts.startLine || 1) - 1;

  const lines = rawLines.split(NEWLINE);
  const { start, end, markerLines } = getMarkerLines(loc, lines, opts, startLineBaseZero);
  const hasColumns = loc.start && typeof loc.start.column === 'number';

  const numberMaxWidth = String(end + startLineBaseZero).length;

  const highlightedLines = highlight(rawLines);

  let frame = highlightedLines
    .split(NEWLINE, end)
    .slice(start, end)
    .map((line, index) => {
      const number = start + 1 + index;
      const paddedNumber = `${number + startLineBaseZero}`.padStart(numberMaxWidth, ' ');
      const gutterStr = `  ${paddedNumber} |`;
      const gutterWithMarker = `> ${paddedNumber} |`;
      const hasMarker = markerLines[number];
      const lastMarkerLine = !markerLines[number + 1];
      if (hasMarker) {
        let markerLine = '';
        if (Array.isArray(hasMarker)) {
          const markerSpacing = line
            .slice(0, hasMarker[0] > 0 ? hasMarker[0] - 1 : 0)
            .replace(/[^\t]/g, ' ');
          const numberOfMarkers = hasMarker[1] || 1;
          const markerGutterSpacing = ' '.repeat(numberMaxWidth + 3) + '|';

          markerLine = [
            '\n',
            defs.gutter(markerGutterSpacing),
            ' ',
            markerSpacing,
            defs.marker('^'.repeat(numberOfMarkers)),
          ].join('');

          if (lastMarkerLine && opts.message) {
            markerLine += ' ' + defs.message(opts.message);
          }
        }
        return [defs.gutter(gutterWithMarker), line.length > 0 ? ` ${line}` : '', markerLine].join(
          ''
        );
      } else {
        return `${defs.gutter(gutterStr)}${line.length > 0 ? ` ${line}` : ''}`;
      }
    })
    .join('\n');

  if (opts.message && !hasColumns) {
    frame = `${' '.repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;
  }

  return defs.reset(frame);
}

export function getLineAndColumn(source: string, index: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
      column = 1;
    } else if (source[i] === '\r') {
      if (source[i + 1] === '\n') {
        i++;
      }
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

export function _createCodeFrame(
  source: string,
  index: number,
  options: Options,
  codeFrameColumnsFn: (rawLines: string, loc: NodeLocation, opts?: Options) => string
): string {
  if (typeof source !== 'string') {
    throw new TypeError('Source must be a string');
  }
  if (typeof index !== 'number' || index < 0) {
    throw new TypeError('Index must be a non-negative number');
  }

  const { line, column } = getLineAndColumn(source, index);
  const rawFrame = codeFrameColumnsFn(source, { start: { line, column } }, options);
  const paddedFrame = rawFrame
    .split(NEWLINE)
    .map((l) => '  ' + l)
    .join('\n');
  return '\n' + paddedFrame;
}
