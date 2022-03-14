# BODS-Dagre

BODS-Dagre is a small javascript library for automatic generation of directed
graphs representing Beneficial Ownership Data for the web. It relies on d3,
dagre-d3 and bezier-js to do all the heavy lifting.

The tool accepts [Beneficial Ownership Data](http://standard.openownership.org/)
(JSON) as input and outputs SVG content on a webpage which contains the
appropriate placeholder HTML.

For a hosted version you can use directly, see [our main website's installation](https://openownership.org/visualisation/visualisation-tool/)

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
// Set a node limit above which labels will no longer be shown 
const labelLimit = 8

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

