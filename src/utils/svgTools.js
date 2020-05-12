import * as d3 from 'd3';

const downloadSVG = () => {
  var html = d3
    .select('svg')
    .attr('title', 'BODS-Diagram')
    .attr('version', 1.1)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .node().outerHTML;
  var svgBlob = new Blob([html], { type: 'image/svg+xml;charset=utf-8' });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = 'bods-svg.svg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const clearSVG = async () => {
  d3.select("#svg-holder").select("#bods-svg").remove();
  d3.select("#svg-holder").append("svg").attr('id', 'bods-svg');
}

export { downloadSVG, clearSVG };
