import { getNodes } from './model/nodes/nodes.js';
import { checkInterests, getEdges } from './model/edges/edges.js';
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
import { setupUI, renderMessage, renderProperties, renderDateSlider } from './render/renderUI';
import { getDates, filteredData } from './utils/bods.js';

import './style.css';

export const selectData = ({
  data,
  selectedData,
  container,
  imagesPath,
  labelLimit = 8,
  rankDir = 'LR',
  viewProperties = true,
  useTippy = false,
  currentlySelectedDate = null,
}) => {
  const config = {
    data,
    container,
    imagesPath,
    labelLimit,
    rankDir,
    viewProperties,
    useTippy,
  };

  if (data) {
    const version = data[0]?.publicationDetails?.bodsVersion || '0.4';

    // Detect dates in data; default to most recent
    const dates = getDates(data);
    let selectedDate = currentlySelectedDate ? currentlySelectedDate : dates[dates.length - 1];

    // Update selected date according to slider position
    renderDateSlider(dates, version, currentlySelectedDate);
    const slider = document.querySelector('#slider-input');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const scrollPosition = window.scrollY;
        selectedDate = dates[document.querySelector('#slider-input').value];
        config.selectedData = filteredData(data, selectedDate, version);
        draw(config);
        window.scrollTo(0, scrollPosition);
        slider.focus();
      });
    }
    config.selectedData = filteredData(data, selectedDate, version);
    draw(config);
  }
};

// This sets up the basic format of the graph, such as direction, node and rank separation, and default label limits
export const draw = (config) => {
  const { data, selectedData, container, imagesPath, labelLimit, rankDir, viewProperties, useTippy } = config;
  // Initialise D3 and graph
  const { svg, inner } = setupD3(container);
  const { g, render } = setupGraph(rankDir);

  defineArrowHeads(svg);

  // Extract the BODS data that is required for drawing the graph
  const { edges } = getEdges(selectedData);
  const { nodes } = getNodes(selectedData, edges);

  if (edges.length === 0 && nodes.length === 0) {
    const message = 'Your data does not have any information that can be drawn.';
    renderMessage(message);
  }

  // This section maps the incoming BODS data to the parameters expected by Dagre
  setEdges(edges, g);
  setNodes(nodes, g);

  // Run the renderer. This is what draws the final graph.
  try {
    render(inner, g);
  } catch (error) {
    const message = 'Your data does not have any information that can be drawn.';
    renderMessage(message);
    console.error(error);
  }

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

  const { zoom } = setZoomTransform(inner, svg);

  setupUI(zoom, inner, svg);

  if (viewProperties) {
    renderProperties(inner, g, useTippy);
  }
};
