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

const draw = (data, container, imagesPath) => {
  const g = new dagreD3.graphlib.Graph({});
  g.setGraph({
    rankdir: 'LR',
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
      ...edge.config,
    })
  );

  clearSVG(container);
  const svg = d3.select('#bods-svg');
  const inner = svg.append('g');

  // Create the renderer
  const render = new dagreD3.render();

  // Using this redefinition of the circle to set the intersection point to near the centre
  render.shapes().circle = function circle(parent, bbox, node) {
    const r = Math.max(bbox.width, bbox.height) / 2;
    const shapeSvg = parent
      .insert('circle', ':first-child')
      .attr('x', -bbox.width / 2)
      .attr('y', -bbox.height / 2)
      .attr('r', r);

    node.intersect = function (point) {
      return dagreD3.intersect.circle(node, 0.1, point);
    };

    return shapeSvg;
  };

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  inner
    .selectAll('g.node')
    .append('img')
    .attr('width', 120)
    .attr('height', 120)
    .attr('x', -60)
    .attr('y', -60)
    .attr('class', 'node-label label-container injectable')
    .attr('src', function (el) {
      return `${imagesPath}/${g.node(el).nodeType}.svg`;
    });

  inner
    .selectAll('g.node')
    .append('img')
    .attr('src', function (el) {
      return `${imagesPath}/flags/${g.node(el).countryCode}.svg`;
    })
    .attr('width', '80')
    .attr('height', '60')
    .attr('x', '10')
    .attr('y', '-80')
    .attr('class', 'injectable');

  const createOwnershipCurve = (element, index, shareStroke, curveOffset, ended) => {
    d3.select(element)
      .clone(true)
      .attr('class', 'edgePath own')
      .select('path')
      .attr('id', (d, i) => 'ownPath' + index)
      .attr('marker-end', '')
      .attr(
        'style',
        `fill: none; stroke: #652eb1; stroke-width: 1px; stroke-width: ${shareStroke}px;
        stroke-opacity: ${ended ? '0.3' : '1'}`
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
        const offsetCurve = newBezier.offset(-20);
        path.attr('d', bezierBuilder(offsetCurve));
      });
  };

  const createControlCurve = (element, index, controlStroke, ended) => {
    d3.select(element)
      .clone(true)
      .attr('class', 'edgePath control')
      .select('.path')
      .attr('id', (d, i) => 'controlPath' + index)
      .attr('marker-end', '')
      .attr(
        'style',
        `fill: none; stroke: #349aee; stroke-width: 1px; stroke-width: ${controlStroke}px;
        stroke-opacity: ${ended ? '0.3' : '1'}`
      );

    d3.select(element)
      .clone(true)
      .select('.path')
      .attr('id', (d, i) => 'controlText' + index)
      .attr('style', 'fill: none;')
      .attr('marker-end', '')
      .each(function () {
        const path = d3.select(this);
        const newBezier = Bezier.SVGtoBeziers(path.attr('d'));
        const offsetCurve = newBezier.offset(35);
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
      .text(sanitise(controlText));
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
      .text(sanitise(shareText));
  };

  const createUnknownText = (index, element) => {
    d3.select(element).select('path').attr('id', `unknown${index}`);
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

  edges.forEach((edge, index) => {
    const { source, target, interests } = edge;
    const { shareholding, votingRights } = interests;

    let shareStroke = 1;
    let shareText = '';
    if (shareholding) {
      const { exact: shareExact, minimum: shareMin, maximum: shareMax } = {
        ...shareholding,
      };
      shareStroke = (shareExact === undefined ? (shareMin + shareMax) / 2 : shareExact) / 10;
      shareText = `Owns ${shareExact === undefined ? `${shareMin} - ${shareMax}` : shareExact}%`;
    }

    let controlStroke = 1;
    let controlText = '';
    if (votingRights) {
      const { exact: controlExact, minimum: controlMin, maximum: controlMax } = {
        ...votingRights,
      };
      controlStroke = (controlExact === undefined ? (controlMin + controlMax) / 2 : controlExact) / 10;
      controlText = `Controls ${
        controlExact === undefined ? `${controlMin} - ${controlMax}` : controlExact
      }%`;
    }

    const curveOffset = shareStroke / 2 + controlStroke / 2;
    const element = g.edge(source, target).elem;

    if ('shareholding' in interests) {
      const ended = shareholding ? shareholding.ended : false;
      createOwnershipCurve(element, index, shareStroke, curveOffset, ended);
    }
    if ('votingRights' in interests) {
      const ended = votingRights ? votingRights.ended : false;
      createControlCurve(element, index, controlStroke, ended);
    }

    // this will allow the labels to be turned off if there are too many nodes and edge labels overlap
    g.nodeCount() < 8 && createControlText(index, controlText);
    g.nodeCount() < 8 && createOwnText(index, shareText);
    g.nodeCount() < 8 &&
      !('shareholding' in interests) &&
      !('votingRights' in interests) &&
      createUnknownText(index, element);
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

  SVGInjectInstance(document.querySelectorAll('img.injectable'));

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
    svgsaver.asSvg(svg);
  });

  d3.select('#download-png').on('click', function () {
    var svgsaver = new SvgSaver();
    var svg = document.querySelector('#bods-svg');
    svgsaver.asPng(svg);
  });
};

export { draw };
