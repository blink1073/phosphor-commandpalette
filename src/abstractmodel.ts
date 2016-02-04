/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  ISignal, Signal
} from 'phosphor-signaling';


/**
 * An enum of the support search result types.
 */
export
enum SearchResultType {
  /**
   * The search result represents a section header.
   */
  Header,

  /**
   * The search result represents a command.
   */
  Command
}


/**
 * A search result which represents a section header.
 */
export
interface IHeaderResult {
  /**
   * The title text for the header.
   */
  text: string;

  /**
   * A category to further refine the search, or an empty string.
   *
   * #### Notes
   * If this is provided, the header will be selectable. If the header
   * is selected, the search will be refined with the given category.
   */
  category: string;

  /**
   * The class name(s) to add to the header node, or an empty string.
   *
   * #### Notes
   * Multiple class names should be separated by whitespace.
   */
  className: string;
}


/**
 * A search result which represents a command.
 */
export
interface ICommandResult {
  /**
   * The title text for the command.
   *
   * #### Notes
   * The text may include markup to highlight matched characters.
   * This feature *should not* be abused for arbitrary rendering.
   */
  text: string;

  /**
   * The class name(s) for the item icon, or an empty string.
   *
   * #### Notes
   * Multiple class names should be separated by whitespace.
   */
  icon: string;

  /**
   * The caption for the item, or an empty string.
   *
   * #### Notes
   * The caption may include markup to highlight matched characters.
   * This feature *should not* be abused for arbitrary rendering.
   */
  caption: string;

  /**
   * The shortcut for the item, or an empty string.
   *
   * #### Notes
   * This value is for decoration purposes only. It may include markup
   * for customizing the display of the shortcut.
   */
  shortcut: string;

  /**
   * The class name(s) to add to the item node, or an empty string.
   *
   * #### Notes
   * Multiple class names should be separated by whitespace.
   */
  className: string;

  /**
   * The handler function to execute when the item is clicked.
   */
  handler: (args: any) => void;

  /**
   * The arguments to pass to the handler.
   */
  args: any;
}


/**
 * A tagged union which represents a single search result.
 */
export
interface ISearchResult {
  /**
   * The type of the search result item.
   */
  type: SearchResultType;

  /**
   * The value for the search result.
   */
  value: IHeaderResult | ICommandResult;
}


/**
 * An abstract base class for creating command palette models.
 */
export
abstract class AbstractPaletteModel {
  /**
   *
   */
  static splitQuery(query: string): { category: string, text: string } {
    let i = query.indexOf(':');
    if (i === -1) return { category: '', text: query.trim() };
    let category = query.slice(0, i).trim();
    let text = query.slice(i + 1).trim();
    return { category, text };
  }

  /**
   *
   */
  static joinQuery(category: string, text: string): string {
    return `${category.trim()}: ${text.trim()}`;
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
   *
   * #### Notes
   * This abstract method must be implemented by a subclass.
   *
   * When the contents of a model change in a way which may invalidate
   * previously computed search results, the [[changed]] signal should
   * be emitted.
   */
  abstract search(query: string): ISearchResult[];

  /**
   * A signal emitted when the potential search results change.
   *
   * #### Notes
   * A subclass should emit this signal when its contents change in
   * a way which may invalidate previously computed search results.
   */
  get changed(): ISignal<AbstractPaletteModel, void> {
    return AbstractPaletteModelPrivate.changedSignal.bind(this);
  }
}


/**
 * The namespace for the `AbstractPaletteModel` private data.
 */
namespace AbstractPaletteModelPrivate {
  /**
   * A signal emitted when a palette model's search results change.
   */
  export
  const changedSignal = new Signal<AbstractPaletteModel, void>();
}
