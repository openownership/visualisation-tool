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

The access point to the library is [index.js](./src/index.js). The first few lines of this file generate the objects required to draw the graph by mapping the BODS data to [nodes](./src/nodes/nodes.js) to [edges](./src/edges/edges.js). These are then used to draw draw the graph. After building and drawing the graph we then apply extensive customisation to the D3 graph. See code comments for more context.
