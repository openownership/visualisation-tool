import * as d3 from 'd3';
import Bezier from 'bezier-js';
import SVGInjectInstance from '@iconfu/svg-inject';

import bezierBuilder from '../utils/bezierBuilder';
import { clearSVG } from '../utils/svgTools';

export const setupD3 = (container) => {
  // This ensures that the graph is drawn on a clean slate
  clearSVG(container);

  const svg = d3.select('#bods-svg');
  const inner = svg.append('g');

  return {
    svg,
    inner,
  };
};

export const defineArrowHeads = (svg) => {
  // Set up a load of arrow heads and markers for bespoke edge formats
  const half = svg
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

  const full = svg
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

  const blackHalf = svg
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

  const blackFull = svg
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

  const ownHalf = svg
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

  const ownFull = svg
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

  const ownBlackHalf = svg
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

  const ownBlackFull = svg
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

  return {
    half,
    full,
    ownHalf,
    ownFull,
    blackHalf,
    blackFull,
    ownBlackHalf,
    ownBlackFull,
  };
};

// define the additional offset curves and text for ownership and control edges
export const createOwnershipCurve = (
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

export const createControlCurve = (
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

export const createControlText = (svg, index, controlText) => {
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
    .text(controlText)
    .style('fill', '#349aee');
};

export const createOwnText = (svg, index, shareText) => {
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
    .text(shareText)
    .style('fill', '#652eb1');
};

export const createUnknownText = (svg, index, element) => {
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

export const setNodeLabelBkg = (color) => {
  d3.selectAll('.edgeLabels .edgeLabel .label, .nodes .node .label').each(function (d, i) {
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
      .style('fill', color);
  });
};

export const injectSVGElements = (imagesPath, inner, g) => {
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

  if (document.querySelector('img.injectable')) {
    // this allows SVGs to be injected directly from source
    SVGInjectInstance(document.querySelectorAll('img.injectable')).then(() => {
      d3.selectAll('.flag')
        .insert('rect', ':first-child')
        .attr('class', 'flag-bg')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('style', 'fill: white; stroke: black; stroke-width: 2px;');
    });
  }
};

export const setZoomTransform = (inner, svg, g) => {
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

  svg.attr('height', g.graph().height * initialScale + 400);
  svg.attr('width', g.graph().width * initialScale + 400);
  svg.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  return { zoom };
};
