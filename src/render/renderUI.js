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
  const disclosureWidget = document.querySelector('#disclosure-widget');

  const nodes = inner.selectAll('g.node');
  nodes.each((d, i) => {
    const node = g.node(d);

    const description = JSON.stringify(node.description, null, 2);
    const fullDescription = JSON.stringify(node.fullDescription, null, 2);

    const tippyInstance = tippy(node.elem, {
      content: `<div class="button-container"><button id="close-tooltip">&times;</button></div><pre>${description}</pre>`,
      allowHTML: true,
      trigger: 'manual',
      hideOnClick: false,
      interactive: true,
      appendTo: document.body,
      onShow: () => {
        disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;
      },
    });

    node.elem.addEventListener('click', () => {
      tippyInstance.show();

      document.getElementById('close-tooltip').addEventListener('click', () => {
        tippyInstance.hide();
      });
    });
  });

  const edges = inner.selectAll('g.edgePath');
  edges.each((d, i) => {
    const edge = g.edge(d.v, d.w);

    const description = JSON.stringify(edge.description, null, 2);
    const fullDescription = JSON.stringify(edge.fullDescription, null, 2);

    const tippyInstance = tippy(edge.elem, {
      content: `<div class="button-container"><button id="close-tooltip">&times;</button></div><pre>${description}</pre>`,
      allowHTML: true,
      trigger: 'manual',
      hideOnClick: false,
      interactive: true,
      appendTo: document.body,
      onShow: () => {
        disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;
      },
    });

    edge.elem.addEventListener('click', () => {
      tippyInstance.show();

      document.getElementById('close-tooltip').addEventListener('click', () => {
        tippyInstance.hide();
      });
    });
  });
};
