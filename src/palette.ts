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
  Message
} from 'phosphor-messaging';

import {
  Widget
} from 'phosphor-widget';

import {
  CommandSource, ISearchResultSection
} from './source';


/**
 * The class name added to `CommandPalette` instances.
 */
const PALETTE_CLASS = 'p-CommandPalette';

/**
 * The class name added to the search section of the palette.
 */
const SEARCH_CLASS = 'p-CommandPalette-search';

/**
 * The class name added to the input wrapper in the search section.
 */
const WRAPPER_CLASS = 'p-CommandPalette-inputWrapper';

/**
 * The class name added to the input node in the search section.
 */
const INPUT_CLASS = 'p-CommandPalette-input';

/**
 * The class name added to the content section of the palette.
 */
const CONTENT_CLASS = 'p-CommandPalette-content';

/**
 * The class name added to a palette section header.
 */
const HEADER_CLASS = 'p-CommandPalette-header';

/**
 * The class name added to a palette section header text node.
 */
const HEADER_TEXT_CLASS = 'p-CommandPalette-headerText';

/**
 * The class name added to a palette section header icon node.
 */
const HEADER_ICON_CLASS = 'p-CommandPalette-headerIcon';

/**
 *
 */
const ITEM_CLASS = 'p-CommandPalette-item';

/**
 *
 */
const ITEM_CONTENT_CLASS = 'p-CommandPalette-itemContent';

/**
 *
 */
const ITEM_ICON_CLASS = 'p-CommandPalette-itemIcon';

/**
 *
 */
const ITEM_TEXT_CLASS = 'p-CommandPalette-itemText';

/**
 *
 */
const ITEM_SHORTCUT_CLASS = 'p-CommandPalette-itemShortcut';

/**
 *
 */
const ITEM_CAPTION_CLASS = 'p-CommandPalette-itemCaption';

/**
 * The class name added to a disabled palette item.
 */
const DISABLED_CLASS = 'p-mod-disabled';

/**
 * The class name added to the active palette item.
 */
const ACTIVE_CLASS = 'p-mod-active';

/**
 * The regex for parsing the query input string.
 */
const QUERY_REGEX = /^(\w*:)?(.*)$/;


/**
 * A widget which displays commands from a command source.
 */
