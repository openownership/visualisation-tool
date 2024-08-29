import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import * as d3 from 'd3';

import { SvgSaver } from '../utils/svgsaver';

export const setupUI = (zoom, svg) => {
  const zoomInBtn = document.querySelector('#zoom_in');
  const zoomOutBtn = document.querySelector('#zoom_out');
  const downloadSVGBtn = document.querySelector('#download-svg');
  const downloadPNGBtn = document.querySelector('#download-png');
  const svgElement = document.querySelector('#bods-svg');

  const svgsaver = new SvgSaver();

  zoomInBtn.addEventListener('click', () => {
    zoom.scaleBy(svg.transition().duration(750), 1.2);
  });
  zoomInBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      zoom.scaleBy(svg.transition().duration(750), 1.2);
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    zoom.scaleBy(svg.transition().duration(750), 0.8);
  });
  zoomOutBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      zoom.scaleBy(svg.transition().duration(750), 0.8);
    }
  });

  downloadSVGBtn.addEventListener('click', () => {
    svgsaver.asSvg(svgElement, 'bods.svg');
  });
  downloadSVGBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      svgsaver.asSvg(svgElement, 'bods.svg');
    }
  });

  downloadPNGBtn.addEventListener('click', () => {
    svgsaver.asPng(svgElement, 'bods.png');
  });
  downloadPNGBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      svgsaver.asPng(svgElement, 'bods.png');
    }
  });
};

export const renderProperties = (inner, g) => {
  const nodes = inner.selectAll('g.node');
  nodes.each((d, i) => {
    const node = g.node(d);

    const content = JSON.stringify(node.description, null, 2);

    tippy(node.elem, {
      content: `<pre>${content}</pre>`,
      allowHTML: true,
      trigger: 'click',
      interactive: true,
      appendTo: document.body,
    });
  });

  const edges = inner.selectAll('g.edgePath');
  edges.each((d, i) => {
    const edge = g.edge(d.v, d.w);

    const content = JSON.stringify(g.edge(d.v, d.w).description, null, 2);

    tippy(edge.elem, {
      content: `<pre>${content}</pre>`,
      allowHTML: true,
      trigger: 'click',
      interactive: true,
      appendTo: document.body,
    });
  });
};
