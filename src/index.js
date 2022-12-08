import * as d3 from 'd3';
import dagreD3 from 'dagre-d3';
import Bezier from 'bezier-js';
import bezierBuilder from './utils/bezierBuilder';
import sanitise from './utils/sanitiser';
import { clearSVG } from './utils/svgTools';
import { getPersonNodes, getEntityNodes, setUnknownNode } from './nodes/nodes';
import { getOwnershipEdges } from './edges/edges';
import { SvgSaver } from './utils/svgsaver';
import SVGInjectInstance from '@iconfu/svg-inject';
import interestTypesCodelist from './codelists/interestTypes';

import './style.css';

// This sets up the basic format of the graph, such as direction, node and rank separation, and default label limits
const draw = (data, container, imagesPath, labelLimit = 8, rankDir = 'LR') => {
  const g = new dagreD3.graphlib.Graph({});
  g.setGraph({
    rankdir: rankDir,
    nodesep: 200,
    edgesep: 25,
    ranksep: 300,
  });

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
  nodes.forEach((node) => {
    g.setNode(node.id, {
      label: node.label,
      class: node.class || '',
      labelType: node.labelType || 'string',
      nodeType: node.nodeType,
      countryCode: node.countryCode,
      ...node.config,
    });
  });

  edges.forEach((edge) =>
    g.setEdge(edge.source, edge.target, {
      class: edge.class || '',
      edgeType: edge.interestRelationship,
      ...edge.config,
    })
  );

  // This ensures that the graph is drawn on a clean slate
  clearSVG(container);
  const svg = d3.select('#bods-svg');
  const inner = svg.append('g');

  // Create the renderer
  const render = new dagreD3.render();

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  // create the nodetype injectable img elements used by an image injection library later
  inner.selectAll('g.node').each(function (d, i) {
    if (g.node(d).nodeType !== null) {
      d3.select(this)
        .append('img')
        .attr('width', 120)
        .attr('height', 120)
        .attr('x', -60)
        .attr('y', -60)
        .attr('class', 'node-label label-container injectable')
        .attr('src', function (d) {
          return `${imagesPath}/${g.node(d).nodeType}`;
        });
    }
  });

  // create the flag injectable img elements
  inner.selectAll('g.node').each(function (d, i) {
    if (g.node(d).countryCode !== null) {
      d3.select(this)
        .append('img')
        .attr('src', function (el) {
          return `${imagesPath}/flags/${g.node(el).countryCode.toLowerCase()}.svg`;
        })
        .attr('width', '75')
        .attr('height', '50')
        .attr('x', '10')
        .attr('y', '-80')
        .attr('class', 'injectable flag');
    }
  });

  // Set up a load of arrow heads and markers for bespoke edge formats
  // This could probably be refactored into something less verbose but not essential
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-Half')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 3.8)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 5 z')
    .attr('stroke', 'none')
    .attr('fill', '#349aee');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-Full')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('stroke', 'none')
    .attr('fill', '#349aee');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-blackHalf')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('stroke', 'none')
    .attr('fill', '#000');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-blackFull')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('stroke', 'none')
    .attr('fill', '#000');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-Half')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 6.1)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 5 z')
    .attr('stroke', 'none')
    .attr('fill', '#652eb1');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-Full')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 0 z')
    .attr('stroke', 'none')
    .attr('fill', '#652eb1');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-blackHalf')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 6.1)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 5 z')
    .attr('stroke', 'none')
    .attr('fill', '#000');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-blackFull')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 40)
    .attr('markerHeight', 40)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 0 z')
    .attr('stroke', 'none')
    .attr('fill', '#000');

  // Create white backgrounds for all of the node labels so that text legible
  // We don't currently do this for edge labels as there are complexities in shape, layout, and overlap
  d3.selectAll('.label').each(function (d, i) {
    const label = d3.select(this);
    const text = label.select('text');
    const textParent = text.select(function () {
      return this.parentNode;
    });
    const bBox = text.node().getBBox();

    textParent
      .insert('rect', ':first-child')
      .attr('x', bBox.x)
      .attr('y', bBox.y)
      .attr('height', bBox.height)
      .attr('width', bBox.width)
      .style('fill', 'white');
  });

  // define the additional offset curves and text for ownership and control edges
  const createOwnershipCurve = (
    element,
    index,
    positiveStroke,
    strokeValue,
    curveOffset,
    dashedInterest,
    arrowheadShape
  ) => {
    d3.select(element)
      .attr('style', 'opacity: 0;')
      .clone(true)
      .attr('style', 'opacity: 1;')
      .attr('class', 'edgePath own')
      .select('path')
      .attr('id', (d, i) => 'ownPath' + index)
      .attr('marker-end', `url(#arrow-own-${arrowheadShape})`)
      .attr(
        'style',
        `fill: none; stroke: ${strokeValue}; stroke-width: ${positiveStroke}px; ${
          dashedInterest ? 'stroke-dasharray: 20,12' : ''
        };`
      )
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(curveOffset);
        path.attr('d', bezierBuilder(offsetCurve));
      });

    d3.select(element)
      .clone(true)
      .select('.path')
      .attr('id', (d, i) => 'ownText' + index)
      .attr('style', 'fill: none;')
      .attr('marker-end', '')
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(25);
        path.attr('d', bezierBuilder(offsetCurve));
      });
  };

  const createControlCurve = (
    element,
    index,
    positiveStroke,
    strokeValue,
    curveOffset,
    dashedInterest,
    arrowheadShape
  ) => {
    d3.select(element)
      .attr('style', 'opacity: 0;')
      .clone(true)
      .attr('style', 'opacity: 1;')
      .attr('class', 'edgePath control')
      .select('.path')
      .attr('id', (d, i) => 'controlPath' + index)
      .attr('marker-end', `url(#arrow-control-${arrowheadShape})`)
      .attr(
        'style',
        `fill: none; stroke: ${strokeValue}; stroke-width: 1px; stroke-width: ${positiveStroke}px; ${
          dashedInterest ? 'stroke-dasharray: 20,12' : ''
        };`
      )
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(curveOffset);
        path.attr('d', bezierBuilder(offsetCurve));
      });

    d3.select(element)
      .clone(true)
      .select('.path')
      .attr('id', (d, i) => 'controlText' + index)
      .attr('style', 'fill: none;')
      .attr('marker-end', '')
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(-15);
        path.attr('d', bezierBuilder(offsetCurve));
      });
  };

  const createControlText = (index, controlText) => {
    svg
      .select('.edgeLabels')
      .append('g')
      .attr('class', 'edgeLabel')
      .append('text')
      .attr('class', 'edgeText')
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', function (d, i) {
        return '#controlText' + index;
      })
      .attr('startOffset', '50%')
      .text(sanitise(controlText))
      .style('fill', '#349aee');
  };

  const createOwnText = (index, shareText) => {
    svg
      .select('.edgeLabels')
      .append('g')
      .attr('class', 'edgeLabel')
      .append('text')
      .attr('class', 'edgeText')
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', function (d, i) {
        return '#ownText' + index;
      })
      .attr('startOffset', '50%')
      .text(sanitise(shareText))
      .style('fill', '#652eb1');
  };

  const createUnknownText = (index, element) => {
    d3.select(element)
      .clone(true)
      .select('path')
      .attr('id', `unknown${index}`)
      .attr('style', 'fill: none;')
      .attr('marker-end', '')
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(-10);
        path.attr('d', bezierBuilder(offsetCurve));
      });
    svg
      .select('.edgeLabels')
      .append('g')
      .attr('class', 'edgeLabel')
      .append('text')
      .attr('class', 'edgeText')
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', function (d, i) {
        return '#unknown' + index;
      })
      .attr('startOffset', '50%')
      .text(`Interest details unknown`);
  };

  // use the previous function to calculate the new edges using control and ownership values
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
    } = edge;

    const shareOffset = shareStroke / 2;
    const controlOffset = -(controlStroke / 2);
    const element = g.edge(source, target).elem;

    const checkInterests = (interestRelationship) =>
      interestRelationship === 'indirect' || interestRelationship === 'unknown' ? true : false;

    // set all indirect relationships to dashed lines
    if (checkInterests(interestRelationship)) {
      d3.select(element).style('stroke-dasharray: 20,12');
    }

    const { shareholding, votingRights } = interests;
    if ('shareholding' in interests) {
      const arrowheadColour = shareStroke === 0 ? 'black' : '';
      const arrowheadShape = `${arrowheadColour}${'votingRights' in interests ? 'Half' : 'Full'}`;
      const strokeValue = shareStroke === 0 ? '#000' : '#652eb1';
      const positiveStroke = shareStroke === 0 ? 1 : shareStroke;
      createOwnershipCurve(
        element,
        index,
        positiveStroke,
        strokeValue,
        shareOffset,
        checkInterests(interestRelationship),
        arrowheadShape
      );
    }
    if ('votingRights' in interests) {
      const arrowheadColour = controlStroke === 0 ? 'black' : '';
      const arrowheadShape = `${arrowheadColour}${'votingRights' in interests ? 'Half' : 'Full'}`;
      const strokeValue = controlStroke === 0 ? '#000' : '#349aee';
      const positiveStroke = controlStroke === 0 ? 1 : controlStroke;
      createControlCurve(
        element,
        index,
        positiveStroke,
        strokeValue,
        controlOffset,
        checkInterests(interestRelationship),
        arrowheadShape
      );
    }

    // this creates the edge labels, and will allow the labels to be turned off if the node count exceeds the labelLimit
    const limitLabels = (createLabel) => g.nodeCount() < labelLimit && createLabel;

    limitLabels(createControlText(index, controlText));
    limitLabels(createOwnText(index, shareText));

    // The unknown interest labels are drawn when the interest type is set to 'unknownInterest' or the data are missing
    // No label is displayed if the interestType is within the interestType codelist but is not shareholding or votingRights
    if (
      (interests &&
        !Object.keys(interests).some((type) => Object.keys(interestTypesCodelist).includes(type))) ||
      (Object.keys(interests).length === 1 && Object.keys(interests)[0] === 'unknownInterest')
    ) {
      limitLabels(createUnknownText(index, element));
    }

    // This removes the markers from any edges that have either ownership or control
    if (shareholding || votingRights) {
      d3.select(g.edge(source, target).elem).select('path').attr('marker-end', '');
    }
  });

  nodes.forEach((node, index) => {
    const { id } = node;
    const element = g.node(id).elem;
    const elementD3 = d3.select(element);
    const labelHeight = elementD3.select('.node-label').node().getBoundingClientRect().height;
    elementD3.select('.label').attr('transform', `translate(0, ${labelHeight})`);
  });

  // Set up zoom support
  const zoom = d3.zoom().on('zoom', () => {
    inner.attr('transform', d3.event.transform);
  });
  svg.call(zoom);

  // Center the nodes
  const initialScale = 0.5;
  svg.call(
    zoom.transform,
    d3.zoomIdentity
      .translate((svg.attr('width') * initialScale) / 2, (svg.attr('height') * initialScale) / 2)
      .scale(initialScale)
  );

  // This is the SVG injection library mentioned earlier - this allows SVGs to be injected directly from source
  SVGInjectInstance(document.querySelectorAll('img.injectable')).then(() => {
    d3.selectAll('.flag')
      .insert('rect', ':first-child')
      .attr('class', 'flag-bg')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('style', 'fill: white; stroke: black; stroke-width: 2px;');
  });

  // Some graph functionality - zoom, download, etc
  d3.select('#zoom_in').on('click', function () {
    zoom.scaleBy(svg.transition().duration(750), 1.2);
  });
  d3.select('#zoom_out').on('click', function () {
    zoom.scaleBy(svg.transition().duration(750), 0.8);
  });

  svg.attr('height', g.graph().height * initialScale + 400);
  svg.attr('width', g.graph().width * initialScale + 400);
  svg.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  d3.select('#download-svg').on('click', function () {
    var svgsaver = new SvgSaver();
    var svg = document.querySelector('#bods-svg');
    svgsaver.asSvg(svg, 'bods.svg');
  });

  d3.select('#download-png').on('click', function () {
    var svgsaver = new SvgSaver();
    var svg = document.querySelector('#bods-svg');
    svgsaver.asPng(svg, 'bods.png');
  });
};

export { draw };
