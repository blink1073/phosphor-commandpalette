/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import * as arrays
  from 'phosphor-arrays';

import {
  AbstractPaletteModel, ICommandResult, ISearchResult, SearchResultType
} from './abstractmodel';

import {
  StringSearch
} from './stringsearch';


/**
 * An options object for initializing a standard palette item.
 */
export
interface IStandardPaletteItemOptions {
  /**
   * The text for the item.
   *
   * #### Notes
   * This is the primary text for the item in a palette.
   */
  text: string;

  /**
   * The handler function for the item.
   *
   * #### Notes
   * This will be invoked when an item is clicked by the user.
   */
  handler: (args: any) => void;

  /**
   * The arguments for the handler, if necessary.
   *
   * #### Notes
   * If this is not provided, `undefined` will be used for the args.
   */
  args?: any;

  /**
   * The icon class name(s) for the item, if any.
   *
   * #### Notes
   * Multiple class names should be separated by whitespace.
   */
  icon?: string;

  /**
   * The caption for the item, if any.
   *
   * #### Notes
   * This is more descriptive than what is provided by `text`.
   */
  caption?: string;

  /**
   * The keyboard shortcut for the item, if any.
   *
   * #### Notes
   * This is for decoration purposes only.
   */
  shortcut?: string;

  /**
   * The extra class name(s) for the item, if any.
   *
   * #### Notes
   * Multiple class names should be separated by whitespace.
   */
  className?: string;

  /**
   * The category name for the item.
   *
   * #### Notes
   * This is used to group multiple items with the same category.
   */
  category?: string;
}


/**
 * An object for use with a standard palette model.
 *
 * #### Notes
 * Instances of this class will not typically be created directly by
 * the user. A palette model will create and return instances of the
 * class from its adder methods.
 */
export
class StandardPaletteItem {
  /**
   * Construct a new standard palette item.
   *
   * @param options - The options for initializing the item.
   */
  constructor(options: IStandardPaletteItemOptions) {
    this._text = options.text;
    this._args = options.args;
    this._handler = options.handler;
    this._icon = options.icon || '';
    this._caption = options.caption || '';
    this._shortcut = options.shortcut || '';
    this._className = options.className || '';
    this._category = options.category || '';
  }

  /**
   * Get the primary text for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get text(): string {
    return this._text;
  }

  /**
   * Get the icon class name(s) for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get icon(): string {
    return this._icon;
  }

  /**
   * Get the descriptive caption for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get caption(): string {
    return this._caption;
  }

  /**
   * Get the keyboard shortcut for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get shortcut(): string {
    return this._shortcut;
  }

  /**
   * Get the category name for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get category(): string {
    return this._category;
  }

  /**
   * Get the extra class name(s) for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get className(): string {
    return this._className;
  }

  /**
   * Get the handler function for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get handler(): (args: any) => void {
    return this._handler;
  }

  /**
   * Get the arguments for the handler.
   *
   * #### Notes
   * This is a read-only property.
   */
  get args(): any {
    return this._args;
  }

  private _args: any;
  private _text: string;
  private _icon: string;
  private _caption: string;
  private _shortcut: string;
  private _category: string;
  private _className: string;
  private _handler: (args: any) => void;
}


/**
 * A concrete palette model which holds a collection of palette items.
 *
 * #### Notes
 * This class is a reasonable option for populating command palettes
 * when the number of items is reasonable, and when the items can be
 * created ahead of time. If lazy searching of a large data set is
 * required, then a custom palette model should be used instead.
 */
export
class StandardPaletteModel extends AbstractPaletteModel {
  /**
   * Get the items contained in the palette model.
   *
   * @returns A new array of the current items in the model.
   */
  items(): StandardPaletteItem[] {
    return this._items.slice();
  }

  /**
   * Add a new palette item to the model.
   *
   * @param options - The options for initializing the item.
   *
   * @returns The palette item which was added to the model.
   */
  addItem(options: IStandardPaletteItemOptions): StandardPaletteItem {
    let item = new StandardPaletteItem(options);
    this._items.push(item);
    this.changed.emit(void 0);
    return item;
  }

  /**
   * Add several new palette items to the model.
   *
   * @param options - The options for initializing the items.
   *
   * @returns The new palette items where were added to the model.
   */
  addItems(options: IStandardPaletteItemOptions[]): StandardPaletteItem[] {
    let items = options.map(opts => new StandardPaletteItem(opts));
    Array.prototype.push.apply(this._items, items);
    this.changed.emit(void 0);
    return items;
  }

  /**
   * Remove a palette item from the model.
   *
   * @param item - The item to remove from the model.
   *
   * #### Notes
   * If the item is not contained in the model, this is a no-op.
   */
  removeItem(item: StandardPaletteItem): void {
    let i = arrays.remove(this._items, item);
    if (i !== -1) this.changed.emit(void 0);
  }

  /**
   * Remove several items from the model.
   *
   * @param items - The items to remove from the model.
   *
   * #### Notes
   * Items which are no contained in the model are ignored.
   */
  removeItems(items: StandardPaletteItem[]): void {
    let rest = this._items.filter(other => items.indexOf(other) === -1);
    if (rest.length === this._items.length) {
      return;
    }
    this._items = rest;
    this.changed.emit(void 0);
  }

  /**
   * Remove all items from the model.
   */
  clearItems(): void {
    if (this._items.length === 0) {
      return;
    }
    this._items.length = 0;
    this.changed.emit(void 0);
  }

  /**
   * Search the palette model for matching commands.
   *
   * @param query - The query text to match against the model items.
   *   The query should take the form `(<category>:)?<text>`. If a
   *   category is specified, the search will be limited to items
   *   which match the category.
   *
   * @returns An array of new search results for the query.
   */
  search(query: string): ISearchResult[] {
    //
    let { category, text } = AbstractPaletteModel.splitQuery(query);

    //
    let items = Private.matchCategory(this._items, category);

    //
    let matches = Private.matchText(items, text);

    //
    matches.sort(Private.matchSort);

    //
    return matches.map(match => ({
      type: SearchResultType.Command,
      value: Private.makeCommandResult(match),
    }));
  }

  private _items: StandardPaletteItem[] = [];
}


/**
 *
 */
namespace Private {
  /**
   *
   */
  export
  interface IMatchItem {
    item: StandardPaletteItem;
    score: number;
    indices: number[];
  }

  /**
   *
   */
  export
  function matchCategory(items: StandardPaletteItem[], category: string): StandardPaletteItem[] {
    if (!category) return items;
    let normed = category.toLowerCase();
    return items.filter(item => item.category.toLowerCase() === normed);
  }

  /**
   *
   */
  export
  function matchText(items: StandardPaletteItem[], text: string): IMatchItem[] {
    let matches: IMatchItem[] = [];
    let query = text.replace(/\s/g, '').toLowerCase();
    for (let item of items) {
      let source = item.text.toLowerCase();
      let match = StringSearch.sumOfSquares(source, query);
      if (!match) continue;
      let { score, indices } = match;
      matches.push({ item, score: match.score, indices: match.indices });
    }
    return matches;
  }

  /**
   *
   */
  export
  function matchSort(a: IMatchItem, b: IMatchItem): number {
    return a.score - b.score;
  }

  /**
   *
   */
  export
  function makeCommandResult(match: IMatchItem): ICommandResult {
    let text = StringSearch.highlight(match.item.text, match.indices);
    let { icon, caption, shortcut, className, handler, args } = match.item;
    return { text, icon, caption, shortcut, className, handler, args };
  }
}
