import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import { getPersonNodes, getEntityNodes, setUnknownNode } from "./nodes/nodes";
import { getOwnershipEdges } from "./edges/edges";
import * as svgreverse from "svg-path-reverse";
import Bezier from "bezier-js";
import bezierBuilder from "./utils/bezierBuilder";

var g = new dagreD3.graphlib.Graph({}); // multigraph: true }); // multigraph allows multiple edges between nodes
g.setGraph({
  rankdir: "LR",
  nodesep: 200,
  edgesep: 25,
  ranksep: 200,
  directed: false,
  // align: "DR",
  // acyclicer: "greedy",
  // ranker: "tight-tree",
});

const jointOwn = require("../fixtures/joint.json");
const personNodes = getPersonNodes(jointOwn);
const entityNodes = getEntityNodes(jointOwn);
const ownershipEdges = getOwnershipEdges(jointOwn);

const edges = [...ownershipEdges];

const unknownSubject = edges.filter((edge) => edge.source === "unknown");
const unknownNode = unknownSubject.length > 0 ? setUnknownNode() : [];
const nodes = [...personNodes, ...entityNodes, ...unknownNode];

nodes.forEach((node) => {
  g.setNode(node.id, {
    label: node.label,
    class: node.class || "",
    labelType: node.labelType || "string",
    ...node.config,
  });
});

edges.forEach(
  (edge) =>
    g.setEdge(edge.source, edge.target, {
      label: edge.label || "",
      class: edge.class || "",
      ...edge.config,
    }) //, edge.id) // named edges for multigraph only
);

var svg = d3.select("svg"),
  inner = svg.select("g");

// Set up zoom support
var zoom = d3.zoom().on("zoom", function () {
  inner.attr("transform", d3.event.transform);
});
svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Investigating using custom shapes for the nodes
// We can redefine the shape of the circle which will allow us to control the position of intersection.
// The problem with this is that we are using labels (currently).
// The variable length of the text means that the icon circle is not the same as the node circle.
// Using this redefinition of the circle to set the intersection point to near the centre
render.shapes().circle = function circle(parent, bbox, node) {
  var r = Math.max(bbox.width, bbox.height) / 2;
  var shapeSvg = parent.insert("circle", ":first-child")
    .attr("x", -bbox.width / 2)
    .attr("y", -bbox.height / 2)
    .attr("r", r);

  node.intersect = function(point) {
    return dagreD3.intersect.circle(node, 0.1, point);
  };

  return shapeSvg;
}

// Run the renderer. This is what draws the final graph.
render(inner, g);

const createOwnershipCurve = (element, index, shareStroke) => {
  d3.select(element)
    .clone(true)
    .attr("class", "edgePath own")
    .select("path")
    .attr("id", (d, i) => "ownPath" + index)
    .attr("marker-end", "")
    .attr(
      "style",
      `fill: none; stroke: #652eb1; stroke-width: 1px; stroke-width: ${shareStroke}px`
    );

  d3.select(element)
    .clone(true)
    .select(".path")
    .attr("id", (d, i) => "ownText" + index)
    .attr("marker-end", "")
    .each(function () {
      const path = d3.select(this);
      const newBezier = Bezier.SVGtoBeziers(path.attr("d"));
      const offsetCurve = newBezier.offset(-20);
      path.attr("d", bezierBuilder(offsetCurve));
    });
};

const createControlCurve = (element, index, controlStroke, curveOffset) => {
  d3.select(element)
    .clone(true)
    .attr("class", "edgePath control")
    .select(".path")
    .attr("id", (d, i) => "controlPath" + index)
    .attr("marker-end", "")
    .attr(
      "style",
      `fill: none; stroke: #349aee; stroke-width: 1px; stroke-width: ${controlStroke}px`
    )
    .each(function () {
      const path = d3.select(this);
      const newBezier = Bezier.SVGtoBeziers(path.attr("d"));
      const offsetCurve = newBezier.offset(curveOffset);
      path.attr("d", bezierBuilder(offsetCurve));
    });

  d3.select(element)
    .clone(true)
    .select(".path")
    .attr("id", (d, i) => "controlText" + index)
    .attr("marker-end", "")
    .each(function () {
      const path = d3.select(this);
      const newBezier = Bezier.SVGtoBeziers(path.attr("d"));
      const offsetCurve = newBezier.offset(35);
      path.attr("d", bezierBuilder(offsetCurve));
    });
};

edges.forEach((edge, index) => {
  const { source, target, interests } = edge;
  const { shareholding, votingRights } = interests;
  const { exact: shareExact, minimum: shareMin, maximum: shareMax } = {
    ...shareholding,
  };
  const { exact: controlExact, minimum: controlMin, maximum: controlMax } = {
    ...votingRights,
  };
  const shareStroke =
    (shareExact === undefined ? (shareMin + shareMax) / 2 : shareExact) / 10;
  const controlStroke =
    (controlExact === undefined
      ? (controlMin + controlMax) / 2
      : controlExact) / 10;

  const curveOffset = shareStroke / 2 + controlStroke / 2;
  const element = g.edge(source, target).elem;

  "shareholding" in interests &&
    createOwnershipCurve(element, index, shareStroke);
  "votingRights" in interests &&
    createControlCurve(element, index, controlStroke, curveOffset);

  svg
    .select(".control")
    .append("text")
    .attr("class", "edgeText")
    .attr("text-anchor", "middle")
    .append("textPath")
    .attr("xlink:href", function (d, i) {
      return "#controlText" + index;
    })
    .attr("startOffset", "50%")
    .text(
      `Controls ${
        controlExact === undefined
          ? `${controlMin} - ${controlMax}`
          : controlExact
      }%`
    );

  svg
    .select(".own")
    .append("text")
    .attr("class", "edgeText")
    .attr("text-anchor", "middle")
    .append("textPath")
    .attr("xlink:href", function (d, i) {
      return "#ownText" + index;
    })
    .attr("startOffset", "50%")
    .text(
      `Owns ${
        shareExact === undefined ? `${shareMin} - ${shareMax}` : shareExact
      }%`
    );
});

// Center the nodes
var initialScale = 0.75;
svg.call(
  zoom.transform,
  d3.zoomIdentity
    .translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20)
    .scale(initialScale)
);

svg.attr("height", g.graph().height * initialScale + 40);

// Used to shift labels outside of the node
// const labels = svg.selectAll("g.nodes g.label");
// labels.attr("transform", (data, index, element) => {
//   const labelText = d3.select(element[index]).select("g.labelText");
//   const textWidth = labelText.node().getBBox().width;
//   return `translate(${textWidth / 2},0)`;
// });

function downloadSVG() {
  var html = d3
    .select("svg")
    .attr("title", "BODS-Diagram")
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .node().outerHTML;
  var svgBlob = new Blob([html], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "bods-svg.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

window.onload = function () {
  document
    .getElementById("svg_download")
    .addEventListener("click", downloadSVG, true);
};
