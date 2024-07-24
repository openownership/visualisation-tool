import * as d3 from 'd3';

import { getPersonNodes, getEntityNodes, setUnknownNode } from './nodes/nodes';
import { checkInterests, getOwnershipEdges } from './edges/edges';
import interestTypesCodelist from './codelists/interestTypes';
import {
  setupD3,
  defineArrowHeads,
  createOwnershipCurve,
  createControlCurve,
  createControlText,
  createOwnText,
  createUnknownText,
  setNodeLabelBkg,
  injectSVGElements,
  setZoomTransform,
} from './render/renderD3';
import { setupGraph, setEdges, setNodes } from './render/renderGraph';
import { setupUI } from './render/renderUI';

import './style.css';

// This sets up the basic format of the graph, such as direction, node and rank separation, and default label limits
const draw = (data, container, imagesPath, labelLimit = 8, rankDir = 'LR') => {
  // Initialise D3 and graph
  const { svg, inner } = setupD3(container);
  const { g, render } = setupGraph(rankDir);

  defineArrowHeads(svg);

  // These functions extract the BODS data that is required for drawing the graph
  const personNodes = getPersonNodes(data);
  const entityNodes = getEntityNodes(data);
  const ownershipEdges = getOwnershipEdges(data);

  const edges = [...ownershipEdges];

  // Some of the edges have unknown sources then we map these to an inserted unknown node
  const unknownSubjects = edges.filter((edge, index) => {
    edge.source = edge.source === 'unknown' ? `unknown${index}` : edge.source;
    return edge.source === `unknown${index}`;
  });
  const unknownNodes = unknownSubjects.map((unknownSubject) => {
    return setUnknownNode(unknownSubject.source);
  });
  const nodes = [...personNodes, ...entityNodes, ...getPersonNodes(unknownNodes)];

  // This section maps the incoming BODS data to the parameters expected by Dagre
  setNodes(nodes, g);
  setEdges(edges, g);

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  // Inject SVG images (for use e.g. as flags)
  injectSVGElements(imagesPath, inner, g);

  // Create white backgrounds for all of the node labels so that text legible
  setNodeLabelBkg('white');

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
      config,
    } = edge;

    const shareOffset = shareStroke / 2;
    const controlOffset = -(controlStroke / 2);
    const element = g.edge(source, target).elem;

    // set all indirect relationships to dashed lines
    if (checkInterests(interestRelationship)) {
      d3.select(element).style('stroke-dasharray: 20,12');
    }

    const { shareholding, votingRights } = interests;
    if ('shareholding' in interests) {
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
    if ('votingRights' in interests) {
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

    // this creates the edge labels, and will allow the labels to be turned off if the node count exceeds the labelLimit
    const limitLabels = (createLabel) => g.nodeCount() < labelLimit && createLabel;

    limitLabels(createControlText(svg, index, controlText));
    limitLabels(createOwnText(svg, index, shareText));

    // The unknown interest labels are drawn when the interest type is set to 'unknownInterest' or the data are missing
    // No label is displayed if the interestType is within the interestType codelist but is not shareholding or votingRights
    if (
      (interests &&
        !Object.keys(interests).some((type) => Object.keys(interestTypesCodelist).includes(type))) ||
      (Object.keys(interests).length === 1 && Object.keys(interests)[0] === 'unknownInterest')
    ) {
      limitLabels(createUnknownText(svg, index, element));
    }

    // This removes the markers from any edges that have either ownership or control
    if (shareholding || votingRights) {
      d3.select(g.edge(source, target).elem).select('path').attr('marker-end', '');
    }
  });

  const { zoom } = setZoomTransform(inner, svg, g);

  setupUI(zoom, svg);
};

export { draw };
