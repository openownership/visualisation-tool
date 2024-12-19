# Developer Guide

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

## Code Guide

The access point to the library is [index.js](./src/index.js), which contains a `draw()` function. This function is central to bringing the rest of the code together.

The remaining code is structured into three phases, **parsing**, **modelling** and **rendering**, as well as some utility functions.

- [Parsing](./src/parse/parse.js) happens within the demo [index.js](./demo/index.js), as soon as the data is input, before the `draw()` function is called.
- Modelling occurs at the beginning of the `draw()` function, and generates the objects required to draw the graph by mapping the BODS data to [nodes](./src/model/nodes/nodes.js) and to [edges](./src/model/edges/edges.js).
- Rendering of the [graph](./src/render/renderGraph.js) occurs after the data has been modelled. After building and drawing the graph we then apply extensive customisation to the [D3 graph](./src/render/renderD3.js). Further [UI elements](./src/render/renderUI.js) are rendered at the end of the `draw()` function.

See code comments for more context.
