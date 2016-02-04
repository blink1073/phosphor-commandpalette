/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


/**
 * The prefix that prepends a matched character in a search result.
 */
const PREFIX = '<em>';

/**
 * The suffix that affixed onto a matched character in a search result.
 */
const SUFFIX = '</em>';

/**
 * A namespace which holds text scoring and matching functions.
 */
export
namespace StringSearch {
  /**
   * The result of a `StringSearch.sumOfSquares` search.
   */
  export
  interface IStringSearchResult {
    /**
     * The search score, lower is better.
     */
    score: number;
    /**
     * The matching indices of the original string that coincide with the query.
     */
    indices: number[];
  }

  /**
   * Highlight the matched characters of a source string.
   *
   * @param sourceText - The text which should be searched.
   *
   * @param indices - The indices of the matched characters.
   *
   * @returns a string with interpolated `<em>` tags for each matched index.
   */
  export
  function highlight(sourceText: string, indices: number[]): string {
    if (!indices.length) return sourceText;
    let last = 0;
    let result = '';
    for (let i of indices) {
      result += sourceText.slice(last, i) + PREFIX + sourceText[i] + SUFFIX;
      last = i + 1;
    }
    return result + sourceText.slice(last);
  }

  /**
   * Compute the sum-of-squares score for the given search text.
   *
   * @param sourceText - The text which should be searched.
   *
   * @param queryText - The query text to locate in the source text.
   *
   * @returns A score which indicates how strongly the query text matches
   *   the source text. A lower score indicates a stronger match. Zero is
   *   the lowest possible matched score. `-1` is returned for no match.
   *
   * #### Notes
   * This scoring algorithm uses a sum-of-squares approach to determine
   * the score. In order for there to be a match, all of the characters
   * in `queryText` **must** appear in `sourceText` in order. The index
   * of each matching character is squared and added to the score. This
   * means that early and consecutive character matches are preferred.
   *
   * The character match is performed with strict equality. It is case
   * sensitive and does not ignore whitespace. If those behaviors are
   * required, the text should be transformed before scoring.
   *
   * This has a runtime complexity of `O(n)` on `sourceText`.
   */
  export
  function sumOfSquares(sourceText: string, queryText: string): IStringSearchResult {
    let result: IStringSearchResult = { score: 0, indices: [] };
    for (let i = 0, j = 0, n = queryText.length; i < n; ++i, ++j) {
      j = sourceText.indexOf(queryText[i], j);
      if (j === -1) return { score: -1, indices: [] };
      result.indices.push(j);
      result.score += j * j;
    }
    return result;
  }
}
