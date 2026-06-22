import {
  _codeFrameColumns,
  _createCodeFrame,
  getLineAndColumn,
  type NodeLocation,
  type Options,
} from './common';

export type { Location, NodeLocation, Options } from './common';
export { getLineAndColumn };

export function codeFrameColumns(rawLines: string, loc: NodeLocation, opts: Options = {}): string {
  return _codeFrameColumns(rawLines, loc, opts);
}

export function highlight(code: string): string {
  return code;
}

/**
 * Generates a visual terminal pointer (code frame) for an index in a source string.
 */
export function createCodeFrame(source: string, index: number, options: Options = {}): string {
  return _createCodeFrame(source, index, options, codeFrameColumns);
}
