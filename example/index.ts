/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  BoxPanel
} from 'phosphor-boxpanel';

import {
  ICommand
} from 'phosphor-command';

import {
 CommandPalette, IStandardPaletteItemOptions, StandardPaletteModel
} from 'phosphor-commandpalette';


const p1 = new CommandPalette();
const p2 = new CommandPalette();

const m1 = new StandardPaletteModel();
const m2 = new StandardPaletteModel();

p1.model = m1;
p2.model = m2;


const outer = new BoxPanel();
const output = new BoxPanel();
const palettes = new BoxPanel();


var timeout: number;

const logCommand: ICommand = {

  execute: (args: any) => {
    if (timeout) clearTimeout(timeout);
    output.node.textContent = args.caption || args.text;
    timeout = setTimeout(() => { output.node.textContent = ''; }, 3000);
  },

  isEnabled: (args) => {
    let first = (args as any).text[0].toLocaleLowerCase();
    // If the title's letter is N through Z.
    return first.charCodeAt(0) > 109;
  },
};


const p1ItemOptions = [
  createItemOpts('Ancient near east', 'Sumer', 'The Mesopotamian city-states'),
  createItemOpts('Ancient near east', 'Babylon', 'The city-state of Babylon'),
  createItemOpts('Ancient near east', 'Hittites', 'The Hittite empire'),
  createItemOpts('Ancient near east', 'Egypt', 'The Egyptian empire'),
  createItemOpts('Ancient near east', 'Persia', 'The Persian empire'),
  createItemOpts('Ancient Mesoamerica', 'Olmecs', 'The Olmec empire'),
  createItemOpts('Ancient Mesoamerica', 'Aztecs', 'The Aztec empire'),
  createItemOpts('Ancient Mesoamerica', 'Mayans', 'The Mayan empire'),
  createItemOpts('Ancient South American', 'Chimú', 'The Chimú culture'),
  createItemOpts('Ancient South American', 'Inca', 'The Incan empire')
];


const p2ItemOptions = [
  createItemOpts('Romance languages', 'Italian', 'lingua italiana'),
  createItemOpts('Romance languages', 'Romanian', 'limba română'),
  createItemOpts('Romance languages', 'French', 'le français'),
  createItemOpts('Romance languages', 'Spanish', 'español'),
  createItemOpts('Romance languages', 'Portuguese', 'língua portuguesa'),
  createItemOpts('Germanic languages', 'German', 'Deutsch'),
  createItemOpts('Germanic languages', 'English', 'English'),
  createItemOpts('Germanic languages', 'Danish', 'dansk sprog'),
  createItemOpts('Germanic languages', 'Swedish', 'svenska'),
  createItemOpts('Germanic languages', 'Icelandic', 'íslenska'),
  createItemOpts('Germanic languages', 'Norwegian', 'norsk'),
  createItemOpts('Germanic languages', 'Dutch', 'Nederlands'),
  createItemOpts('Language isolates', 'Basque', 'Euskara'),
  createItemOpts('Language isolates', 'Korean', '한국어/조선말')
];



function createItemOpts(category: string, text: string, caption: string): IStandardPaletteItemOptions {
  let command = logCommand;
  let args = { text, caption };
  return { text, caption, category, command, args };
}


function main() {
  // Populate command palette models.
  m1.addItems(p1ItemOptions);
  m2.addItems(p2ItemOptions);

  // Populate palettes panel.
  BoxPanel.setStretch(p1, 1);
  BoxPanel.setStretch(p2, 1);
  palettes.direction = BoxPanel.LeftToRight;
  palettes.spacing = 5;
  palettes.addChild(p1);
  palettes.addChild(p2);

  // Populate output panel.
  output.id = 'output';
  BoxPanel.setSizeBasis(output, 60);
  BoxPanel.setStretch(palettes, 1);
  outer.direction = BoxPanel.TopToBottom;
  outer.spacing = 2;
  outer.addChild(palettes);
  outer.addChild(output);

  // Attach main panel to body.
  outer.id = 'main';
  outer.attach(document.body);
}


window.onload = main;
window.onresize = () => { outer.update(); };
