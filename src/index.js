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

import './style.css';

const draw = (data, container, imagesPath, labelLimit = 8, rankDir = 'LR') => {
  const g = new dagreD3.graphlib.Graph({});
  g.setGraph({
    rankdir: rankDir,
    nodesep: 200,
    edgesep: 25,
    ranksep: 200,
  });

  const personNodes = getPersonNodes(data, imagesPath);
  const entityNodes = getEntityNodes(data, imagesPath);
  const ownershipEdges = getOwnershipEdges(data);

  const edges = [...ownershipEdges];

  const unknownSubject = edges.filter((edge) => edge.source === 'unknown');
  const unknownNode = unknownSubject.length > 0 ? setUnknownNode(imagesPath) : [];
  const nodes = [...personNodes, ...entityNodes, ...unknownNode];

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

  clearSVG(container);
  const svg = d3.select('#bods-svg');
  const inner = svg.append('g');

  // Create the renderer
  const render = new dagreD3.render();

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  // create the nodetype injectable img elements
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
        .attr('style', 'background-color: "#000"')
        .attr('filter', 'url(#shadow)')
        .attr('class', 'injectable flag');
    }
  });

  svg
    .append('filter')
    .attr('id', 'shadow')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '110%')
    .attr('height', '110%')
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 20)
    .attr('flood-color', '#000')
    .attr('flood-opacity', 1);

  // create arrowhead markers for edge termination
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-half')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 5 z')
    .attr('stroke', 'none')
    .attr('fill', '#349aee');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-control-full')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('stroke', 'none')
    .attr('fill', '#349aee');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-half')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 5 z')
    .attr('stroke', 'none')
    .attr('fill', '#652eb1');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow-own-full')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 10 L 10 5 L 0 0 z')
    .attr('stroke', 'none')
    .attr('fill', '#652eb1');

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

  // define the additional curves and text for ownership and control edges
  const createOwnershipCurve = (
    element,
    index,
    shareStroke,
    curveOffset,
    ended,
    interestRelationship,
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
        `fill: none; stroke: #652eb1; stroke-width: ${shareStroke}px; ${
          interestRelationship === 'indirect' ? 'stroke-dasharray: 3,3' : ''
        }; opacity: ${ended ? '0.3' : '1'}`
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
    controlStroke,
    curveOffset,
    ended,
    interestRelationship,
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
        `fill: none; stroke: #349aee; stroke-width: 1px; stroke-width: ${controlStroke}px; ${
          interestRelationship === 'indirect' ? 'stroke-dasharray: 3,3' : ''
        };
        opacity: ${ended ? '0.3' : '1'}`
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
      .text(`Unknown`);
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

    // set all indirect relationships to dashed lines
    if (interestRelationship === 'indirect') {
      d3.select(element).style('stroke-dasharray', '3, 3');
    }

    const { shareholding, votingRights } = interests;
    if ('shareholding' in interests) {
      const ended = shareholding ? shareholding.ended : false;
      const arrowheadShape = 'votingRights' in interests ? 'half' : 'full';
      createOwnershipCurve(
        element,
        index,
        shareStroke,
        shareOffset,
        ended,
        interestRelationship,
        arrowheadShape
      );
    }
    if ('votingRights' in interests) {
      const ended = votingRights ? votingRights.ended : false;
      const arrowheadShape = 'shareholding' in interests ? 'half' : 'full';
      createControlCurve(
        element,
        index,
        controlStroke,
        controlOffset,
        ended,
        interestRelationship,
        arrowheadShape
      );
    }

    // this will allow the labels to be turned off if there are too many nodes and edge labels overlap
    g.nodeCount() < labelLimit && createControlText(index, controlText);
    g.nodeCount() < labelLimit && createOwnText(index, shareText);
    g.nodeCount() < labelLimit &&
      !('shareholding' in interests) &&
      !('votingRights' in interests) &&
      createUnknownText(index, element);

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

  SVGInjectInstance(document.querySelectorAll('img.injectable')).then(() => {
    d3.selectAll('.flag')
      .insert('rect', ':first-child')
      .attr('height', '100%')
      .attr('width', '100%')
      .style('fill', 'white');
  });

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
