/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  CommandItem
} from 'phosphor-command';

import {
  ISignal, Signal
} from 'phosphor-signaling';


/**
 *
 */
export
interface ISearchResultSection {
  /**
   *
   */
  title: string;

  /**
   *
   */
  category: string;

  /**
   *
   */
  items: CommandItem[];
}


/**
 *
 */
export
abstract class CommandSource {
  /**
   *
   */
  abstract search(category: string, text: string): ISearchResultSection[];

  /**
   *
   */
  get changed(): ISignal<CommandSource, void> {
    return CommandSourcePrivate.changedSignal.bind(this);
  }
}


/**
 *
 */
export
class SimpleSource extends CommandSource {
  /**
   *
   */
  add(items: CommandItem[]): void {
    Array.prototype.push.apply(this._items, items);
  }

  /**
   *
   */
  search(category: string, text: string): ISearchResultSection[] {
    let items = search(text, this._items);
    return [{ title: 'All', category: '', items }];
  }

  private _items: CommandItem[] = [];
}



interface IMatch {
  score: number;
  item: CommandItem;
}


function search(query: string, items: CommandItem[]): CommandItem[] {
  let matches: IMatch[] = [];
  query = query.replace(/\s*/g, '').toLowerCase();
  for (let item of items) {
    let text = item.text.replace(/\s*/g, '').toLowerCase();
    let score = computeScore(query, text);
    if (score !== -1) matches.push({ score, item });
  }
  return matches.sort(matchSort).map(match => match.item);
}


function matchSort(a: IMatch, b: IMatch): number {
  return a.score - b.score;
}


function computeScore(query: string, text: string): number {
  let score = 0;
  for (let i = 0, j = 0, n = query.length; i < n; ++i, ++j) {
    j = findChar(query[i], text, j);
    if (j === -1) {
      return -1;
    }
    score += j * j;
  }
  return score;
}


function findChar(char: string, text: string, start: number): number {
  for (let i = start, n = text.length; i < n; ++i) {
    if (text[i] === char) return i;
  }
  return -1;
}


/**
 *
 */
namespace CommandSourcePrivate {
  /**
   *
   */
  export
  const changedSignal = new Signal<CommandSource, void>();
}
