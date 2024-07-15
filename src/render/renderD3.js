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
