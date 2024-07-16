import * as d3 from 'd3';
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
