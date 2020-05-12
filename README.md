# Visualisation Tool

**N.B. This tool is still in development**

The Visualisation Tool is a small javascript library for automatic generation of directed graphs representing Beneficial Ownership Data for the web.

The tool accepts [Beneficial Ownership Data](http://standard.openownership.org/) (JSON) as input and outputs SVG content on a webpage which contains the appropriate placeholder.

At present this library does not output pure SVG content and depends on HTML nodes within the graph.

## Development
To build the project for development using the webpack server run:

```
npm i
npm start
```

## Demo Page (Production)
To build the demo page, which uses the templates found in `/demo`, run:

```
npm i
npm run demo
```
This will output the compiled code, including the demo page, to `demo-build`.

## Libary compilation
To build the library without the demo page run:

```
npm i
npm run library
```
This will compile the javascript into `dist/main.js` and will include all of the required SVG files in `/dist/images`

This can be used on a page which has the following placeholder:

```
<div id="svg-holder">
    <svg id="bods-svg"></svg>
</div>
```
The usage of the the library can be found in the [demo](demo/) files.

