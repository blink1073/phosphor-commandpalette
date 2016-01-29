phosphor-commandpalette
=======================

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-commandpalette.svg)](https://travis-ci.org/phosphorjs/phosphor-commandpalette?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-commandpalette/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-commandpalette?branch=master)

A Phosphor widget which displays a searchable collection of commands

[API Docs](http://phosphorjs.github.io/phosphor-commandpalette/api/)


Package Install
---------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save phosphor-commandpalette
```


Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/phosphor-commandpalette.git
cd phosphor-commandpalette
npm install
```

**Rebuild**
```bash
npm run clean
npm run build
```


Build Docs
----------

Follow the source build instructions first.

```bash
npm run docs
```

Navigate to `docs/index.html`.


Build Example
-------------

Follow the source build instructions first.

```bash
cd example
npm install
npm run build
```

Start a web server in the `example` folder and navigate to the served URL.


Supported Runtimes
------------------

The runtime versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- IE 11+
- Firefox 32+
- Chrome 38+


Usage Examples
--------------

**Note:** This module is fully compatible with Node/Babel/ES6/ES5. Simply
omit the type declarations when using a language other than TypeScript.
