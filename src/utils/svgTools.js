import * as d3 from 'd3';

const clearSVG = async () => {
  d3.select("#svg-holder").select("#bods-svg").remove();
  d3.select("#svg-holder").append("svg").attr('id', 'bods-svg');
}

export { clearSVG };
