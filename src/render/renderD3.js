import * as d3 from 'd3';
import Bezier from 'bezier-js';
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
