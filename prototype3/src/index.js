import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import { getPersonNodes, getEntityNodes } from "./nodes";
import { getOwnershipEdges } from "./edges";

var g = new dagreD3.graphlib.Graph().setGraph({});

const jointOwn = require("../fixtures/joint.json");
const personNodes = getPersonNodes(jointOwn);
const entityNodes = getEntityNodes(jointOwn);
const ownershipEdges = getOwnershipEdges(jointOwn);

const nodes = [...personNodes, ...entityNodes];
const edges = [...ownershipEdges];

nodes.forEach(node =>
  g.setNode(node.id, {
    label: node.label,
    class: node.class || "",
    labelType: node.labelType || "string",
    ...node.config
  })
);

edges.forEach(edges =>
  g.setEdge(edges.source, edges.target, {
    label: edges.label || "",
    class: edges.class || "",
    ...edges.config
  })
);

var svg = d3.select("svg"),
  inner = svg.select("g");

// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
  inner.attr("transform", d3.event.transform);
});
svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var initialScale = 0.75;
svg.call(
  zoom.transform,
  d3.zoomIdentity
    .translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20)
    .scale(initialScale)
);

svg.attr("height", g.graph().height * initialScale + 40);
