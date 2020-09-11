import * as d3 from 'd3';

const clearSVG = async (container) => {
  d3.select(container).select('#bods-svg').remove();
  d3.select(container).append('svg').attr('id', 'bods-svg');
};

export { clearSVG };
