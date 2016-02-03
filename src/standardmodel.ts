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
  ICommand
} from 'phosphor-command';

import {
  AbstractPaletteModel, ISearchResult, SearchResultType
} from './abstractmodel';

import {
  StringSearch
} from './stringsearch';


/**
 * An options object for initializing a standard palette item.
 */
export
interface IStandardPaletteItemOptions {
  /*
   * The text for the item.
   *
   * #### Notes
   * This is the primary text for the item in a palette.
   */
  text: string;

  /**
   * The command for the item.
   *
   * #### Notes
   * This should not be `null`.
   */
  command: ICommand;

  /**
   * The arguments for the command, if any.
   *
   * #### Notes
   * If not provided, `null` will be used for the arguments.
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


// TODO - should we make some properties on this class mutable? Doing
// so would require the item to keep an internal reference to the model
// which created it, so that it could emit the changed signal as needed.

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
    this._command = options.command;
    this._args = options.args || null;
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
   * Get the command for the item.
   *
   * #### Notes
   * This is a read-only property.
   */
  get command(): ICommand {
    return this._command;
  }

  /**
   * Get the arguments for the command.
   *
   * #### Notes
   * This is a read-only property.
   */
  get args(): any {
    return this._args;
  }

  private _text: string;
  private _icon: string;
  private _caption: string;
  private _shortcut: string;
  private _category: string;
  private _className: string;
  private _command: ICommand;
  private _args: any;
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
   *
   */
  search(query: string): ISearchResult[] {
    // TODO handle categories and markup
    // This is just a dumb search for now

    query = query.toLowerCase();

    let matches: IMatch[] = [];
    for (let item of this._items) {
      let text = item.text.toLowerCase();
      let score = StringSearch.sumOfSquares(text, query);
      if (score !== -1) matches.push({ score, item });
    }

    matches.sort(matchSort);

    return matches.map(match => ({
      type: SearchResultType.Command,
      value: match.item,
    }));
  }

  private _items: StandardPaletteItem[] = [];
}


// TODO
interface IMatch {
  score: number;
  item: StandardPaletteItem;
}


// TODO
function matchSort(a: IMatch, b: IMatch): number {
  return a.score - b.score;
}
