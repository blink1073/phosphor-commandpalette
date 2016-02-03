/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


/**
 * A namespace which holds text scoring and matching functions.
 */
export
namespace StringSearch {
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
  function sumOfSquares(sourceText: string, queryText: string): number {
    let score = 0;
    for (let i = 0, j = 0, n = queryText.length; i < n; ++i, ++j) {
      j = sourceText.indexOf(queryText[i], j);
      if (j === -1) return -1;
      score += j * j;
    }
    return score;
  }
}
