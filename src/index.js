import { getNodes } from './model/nodes/nodes';
import { checkInterests, getEdges } from './model/edges/edges';
import {
  setupD3,
  defineArrowHeads,
  createOwnershipCurve,
  createControlCurve,
  createUnknownCurve,
  createControlText,
  createOwnText,
  createUnknownText,
  setNodeLabelBkg,
  injectSVGElements,
  setZoomTransform,
  removeMarkers,
  setDashedLine,
  createUnspecifiedNode,
} from './render/renderD3';
import { setupGraph, setEdges, setNodes } from './render/renderGraph';
import { setupUI, renderProperties } from './render/renderUI';

import './style.css';

// This sets up the basic format of the graph, such as direction, node and rank separation, and default label limits
const draw = ({
  data,
  container,
  imagesPath,
  labelLimit = 8,
  rankDir = 'LR',
  viewProperties = true,
  useTippy = false,
}) => {
  // Initialise D3 and graph
  const { svg, inner } = setupD3(container);
  const { g, render } = setupGraph(rankDir);

  defineArrowHeads(svg);

  // Extract the BODS data that is required for drawing the graph
  const { edges } = getEdges(data);
  const { nodes } = getNodes(data, edges);

  // This section maps the incoming BODS data to the parameters expected by Dagre
  setEdges(edges, g);
  setNodes(nodes, g);

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  // Inject SVG images (for use e.g. as flags)
  injectSVGElements(imagesPath, inner, g);

  // Create white backgrounds for all of the node labels so that text legible
  setNodeLabelBkg('white');

  // stack unspecified nodes
  nodes.forEach((node) => {
    if (node?.class?.includes('unspecified')) {
      const element = g.node(node.id).elem;
      createUnspecifiedNode(element);
    }
  });

  // calculate the new edges using control and ownership values
  // this section could do with a refactor and move more of the logic into edges.js
  edges.forEach((edge, index) => {
    const {
      source,
      target,
      interests,
      interestRelationship,
      shareStroke,
      shareText,
      controlStroke,
      controlText,
      unknownStroke,
      config,
    } = edge;

    const unknownOffset = unknownStroke / 2;
    const shareOffset = shareStroke / 2;
    const controlOffset = -(controlStroke / 2);
    const element = g.edge(source, target).elem;

    if (interests.some((item) => item.category === 'ownership')) {
      createOwnershipCurve(
        element,
        index,
        config.share.positiveStroke,
        config.share.strokeValue,
        shareOffset,
        checkInterests(interestRelationship),
        config.share.arrowheadShape
      );
    }
    if (interests.some((item) => item.category === 'control')) {
      createControlCurve(
        element,
        index,
        config.control.positiveStroke,
        config.control.strokeValue,
        controlOffset,
        checkInterests(interestRelationship),
        config.control.arrowheadShape
      );
    }
    if (!interests.length || interests.some((item) => item.category === '')) {
      createUnknownCurve(
        element,
        index,
        config.unknown.positiveStroke,
        config.unknown.strokeValue,
        unknownOffset,
        checkInterests(interestRelationship),
        config.unknown.arrowheadShape
      );
    }

    // this creates the edge labels, and will allow the labels to be turned off if the node count exceeds the labelLimit
    const limitLabels = (createLabel) => g.nodeCount() < labelLimit && createLabel;

    limitLabels(createControlText(svg, index, controlText));
    limitLabels(createOwnText(svg, index, shareText));

    // This removes the markers from any edges that have either ownership or control
    if (
      interests.some((item) => item.category === 'ownership') ||
      interests.some((item) => item.category === 'control')
    ) {
      removeMarkers(g, source, target);
    }
  });

  const { zoom } = setZoomTransform(inner, svg, g);

  setupUI(zoom, svg);

  if (viewProperties) {
    renderProperties(inner, g, useTippy);
  }
};

export { draw };