export
class CommandPalette extends Widget {
  /**
   * Create the DOM node for a command palette.
   */
  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let search = document.createElement('div');
    let wrapper = document.createElement('div');
    let input = document.createElement('input');
    let content = document.createElement('ul');
    search.className = SEARCH_CLASS;
    wrapper.className = WRAPPER_CLASS;
    input.className = INPUT_CLASS;
    content.className = CONTENT_CLASS;
    wrapper.appendChild(input);
    search.appendChild(wrapper);
    node.appendChild(search);
    node.appendChild(content);
    return node;
  }

  /**
   * Create a header node for a command palette.
   *
   * @param title - The palette section title.
   *
   * @param category - The palette section data-category value.
   *
   * @returns A new DOM node for a palette section header.
   *
   * #### Notes
   * This method may be reimplemented to create custom headers.
   */
  static createHeaderNode(title: string, category: string): HTMLElement {
    let node = document.createElement('li');
    let text = document.createElement('span');
    let icon = document.createElement('span');
    node.className = HEADER_CLASS;
    text.className = HEADER_TEXT_CLASS;
    icon.className = HEADER_ICON_CLASS;
    node.setAttribute('data-category', category);
    text.textContent = title;
    node.appendChild(text);
    node.appendChild(icon);
    return node;
  }

  /**
   * Create an item node for a command palette.
   *
   * @param item - The command item to render.
   *
   * @param index - The data-index attribute value for the command item.
   *
   * @returns A new DOM node for a palette section item.
   *
   * #### Notes
   * This method may be reimplemented to create custom items.
   */
  static createItemNode(item: CommandItem, index: string): HTMLElement {
    let node = document.createElement('li');
    let content = document.createElement('div');
    let icon = document.createElement('span');
    let text = document.createElement('span');
    let shortcut = document.createElement('span');
    let caption = document.createElement('span');

    content.className = ITEM_CONTENT_CLASS;
    text.className = ITEM_TEXT_CLASS;
    shortcut.className = ITEM_SHORTCUT_CLASS;
    caption.className = ITEM_CAPTION_CLASS;

    let itemClass = ITEM_CLASS;
    let extraItem = item.className;
    let disabled = !item.isEnabled;
    if (extraItem) itemClass += ' ' + extraItem;
    if (disabled) itemClass += ' ' + DISABLED_CLASS;
    node.className = itemClass;

    let iconClass = ITEM_ICON_CLASS;
    let extraIcon = item.icon;
    if (extraIcon) iconClass += ' ' + extraIcon;
    icon.className = iconClass;

    node.setAttribute('data-index', index);
    text.textContent = item.text;
    shortcut.textContent = item.shortcut;
    caption.textContent = item.caption;

    content.appendChild(shortcut);
    content.appendChild(text);
    content.appendChild(caption);
    node.appendChild(icon);
    node.appendChild(content);

    return node;
  }

  /**
   * Construct a new command palette.
   */
  constructor() {
    super();
    this.addClass(PALETTE_CLASS);
  }

  /**
   * Dispose of the resources held by the command palette.
   */
  dispose(): void {
    this._source = null;
    super.dispose();
  }

  /**
   * Get the command source for the command palette.
   */
  get source(): CommandSource {
    return this._source;
  }

  /**
   * Set the command source for the command palette.
   */
  set source(value: CommandSource) {
    value = value || null;
    if (this._source === value) {
      return;
    }
    if (this._source) {
      this._source.changed.disconnect(this._onSourceChanged);
    }
    if (value) {
      value.changed.connect(this._onSourceChanged);
    }
    this._source = value;
    this.update();
  }

  /**
   * Get the command palette content node.
   *
   * #### Notes
   * This is the node which holds the command palette item nodes.
   *
   * Modifying this node directly can lead to undefined behavior.
   *
   * This is a read-only property.
   */
  get contentNode(): HTMLElement {
    return this.node.getElementsByClassName(CONTENT_CLASS)[0] as HTMLElement;
  }

  /**
   * Get the command palette input node.
   *
   * #### Notes
   * Modifying this node directly can lead to undefined behavior.
   *
   * This is a read-only property.
   */
  get inputNode(): HTMLInputElement {
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }

  /**
   * Handle the DOM events for the command palette.
   *
   * @param event - The DOM event sent to the command palette.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the command palette's DOM node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
    case 'click':
      this._evtClick(event as MouseEvent);
      break;
    case 'keydown':
      this._evtKeyDown(event as KeyboardEvent);
      break;
    case 'input':
      this._evtInput(event);
      break;
    }
  }

  /**
   * A message handler invoked on a `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.node.addEventListener('click', this);
    this.node.addEventListener('keydown', this);
    this.node.addEventListener('input', this);
  }

  /**
   * A message handler invoked on a `'before-detach'` message.
   */
  protected onBeforeDetach(msg: Message): void {
    this.node.removeEventListener('click', this);
    this.node.removeEventListener('keydown', this);
    this.node.removeEventListener('input', this);
  }

  /**
   *
   */
  protected onUpdateRequest(msg: Message): void {
    let t1 = performance.now();

    //
    let content = this.contentNode;
    content.textContent = '';

    //
    if (!this._source) {
      return;
    }

    //
    let match = this.inputNode.value.trim().match(QUERY_REGEX);
    let category = match[1] || '';
    let text = match[2].trim();

    //
    let result = this._source.search(category, text);

    //
    if (result.length === 0) {
      return;
    }

    this._buffer = result;

    //
    let fragment = document.createDocumentFragment();
    let ctor = this.constructor as typeof CommandPalette;

    //
    result.forEach((section, i) => {
      let title = section.title;
      let category = section.category;
      fragment.appendChild(ctor.createHeaderNode(title, category));
      section.items.forEach((item, j) => {
        fragment.appendChild(ctor.createItemNode(item, [i, j].join('-')));
      });
    });

    //
    content.appendChild(fragment);

    let t2 = performance.now();
    console.log(t2 - t1);
  }

  /**
   * Handle the `'click'` event for the command palette.
   */
  private _evtClick(event: MouseEvent): void {
    let { altKey, ctrlKey, metaKey, shiftKey } = event;
    if (event.button !== 0 || altKey || ctrlKey || metaKey || shiftKey) return;
    event.stopPropagation();
    event.preventDefault();
    let target = event.target as HTMLElement;
    let isCategory: boolean;
    let isItem: boolean;
    while (
      !(isCategory = target.hasAttribute('data-category')) &&
      !(isItem = target.hasAttribute('data-index'))) {
        if (target === this.node) return;
        target = target.parentElement;
    }
    if (isCategory) {
      let category = target.getAttribute('data-category');
      console.log('category search', category);
    } else {
      let indices = target.getAttribute('data-index');
      let category = parseInt(indices.split('-')[0], 10);
      let index = parseInt(indices.split('-')[1], 10);
      let item = this._buffer[category].items[index];
      if (item.isEnabled) item.execute();
    }
  }

  /**
   *
   */
  private _evtKeyDown(event: KeyboardEvent): void {

  }

  /**
   *
   */
  private _evtInput(event: Event): void {
    this.update();
  }

  /**
   *
   */
  private _onSourceChanged(): void {

  }

  private _buffer: ISearchResultSection[];
  private _source: CommandSource = null;
}
