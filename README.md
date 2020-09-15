# BODS-Dagre

BODS-Dagre is a small javascript library for automatic generation of directed
graphs representing Beneficial Ownership Data for the web. It relies on d3,
dagre-d3 and bezier-js to do all the heavy lifting.

The tool accepts [Beneficial Ownership Data](http://standard.openownership.org/)
(JSON) as input and outputs SVG content on a webpage which contains the
appropriate placeholder HTML.

For a hosted version you can use directly, see [our main website's installation](/visualisation/visualisation-tool/)

## Installation & Usage

Through your package manager:

```shell
$ npm install @openownership/bods-dagre
```

Or as a script tag:

```html
<script src="https://unpkg.com/@openownership/bods-dagre/dist/bods-dagre.js"></script>
```

Then in your application:

```js
// Your BODS data
const data = JSON.parse('some JSON string');
// Where you want the SVG drawn
const container = document.getElementById('some-id');
// Where you're serving the bundled images from (see below)
const imagesPath = '/some/folder';

BODSDagre.draw(data, container, imagesPath);
```

Full demo applications are hosted from this repo:
- <a href="https://openownership.github.io/visualisation-tool/">Using webpack</a>
- <a href="https://openownership.github.io/visualisation-tool/script-tag.html">Using a script tag</a>

### Images

The library includes license-free SVG images for world flags, as well as some
generic icons from our [Beneficial Ownership Visualisation System](https://openownership.org/visualisation/).

You can find these inside the dist/images folder, but you need to make them
available at some URL path in your application and tell the library what that
path is when you call it.

### Zoom

The functionality has been included for two zoom buttons. These must be added to
the page, along with the placeholder, with the correct IDs for the code to
pick them up:

```html
<button id="zoom_in">+</button>
<button id="zoom_out">-</button>
```

## Development
To build the project for development using the webpack server run:

```
npm i
npm start
```

## Demo Page
To build the demo page, which uses the templates found in `/demo`, run:

```
npm i
npm run demo
```
This will output the compiled code, including the demo page, to `demo-build`.

To build and push a new version to gh-pages, run `publish-demo.sh`.

## Libary compilation
To build the library without the demo page run:

```
npm i
npm run library
```
This will compile the javascript into `dist/main.js` and will include all of the required SVG files in `/dist/images`

## Publishing
To publish this to NPM (assuming you're logged in through the cli and have
permissions on the project):

`$ npm publish --access public`
