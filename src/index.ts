import {
  _codeFrameColumns,
  _createCodeFrame,
  getLineAndColumn,
  type NodeLocation,
  type Options,
} from './common';
import { defs, isColorSupported } from './defs';
import { highlight } from './highlight';

export type { Location, NodeLocation, Options } from './common';
export { highlight, getLineAndColumn };

export function codeFrameColumns(rawLines: string, loc: NodeLocation, opts: Options = {}): string {
  const shouldHighlight = opts.forceColor || (isColorSupported() && opts.highlightCode);

  return _codeFrameColumns(
    rawLines,
    loc,
    opts,
    shouldHighlight
      ? {
          defs,
          highlight,
        }
      : undefined
  );
}

/**
 * Generates a visual terminal pointer (code frame) for an index in a source string.
 */
export function createCodeFrame(source: string, index: number, options: Options = {}): string {
  return _createCodeFrame(source, index, options, codeFrameColumns);
}
